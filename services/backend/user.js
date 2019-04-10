const db = require('../../database/backendUser');
const model = db.backendUser;

function login(account, pwd) {
  return new Promise((resolve, reject) => {
    model
      .findOne({ account: account, password: pwd })
      .then(res => {
        if (!res) {
          return reject('invalid user');
        }
        resolve(res);
      })
      .catch(reject);
  });
}

function init() {
  model.create(
    {
      name: 'admin',
      account: 'admin',
      password: 'admin',
      type: 0
    },
    err => {
      console.error(err);
    }
  );
}

module.exports = { login };
