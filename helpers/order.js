const uuidv4 = require('uuid/v4');
const MENU_RULE = [
  'contact',
  'nickname',
  'product_info',
  'tx_id'
];
const SEAT_RULE = ['contact', 'nickname', 'consume_time', 'count', 'tx_id'];

function generateTXID() {
  return uuidv4();
}

function validateOrderColumn(orderType, obj) {
  let errors = [];

  switch (orderType) {
    case 'menu':
      errors.push(_checkColKeys(MENU_RULE, Object.keys(obj)));
      break;
    case 'seat':
      errors.push(_checkColKeys(SEAT_RULE, Object.keys(obj)));
      break;
  }
  return errors;
}

function _checkColKeys(pattern, src) {
  let err = '';
  let leak = pattern.filter(function(n) {
    return !this.has(n);
  }, new Set(src));
  if (!!leak[0]) {
    err += 'leak of columns [';
    for (let i = 0; i < leak.length; i++) {
      if (leak.length === 1 || i === leak.length - 1) {
        err += leak[i];
      } else {
        err += leak[i] + '、';
      }
    }
    err += '];';
  }
  return err;
}
module.exports = {
  generateTXID,
  validateOrderColumn
};
