const line = require('@line/bot-sdk');
const config = require('../../bottender.config').line;
const fs = require('fs');
const client = new line.Client({
  channelAccessToken: config.accessToken
});
const messageService = require('../message');

function pushProductMessage(type, desc, file, host) {
  return new Promise((resolve, reject) => {
    if (file.mimetype.indexOf('image/png') < 0) {
      return reject('file type error');
    }
    let filePath = 'static/image/' + file.filename;
    let f = fs.createWriteStream(filePath);
    fs.createReadStream(file.path).pipe(f);
    f.on('close', async () => {
      let imgUri = host + '/' + filePath;
      let toPush = await messageService.getMembers();
      let members = toPush.filter(ele => ele !== 'robot');
      let headMsg = type === 'product' ? '新食物來摟～～～' : '新書快報！';
      client
        .multicast(members, [
          {
            type: 'text',
            text: headMsg
          },
          {
            type: 'image',
            originalContentUrl: imgUri,
            previewImageUrl: imgUri,
            animated: false
          },
          {
            type: 'text',
            text: desc
          }
        ])
        .then(res => {
          console.log('push success');
          resolve(true);
        })
        .catch(err => {
          console.log(err);
          console.log('push failed');
          reject(false);
        });
    });
    f.on('error', e => {
      reject(e);
    });
  });
}

function pushProductMessageNew(type, desc, imgUri) {
  return new Promise(async (resolve, reject) => {
    let toPush = await messageService.getMembers();
    let members = toPush.filter(ele => ele !== 'robot');
    let headMsg = type === 'product' ? '新食物來摟～～～' : '新書快報！';
    client
      .multicast(members, [
        {
          type: 'text',
          text: headMsg
        },
        {
          type: 'image',
          originalContentUrl: imgUri,
          previewImageUrl: imgUri,
          animated: false
        },
        {
          type: 'text',
          text: desc
        }
      ])
      .then(res => {
        console.log('push success');
        resolve(true);
      })
      .catch(err => {
        // console.log(err);
        console.log('push failed');
        reject(false);
      });
  });
}
module.exports = { pushProductMessage, pushProductMessageNew };
