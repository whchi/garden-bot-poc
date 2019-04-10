const Router = require('koa-router');
const fs = require('fs');
const busboy = require('koa-busboy');
const service = require('../../services/backend/index');
const orderService = require('../../services/order');
const messageService = require('../../services/message');

const uploader = busboy({
  dest: './upload' // default is system temp folder( os.tmpdir() )
});

let router = new Router({
  prefix: '/admin/index'
});
router.get('/', (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./views/backend/index.html');
});
// old
router.post('/products/push', uploader, async (ctx, next) => {
  try {
    let body = ctx.request.body;
    let img = ctx.request.files[0];
    await service.pushProductMessage(
      body.productType,
      body.desc,
      img,
      ctx.header.origin
    );
    ctx.response.status = 200;
    ctx.response.type = 'json';
    ctx.response.body = {
      isSuccess: true
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.type = 'json';
    ctx.response.body = {
      isSuccess: false,
      msg: error
    };
  }
});
// new
router.post('/products/push/new', async (ctx, next) => {
  try {
    let body = ctx.request.body;
    await service.pushProductMessageNew(body.productType, body.desc, body.imgUri);
    ctx.response.status = 200;
    ctx.response.type = 'json';
    ctx.response.body = {
      isSuccess: true
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.type = 'json';
    ctx.response.body = {
      isSuccess: false,
      msg: error
    };
  }
});
router.get('/order/:orderType', async (ctx, next) => {
  try {
    let orderList = await orderService.getOrderListByType(ctx.params.orderType);
    ctx.response.status = 200;
    ctx.response.type = 'json';
    ctx.response.body = {
      isSuccess: true,
      payload: JSON.stringify(orderList)
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      isSuccess: false,
      msg: error
    };
  }
});

router.get('/order/detail/:txId', async (ctx, next) => {
  try {
    let order = await orderService.getOrderByTxId(ctx.params.txId);
    let messages = await messageService.getOrderMessages(ctx.params.txId);

    let msgs = messages.map(ele => {
      let raw = JSON.parse(ele.payload);
      let msg = {
        text: String,
        userId: String
      };
      msg.text = raw.message.text;
      msg.userId = raw.source.userId;
      return msg;
    });

    ctx.response.status = 200;
    ctx.response.type = 'json';
    ctx.response.body = {
      isSuccess: true,
      order: order,
      msgList: msgs
    };
  } catch (error) {
    ctx.response.status = 500;
  }
});

module.exports = router;
