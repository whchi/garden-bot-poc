const { LineBot, MongoSessionStore } = require('bottender');
const { createServer } = require('bottender/koa');
const memberRouter = require('./routes/member');
const backendUserRouter = require('./routes/backend/user');
const backendIndexRouter = require('./routes/backend/index');
const env = require('./env');
const messageService = require('./services/message');
const config = require('./bottender.config.js').line;
const timeout = 300;
const serve = require('koa-static');
const path = require('path');
const cannedMessage = require('./helpers/cannedMessage');

const bot = new LineBot({
  accessToken: config.accessToken,
  channelSecret: config.channelSecret,
  sessionStore: new MongoSessionStore('mongodb://localhost:27017/')
});

bot.setInitialState({
  status: env.SESSION_STATE.CHAT_STATE,
  orderType: '',
  txId: '',
  startFrom: 0,
  orderFailCnt: 0
});

bot.onEvent(async context => {
  if (!!context.session) {
    console.log(
      '==========session exists==========' +
        Math.floor(
          context.event.rawEvent.timestamp - context.session.lastActivity
        ) /
          1000
    );
    if (
      Math.floor(
        context.event.rawEvent.timestamp - context.session.lastActivity
      ) /
        1000 >
      timeout
    ) {
      context.resetState();
    }
  }
  // event
  try {
    if (context.event.isMessage) {
      messageService.saveMessage(context);
      await messageService.handleMessageEvent(context);
    } else if (context.event.isPayload) {
      messageService.handlePostbackEvent(context);
    } else if (context.event.isJoin || context.event.isFollow) {
      await context.replyText(cannedMessage.text.welcomeMessage);
      messageService.saveBotMessage(
        cannedMessage.text.welcomeMessage,
        context.state.orderType,
        context.state.txId
      );
    } else {
      await context.replyText('not implement');
      messageService.saveBotMessage(
        'not implement',
        context.state.orderType,
        context.state.txId
      );
    }
  } catch (error) {
    console.error(error);
  }
});

const server = createServer(bot);
server
  .use(memberRouter.routes())
  .use(backendUserRouter.routes())
  .use(backendIndexRouter.routes());

server.use(serve(path.join(__dirname, 'static')));

server.listen(5000, () => {
  console.log('server is running on 5000 port...');
});
