const db = require('../database/message');
const model = db.message;
const cannedMessage = require('../helpers/cannedMessage');
const orderService = require('../services/order');
const productService = require('../services/product');
const env = require('../env');
const orderHelper = require('../helpers/order');
const memberService = require('../services/member');

function saveBotMessage(content, orderType, txId) {
  model.create(
    {
      payload: JSON.stringify({
        source: { userId: 'robot' },
        message: { text: content }
      }),
      type: 'robot response',
      reply_token: '',
      content: content,
      uid: 'robot',
      user_status: env.SESSION_STATE.ROBOT_STATE,
      order_type: orderType,
      tx_id: txId
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      return true;
    }
  );
}
function getMembers() {
  return new Promise((resolve, reject) => {
    model
      .aggregate([
        {
          $group: {
            _id: '$uid'
          }
        }
      ])
      .then(docs => {
        resolve(docs.map(e => e._id));
      })
      .catch(reject);
  });
}

function getOrderMessages(txId) {
  return new Promise((resolve, reject) => {
    model
      .find({ tx_id: txId })
      .then(resolve)
      .catch(reject);
  });
}
function _getOrderList() {
  return new Promise((resolve, reject) => {
    model
      .aggregate([
        {
          $group: {
            _id: '$tx_id',
            count: { $sum: 1 },
            order_type: { $first: '$order_type' }
          }
        },
        {
          $sort: { created_at: -1 }
        }
      ])
      .then(docs => {
        let r = docs.filter(e => e._id);
        resolve(
          r.map(ee => {
            return { txId: ee._id, count: ee.count, order_type: ee.order_type };
          })
        );
      })
      .catch(reject);
  });
}

function saveMessage(ctx) {
  let content = '';
  switch (ctx.event.message.type) {
    case 'text':
      content = ctx.text;
      break;
    case 'image':
      content = ctx.image;
      break;
    case 'video':
      content = ctx.video;
      break;
    case 'audio':
      content = ctx.audio;
      break;
    case 'location':
      content = ctx.location;
      break;
    case 'sticker':
      content = ctx.sticker;
      break;
    case 'follow':
      content = ctx.follow;
      break;
    case 'unfollow':
      content = ctx.unfollow;
      break;
  }
  model.create(
    {
      payload: JSON.stringify(ctx.event.rawEvent),
      type: ctx.event.message.type,
      reply_token: ctx.replyToken,
      content: content,
      uid: ctx.session.user.id,
      user_status: ctx.state.status,
      order_type: ctx.state.orderType,
      tx_id: ctx.state.txId
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      return true;
    }
  );
}
// event handlers
async function handleMessageEvent(ctx) {
  if (ctx.event.isText) {
    const { text } = ctx.event.message;

    if (text === 'dev-status') {
      return ctx.replyText(ctx.state.status);
    } else if (text === '小香安靜') {
      ctx.setState({ status: env.SESSION_STATE.MUTE_STATE });
      return ctx.replyText('好喔好喔');
    } else if (text === '小香說話') {
      ctx.resetState();
      return ctx.replyText('不要');
    } else if (text === 'dev-cancel-all-status') {
      ctx.resetState();

      return ctx.replyText('reset status');
    }

    switch (ctx.state.status) {
      case env.SESSION_STATE.CHAT_STATE:
        // if (commonHelper.stateIsExpired(ctx)) {
        //   ctx.replyText(cannedMessage.text.stateIsExpired);
        //   return ctx.resetState();
        // }
        await _generalHandler(text, ctx);
        break;
      case env.SESSION_STATE.PURCHASE_STATE:
        // if (commonHelper.stateIsExpired(ctx)) {
        //   ctx.resetState();
        //   return ctx.replyText(cannedMessage.text.expired);
        // }
        let o = await _orderHandler(text, ctx);
        if (o === 'success' || o === 'cancel') {
          ctx.resetState();
        }
        break;
      case env.SESSION_STATE.SEARCH_STATE:
        if (text === '結束搜尋') {
          ctx.resetState();
          訂(
            cannedMessage.text.resetState,
            ctx.state.orderType,
            ctx.state.txId
          );
          return ctx.replyText(cannedMessage.text.resetState);
        }
        await _searchHandler(text, ctx);
        break;
      case env.SESSION_STATE.UPLOAD_STATE:
        if (text === '結束集點') {
          ctx.resetState();
          saveBotMessage(
            cannedMessage.text.resetState,
            ctx.state.orderType,
            ctx.state.txId
          );
          return ctx.replyText(cannedMessage.text.resetState);
        } else {
          saveBotMessage(
            cannedMessage.text.unknown,
            ctx.state.orderType,
            ctx.state.txId
          );
          return ctx.replyText(cannedMessage.text.unknown);
        }
      case env.SESSION_STATE.EXCHANGE_POINTS_STATE:
        if (text === '結束兌獎') {
          ctx.resetState();
          saveBotMessage(
            cannedMessage.text.resetState,
            ctx.state.orderType,
            ctx.state.txId
          );
          return ctx.replyText(cannedMessage.text.resetState);
        } else {
          saveBotMessage(
            cannedMessage.text.unknown,
            ctx.state.orderType,
            ctx.state.txId
          );
          return ctx.replyText(cannedMessage.text.unknown);
        }
    }
  } else if (ctx.event.isImage) {
    if (ctx.state.status === env.SESSION_STATE.UPLOAD_STATE) {
      let r = Math.floor(Math.random() * 2);
      console.log('randomResult: ' + r);
      if (r !== 1) {
        saveBotMessage(
          cannedMessage.text.recognizeInvoiceFail,
          ctx.state.orderType,
          ctx.state.txId
        );
        return ctx.replyText(cannedMessage.text.recognizeInvoiceFail);
      }
      // 上傳發票積點
      let member = await ssoCheck(ctx);
      if (member) {
        let newPoints = member.points + 100;
        await memberService.modifyMemberPoints(member._id, newPoints);
        ctx.replyText(cannedMessage.text.addPoints);
        saveBotMessage(
          cannedMessage.text.addPoints,
          ctx.state.orderType,
          ctx.state.txId
        );
        ctx.resetState();
      }
    } else {
      saveBotMessage(
        cannedMessage.text.unknown,
        ctx.state.orderType,
        ctx.state.txId
      );
      ctx.replyText(cannedMessage.text.unknown);
    }
    // get uploaded image
    // const client = new line.Client({
    //   channelAccessToken: config.accessToken
    // });
    // client.getMessageContent(ctx.event.image.id).then(s => {
    //   var imageData = '';
    //   s.setEncoding('binary');
    //   s.on('data', c => {
    //     imageData += c;
    //   });
    //   console.log(imageData);
    //   s.on('end', () => {
    //     fs.writeFile(
    //       __dirname + '/../public/images/' + ctx.event.image.id + '.png',
    //       imageData,
    //       { encoding: 'utf8' },
    //       err => {
    //         if (err) throw err;
    //         console.log('file saved');
    //       }
    //     );
    //   });
    //   s.on('error', err => {
    //     throw err;
    //   });
    // });
  }
}

// 只有交易行為才會有 postback event, 有交易行為表示有 txId
function handlePostbackEvent(ctx) {
  //   if (commonHelper.stateIsExpired(ctx)) {
  //     ctx.replyText(cannedMessage.text.stateIsExpired);
  //     return ctx.resetState();
  //   }

  let payload = ctx.event.payload;
  // 繼續購物行為
  if (ctx.state.status === env.SESSION_STATE.PURCHASE_STATE) {
    if (payload.indexOf('reset=') >= 0) {
      if (payload.indexOf('y') >= 0) {
        ctx.setState({ orderFailCnt: 0 });
        saveBotMessage('繼續訂購文案', ctx.state.orderType, ctx.state.txId);
        return ctx.reply([
          cannedMessage.composite.text.orderBegin,
          cannedMessage.composite.text[`${ctx.state.orderType}Order`]
        ]);
      } else {
        ctx.replyText(cannedMessage.text.orderCancel);
        saveBotMessage(
          cannedMessage.text.orderCancel,
          ctx.state.orderType,
          ctx.state.txId
        );
        return ctx.resetState();
      }
    }
    saveBotMessage(
      cannedMessage.text.pleaseFinishOrder,
      ctx.state.orderType,
      ctx.state.txId
    );
    return ctx.replyText(cannedMessage.text.pleaseFinishOrder);
  }
  // 兌獎行為-
  if (
    ctx.state.status === env.SESSION_STATE.EXCHANGE_POINTS_STATE &&
    payload === 'get-a-coffee'
  ) {
    ctx.replyText(cannedMessage.text.getACoffee);
    return ctx.resetState();
  }
  if (ctx.state.txId === '') {
    saveBotMessage(
      cannedMessage.text.unknown,
      ctx.state.orderType,
      ctx.state.txId
    );
    return ctx.replyText(cannedMessage.text.unknown);
  }
}
// message handlers
async function _generalHandler(text, ctx) {
  if (/訂位|訂餐/g.test(text)) {
    let orderType = text.indexOf('訂餐') >= 0 ? 'menu' : 'seat';
    let replyMsg = [cannedMessage.composite.text[`${orderType}OrderBegin`]];
    if (orderType === 'menu') {
      replyMsg.push(cannedMessage.composite.image.menu);
    }
    replyMsg.push(cannedMessage.composite.text[`${orderType}Order`]);
    ctx.reply(replyMsg);
    saveBotMessage('訂單啟動文案', ctx.state.orderType, ctx.state.txId);
    let dt = Date.now();
    let ts = Math.floor(dt / 1000);
    ctx.setState({
      status: env.SESSION_STATE.PURCHASE_STATE,
      orderType: orderType,
      startFrom: ts,
      txId: orderHelper.generateTXID()
    });
  } else if (/找書/g.test(text)) {
    _searchStart(ctx);
  } else if (/集點/g.test(text)) {
    ctx.setState({ status: env.SESSION_STATE.UPLOAD_STATE });
    let u = await _uploadInvoiceStart(ctx);
    if (u === 'reset') {
      ctx.resetState();
    }
  } else if (/兌獎/g.test(text)) {
    ctx.setState({ status: env.SESSION_STATE.EXCHANGE_POINTS_STATE });
    let p = await _pointsExchange(ctx);
    if (p === 'reset') {
      ctx.resetState();
    }
  } else if (text === 'dev-auth') {
    ssoCheck(ctx).then(() => {
      ctx.getUserProfile().then(profile => {
        ctx.replyText('親愛的 @' + profile.displayName + ' 您已經登入過摟');
      });
    });
    // ctx.replyConfirmTemplate(
    //   'this is a confirm template',
    //   cannedMessage.confirmTemplate.sso
    // );
  } else {
    _randomReply(ctx);
  }
}

function _orderHandler(text, ctx) {
  return new Promise((resolve, reject) => {
    if (/取消訂單/g.test(text)) {
      ctx.replyText(cannedMessage.text.orderCancel);
      saveBotMessage(
        cannedMessage.text.orderCancel,
        ctx.state.orderType,
        ctx.state.txId
      );
      return resolve('cancel');
    }

    let payload = {};
    let orderType = ctx.state.orderType;
    let nicknamePattern = /暱稱:\s?[A-z\u4e00-\u9eff]{1,5}/gi;
    let contactPattern = /聯絡電話:\s?09[0-9]{1,8}/g;
    let seatDatePattern = /用餐日期:\s?(\d{4})\/(0?[0-9]|1[012])\/([0-3]?[0-9])/g;
    let seatTimePattern = /用餐時間:\s?(?:([01]?\d|2[0-3])):([0-5]?\d)/g;
    let consumeTimePattern = /(用|取)餐時間:\s?(0?[0-9]|1[012])-([0-3]?[0-9])\s(?:([01]?\d|2[0-3])):([0-5]?\d)/g;
    let seatCountPattern = /用餐人數:\s?[0-9]\s/g;
    let menuPattern = /([\-A-z\u4e00-\u9eff]{1,20}x[1-9]\s?){1,}/g;
    let menuProductInfoPattern = /餐點:\s?([\-A-z\u4e00-\u9eff]{1,20}x[1-9]\s?){1,}/g;

    if (nicknamePattern.test(text)) {
      payload.nickname = text
        .match(nicknamePattern)[0]
        .substr(3)
        .trim();
    }
    if (contactPattern.test(text)) {
      payload.contact = text
        .match(contactPattern)[0]
        .substr(5)
        .trim();
    }
    // if (consumeTimePattern.test(text)) {
    //   payload.consume_time = text
    //     .match(consumeTimePattern)[0]
    //     .substr(5)
    //     .trim();
    // }
    switch (orderType) {
      case 'seat':
        if (seatCountPattern.test(text)) {
          payload.count = text
            .match(seatCountPattern)[0]
            .substr(5)
            .trim();
        }
        let dt = '';
        if (seatDatePattern.test(text)) {
          dt += text
            .match(seatDatePattern)[0]
            .substr(5)
            .trim();
        }
        if (seatTimePattern.test(text)) {
          dt +=
            ' ' +
            text
              .match(seatTimePattern)[0]
              .substr(5)
              .trim();
        }
        payload.consume_time = dt;
        break;
      case 'menu':
        if (menuProductInfoPattern.test(text)) {
          payload.product_info = text
            .match(menuProductInfoPattern)[0]
            .substr(3)
            .trim();
        }
        break;
    }

    payload.tx_id = ctx.state.txId;
    payload.line_uid = ctx.session.user.id;
    let err = orderHelper.validateOrderColumn(orderType, payload);
    if (err.join('').length > 0) {
      ctx.state.orderFailCnt++;
      if (ctx.state.orderFailCnt > 2) {
        ctx.replyButtonTemplate(
          'this is a template message',
          cannedMessage.buttonTemplate.resetOrderFail
        );
        saveBotMessage('繼續訂購文案', ctx.state.orderType, ctx.state.txId);
        return resolve(null);
      }
      ctx.replyText(cannedMessage.text.createOrderFail);
      saveBotMessage(
        cannedMessage.text.createOrderFail,
        ctx.state.orderType,
        ctx.state.txId
      );
      return reject(null);
    }

    let cond = {
      line_uid: payload.line_uid,
      status: env.ORDER_STATE.UNPAID,
      is_handle: false,
      tx_id: payload.tx_id
    };

    orderService.getOrderRecord(cond, orderType).then(res => {
      if (!res) {
        orderService
          .createOrderRecord(payload, orderType)
          .then(res => {
            ctx.replyText(
              cannedMessage.text[
                `create${orderType.charAt(0).toUpperCase() +
                  orderType.slice(1)}OrderSuccess`
              ]
            );
            saveBotMessage(
              cannedMessage.text[
                `create${orderType.charAt(0).toUpperCase() +
                  orderType.slice(1)}OrderSuccess`
              ],
              ctx.state.orderType,
              ctx.state.txId
            );

            resolve('success');
          })
          .catch(err => {
            ctx.replyText(cannedMessage.text.createOrderFail);
            saveBotMessage(
              cannedMessage.text.createOrderFail,
              ctx.state.orderType,
              ctx.state.txId
            );
            reject(err);
          });
      } else {
        ctx.replyText(cannedMessage.text.orderExists);
        saveBotMessage(
          cannedMessage.text.orderExists,
          ctx.state.orderType,
          ctx.state.txId
        );
        reject('order exists');
      }
    });
  });
}

function _searchHandler(text, ctx) {
  return new Promise((resolve, reject) => {
    productService
      .fuzzleGetBooks(text, 10)
      .then(books => {
        let template = cannedMessage.composite.carouselTemplate.product;

        let columns = books.map(ele => {
          let clone = {
            title: String,
            text: String,
            thumbnailImageUrl: String,
            actions: [
              {
                type: 'uri',
                label: '我要購買',
                uri: String
              }
            ]
          };
          clone.title = ele.title + `(${ele.points})`;
          clone.text = ele.desc.substr(0, 10) + '...';
          clone.thumbnailImageUrl = ele.img;
          clone.actions[0].uri = ele.url;
          return clone;
        });
        template.template.columns = columns;
        ctx.reply([cannedMessage.composite.text.foundBooks, template]);
        saveBotMessage('呈現搜尋結果文案', ctx.state.orderType, ctx.state.txId);
      })
      .catch(err => {
        if (err === 'empty result') {
          saveBotMessage(
            cannedMessage.text.searchEmpty,
            ctx.state.orderType,
            ctx.state.txId
          );
          return ctx.replyText(cannedMessage.text.searchEmpty);
        }
        ctx.replyText(cannedMessage.text.systemFail);
        saveBotMessage(
          cannedMessage.text.systemFail,
          ctx.state.orderType,
          ctx.state.txId
        );
      });
  });
}

function ssoCheck(ctx) {
  return new Promise((resolve, reject) => {
    memberService
      .getMemberByLineId(ctx.session.user.id)
      .then(resolve)
      .catch(err => {
        switch (ctx.state.status) {
          case env.SESSION_STATE.EXCHANGE_POINTS_STATE:
            ctx.reply([
              cannedMessage.composite.text.unknownPoints,
              cannedMessage.composite.confirmTemplate.sso
            ]);
            saveBotMessage(
              'sso-紅利積點請求登入文案',
              ctx.state.orderType,
              ctx.state.txId
            );

            return resolve(false);
          case env.SESSION_STATE.UPLOAD_STATE:
            ctx.reply([
              cannedMessage.composite.text.invoiceNotice,
              cannedMessage.composite.confirmTemplate.sso
            ]);
            saveBotMessage(
              'sso-上傳發票文案',
              ctx.state.orderType,
              ctx.state.txId
            );

            return resolve(false);
          default:
            ctx.replyConfirmTemplate(
              'this is a confirm template',
              cannedMessage.confirmTemplate.sso
            );
            saveBotMessage(
              'sso請求登入文案',
              ctx.state.orderType,
              ctx.state.txId
            );

            return reject(err);
        }
      });
  });
}
async function _pointsExchange(ctx) {
  let member = await ssoCheck(ctx);
  if (member) {
    let products = await productService.getProducts(6);
    if (!!products) {
      let template = cannedMessage.composite.carouselTemplate.product;

      let columns = products.map(ele => {
        if (ele.points <= member.points) {
          let clone = {
            title: String,
            text: String,
            thumbnailImageUrl: String,
            actions: [{}]
          };
          clone.title = ele.title + `(${ele.points})`;
          clone.text = ele.desc.substr(0, 10) + '...';
          clone.thumbnailImageUrl = ele.img;
          if (ele.type === env.PRODUCT_TYPE.SUBSCRIBE) {
            clone.actions[0].type = 'postback';
            clone.actions[0].displayText = '我要兌換';
            clone.actions[0].data = 'get-a-coffee';
          } else {
            clone.actions[0].type = 'uri';
            clone.actions[0].uri = ele.url;
          }
          clone.actions[0].label = '我要兌換';
          return clone;
        }
      });
      template.template.columns = columns;
      ctx.reply([
        {
          type: 'text',
          text: cannedMessage.text.points.replace('{POINTS}', member.points)
        },
        template
      ]);
      saveBotMessage('紅利積點文案', ctx.state.orderType, ctx.state.txId);
    }
  } else {
    return Promise.resolve('reset');
  }
}
// message sender
function _searchStart(ctx) {
  ctx.replyText(cannedMessage.text.searchStart);

  saveBotMessage(
    cannedMessage.text.searchStart,
    ctx.state.orderType,
    ctx.state.txId
  );

  ctx.setState({ status: env.SESSION_STATE.SEARCH_STATE });
}
async function _uploadInvoiceStart(ctx) {
  let member = await ssoCheck(ctx);
  if (member) {
    await ctx.replyText(cannedMessage.text.invoiceNotice);

    saveBotMessage(
      cannedMessage.text.invoiceNotice,
      ctx.state.orderType,
      ctx.state.txId
    );
  } else {
    return Promise.resolve('reset');
  }
}
function _randomReply(ctx) {
  let idx = Math.floor(Math.random() * 5);
  ctx.replyText(cannedMessage.text.random[idx]);

  saveBotMessage(
    cannedMessage.text.random[idx],
    ctx.state.orderType,
    ctx.state.txId
  );
}
module.exports = {
  saveBotMessage,
  getMembers,
  getOrderMessages,
  saveMessage,
  handleMessageEvent,
  handlePostbackEvent
};
