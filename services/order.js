const db = require('../database/order');
const productOrderModel = db.productOrder;
const seatOrderModel = db.seatOrder;
const env = require('../env');

function createOrderRecord(payload, orderType) {
  return new Promise((resolve, reject) => {
    let model = orderType === 'seat' ? seatOrderModel : productOrderModel;

    model
      .create(payload)
      .then(() => {
        resolve(true);
      })
      .catch(err => {
        throw err;
      });
  });
}

function getOrderListByType(orderType) {
  return new Promise((resolve, reject) => {
    switch (orderType) {
      case 'seat':
        getSeatOrderList()
          .then(resolve)
          .catch(reject);
        break;
      case 'menu':
        getProductOrderList()
          .then(resolve)
          .catch(reject);
        break;
    }
  });
}

function getSeatOrderList() {
  return new Promise((resolve, reject) => {
    seatOrderModel
      .find()
      .sort({ created_at: -1 })
      .then(resolve)
      .catch(reject);
  });
}

function getProductOrderList() {
  return new Promise((resolve, reject) => {
    productOrderModel
      .find()
      .sort({ created_at: -1 })
      .then(resolve)
      .catch(reject);
  });
}

function getOrderByTxId(txId) {
  return new Promise(async (resolve, reject) => {
    seatOrderModel
      .findOne({ tx_id: txId })
      .then(async res => {
        if (!res) {
          return resolve(await productOrderModel.findOne({ tx_id: txId }));
        }
        resolve(res);
      })
      .catch(reject);
  });
}

function getOrderRecord(cond, orderType) {
  return new Promise((resolve, reject) => {
    let model = orderType === 'seat' ? seatOrderModel : productOrderModel;

    model.findOne(cond, (err, data) => {
      if (err) {
        throw err;
      }
      resolve(data);
    });
  });
}
module.exports = {
  getOrderListByType,
  createOrderRecord,
  getOrderRecord,
  getOrderByTxId,
  getSeatOrderList,
  getProductOrderList
};
