const Router = require('koa-router');
const env = require('../env');

let router = new Router({
  prefix: '/product/'
});
module.exports = router;
