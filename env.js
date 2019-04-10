const SESSION_STATE = {
  CHAT_STATE: 0,
  LOGIN_STATE: 1,
  PURCHASE_STATE: 2,
  SEARCH_STATE: 3,
  UPLOAD_STATE: 4,
  EXCHANGE_POINTS_STATE: 5,
  MUTE_STATE: 99,
  ROBOT_STATE: 999,
};
const ORDER_STATE = {
  UNPAID: 0,
  PAID: 1,
  CANCEL: 2
};
const PRODUCT_TYPE = {
  BOOK: 0,
  SUBSCRIBE: 1 // 全閱讀,
};
module.exports = {
  SESSION_STATE,
  ORDER_STATE,
  PRODUCT_TYPE
};
