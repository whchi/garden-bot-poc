const Router = require('koa-router');
const fs = require('fs');
const service = require('../../services/backend/user');

let router = new Router({
  prefix: '/admin/'
});

// login html related
router.get('login', (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./views/backend/login.html');
});
router.post('login', async (ctx, next) => {
  try {
    let account = ctx.request.body.account;
    let pwd = ctx.request.body.password;
    let user = await service.login(account, pwd);
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./views/backend/index.html');
  } catch (error) {
    ctx.body = 'something went wrong...' + error;
    ctx.status = 500;
  }
});
module.exports = router;
