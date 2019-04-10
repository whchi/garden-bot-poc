const Router = require('koa-router');
const productOrderService = require('../services/productOrder');
const memberService = require('../services/member');
const env = require('../env');
const productOrderHelper = require('../helpers/productOrder');
let router = new Router({
  prefix: '/order/'
});

router.post('create/:type', async (ctx, next) => {
  console.log(ctx.request);
  console.log('=================');
  if (
    ctx.params.type.indexOf('menu') === false ||
    ctx.params.type.indexOf('seat') === false
  ) {
    throw 'invalid type';
  }
  ctx.response.type = 'json';
  let platformUid = ctx.request.query['yoctol.user.id'];
  let type = ctx.params.type;
  try {
    await productOrderService.createOrderRecord(platformUid, type).then(res => {
      ctx.response.status = 200;
      if (res === 'order exists') {
        ctx.response.body = {
          messages: [
            {
              type: 'text',
              text: '訂單已存在'
            }
          ]
        };
      }
    });

    await memberService.setMemberState(platformUid, env.SESSION_STATE.PURCHASE_STATE);
  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
  }
});

router.put('modify/:type', async (ctx, next) => {
  if (
    ctx.params.type.indexOf('menu') === false ||
    ctx.params.type.indexOf('seat') === false
  ) {
    throw 'invalid type';
  }
  ctx.response.type = 'json';
  let platformUid = ctx.request.query['yoctol.user.id'];
  let type = ctx.params.type;
  let payload = ctx.request.query['yoctol.event.text'];
  let dataObj = productOrderHelper.matchOrder(payload, type);
  console.log(dataObj);
  await memberService
    .getMemberIsPurchasing(platformUid, env.SESSION_STATE.PURCHASE_STATE)
    .then(user => {})
    .catch(console.error);
});

module.exports = router;
