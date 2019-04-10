const db = require('../database/member');
const model = db.member;

function setMemberState(lineUid, state) {
  return new Promise((resolve, reject) => {
    model.findOneAndUpdate(
      { line_uid: lineUid },
      { state: state },
      (err, doc, res) => {
        if (err) {
          return reject(err);
        }
        console.log(doc);
        resolve(doc);
      }
    );
  });
}

function getMemberByLineId(lineUid) {
  return new Promise((resolve, reject) => {
    model
      .findOne({ line_uid: lineUid })
      .then(res => {
        if (!!res) {
          return resolve(res);
        }
        reject(false);
      })
      .catch(reject);
  });
}
function login(account, password) {
  return new Promise((resolve, reject) => {
    model.findOne({ account: account, password: password }, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

function sso(userId, lineData) {
  return new Promise((resolve, reject) => {
    let lineUid = JSON.parse(lineData).userId;
    model.findByIdAndUpdate(
      userId,
      { line_uid: lineUid, line_data: lineData },
      (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      }
    );
  });
}

function getMemberIsPurchasing(lineUid, state) {
  return new Promise((resolve, reject) => {
    model.findOne({ line_uid: lineUid, state: state }, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

function modifyMemberPoints(memberId, newPoints) {
  return new Promise((resolve, reject) => {
    model
      .findOneAndUpdate({ _id: memberId }, { points: newPoints })
      .then(resolve)
      .catch(reject);
  });
}

function init() {
  model.create(
    {
      name: 'admin',
      account: 'admin',
      password: 'admin',
      line_uid: '',
      line_data: ''
    },
    err => {
      console.error(err);
    }
  );
}
module.exports = {
  getMemberByLineId,
  login,
  sso,
  setMemberState,
  getMemberIsPurchasing,
  modifyMemberPoints
};
