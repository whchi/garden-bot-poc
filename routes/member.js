const Router = require('koa-router');
const fs = require('fs');
const memberService = require('../services/member');
const env = require('../env');

let router = new Router({
  prefix: '/'
});

router.post('sso-check', async (ctx, next) => {
  try {
    ctx.response.type = 'json';
    let paltformUid = ctx.request.query['yoctol.user.id'];
    await memberService
      .getMemberByLineId(paltformUid)
      .then(user => {
        let lineData = JSON.parse(user.line_data);
        ctx.response.body = {
          messages: [
            {
              type: 'text',
              text: `您好 @${lineData.displayName}, 歡迎使用`
            }
          ]
        };
        ctx.response.status = 200;
      })
      .catch(err => {
        ctx.response.body = {
          messages: [
            {
              type: 'template',
              altText: 'confirm template',
              template: {
                type: 'confirm',
                actions: [
                  {
                    type: 'uri',
                    label: '是',
                    uri: 'line://app/1563264226-MO59P0NL'
                  },
                  {
                    type: 'message',
                    label: '否',
                    text: '否'
                  }
                ],
                text: '是否進行登入?'
              }
            }
          ]
        };
        ctx.response.status = 200;
      });
  } catch (err) {
    ctx.body = 'something happened...' + err;
    ctx.status = 500;
  }
});

// login html related
router
  .get('login-success', (ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./views/login-success.html');
  })
  .get('login', (ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./views/login.html');
  });

router.post('login', async (ctx, next) => {
  try {
    let account = ctx.request.body.account;
    let pwd = ctx.request.body.password;
    let lineData = ctx.request.body.lineData;
    await memberService
      .login(account, pwd)
      .then(async user => {
        await memberService
          .sso(user._id, lineData)
          .then(res => {
            ctx.response.redirect('/login-success');
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        throw err;
      });
  } catch (error) {
    ctx.body = 'something went wrong...' + error;
    ctx.status = 500;
  }
});
module.exports = router;
