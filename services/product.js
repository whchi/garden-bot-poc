const db = require('../database/product');
const model = db.product;
const env = require('../env');

function fuzzleGetBooks(keyword, limit) {
  return new Promise((resolve, reject) => {
    model
      .find(
        {
          type: env.PRODUCT_TYPE.BOOK,
          $or: [
            {
              title: { $regex: keyword, $options: 'i' }
            },
            {
              desc: { $regex: keyword, $options: 'i' }
            }
          ]
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          if (data.length === 0) {
            return reject('empty result');
          }
          resolve(data);
        }
      )
      .limit(limit);
  });
}

function getProducts(limit) {
  return new Promise((resolve, reject) => {
    model
      .find()
      .limit(limit)
      .then(resolve)
      .catch(reject);
  });
}
function init() {
  model.create(
    [
      {
        title: '好好拜託',
        desc:
          '哥倫比亞大學最受歡迎的社會心理課， 讓人幫你是優勢，連幫你的人都快樂才是本事！',
        url:
          'https://www.cwbook.com.tw/product/ProductAction.shtml?prodId=0000024507&utm_source=ec-buy&utm_medium=web&utm_campaign=garden',
        img:
          'https://ec.cw1.tw/cwbook/images/Resource/web/bproduct/7/0000024507/0000024507.jpg?now=20190403110510881',
        points: 1000,
        type: 0
      },
      {
        title: '刷新未來',
        desc: '重新想像AI+HI智能革命下的商業與變革',
        url:
          'https://www.cwbook.com.tw/product/ProductAction.shtml?prodId=0000021557&utm_source=ec-buy&utm_medium=web&utm_campaign=garden',
        img:
          'https://ec.cw1.tw/cwbook/images/Resource/web/bproduct/7/0000021557/0000021557.jpg?now=20190403103025676',
        points: 1000,
        type: 0
      },
      {
        title: '關鍵課題思考',
        desc: '比解決問題更重要，速效達成目標的超精準工作法',
        url:
          'https://www.cwbook.com.tw/product/ProductAction.shtml?prodId=0000024533&utm_source=ec-buy&utm_medium=web&utm_campaign=garden',
        img:
          'https://ec.cw1.tw/cwbook/images/Resource/web/bproduct/3/0000024533/0000024533.jpg?now=20190403110838642',
        points: 1000,
        type: 0
      },
      {
        title: '為何我們愛得，又傷又痛？',
        desc:
          '終止親子彼此錯待，教養專家破除以愛為名的控制、依賴、寄生、批評，找回家的歸屬感',
        url:
          'https://www.cwbook.com.tw/product/ProductAction.shtml?prodId=0000024624&utm_source=ec-buy&utm_medium=web&utm_campaign=garden',
        img:
          'https://ec.cw1.tw/cwbook/images/Resource/web/bproduct/4/0000024624/0000024624.jpg?now=20190403111007718',
        points: 1000,
        type: 0
      },
      {
        title: '《頭腦的東西》＋《無事生非》套書',
        desc:
          '楊定一博士在《頭腦的東西》與《無事生非》，從最徹底的理性出發，跨越你我感性最深的疆界，透過心和心誠懇的共振，陪伴每一個人深深地面對自己，重新發掘內在的神聖，活出真正的自由！',
        url:
          'https://www.cwbook.com.tw/product/ProductAction.shtml?prodId=0000024493&utm_source=garden',
        img:
          'https://ec.cw1.tw/cwbook/images/Resource/web/bproduct/3/0000024493/0000024493.jpg?now=20190403111142207',
        points: 1000,
        type: 0
      },
      {
        title: '子彈思考整理術',
        desc: '釐清超載思緒，化想法為行動， 專注最重要的事，設計你想要的人生',
        url:
          'https://www.cwbook.com.tw/product/ProductAction.shtml?prodId=0000023552&utm_source=garden',
        img:
          'https://ec.cw1.tw/cwbook/images/Resource/web/bproduct/2/0000023552/0000023552.jpg?now=20190403111237275',
        points: 1000,
        type: 0
      },
      {
        title: '行銷4.0',
        desc: '新虛實融合時代贏得顧客的全思維',
        url:
          'https://www.cwbook.com.tw/product/ProductAction.shtml?prodId=0000021135&utm_source=garden',
        img:
          'https://ec.cw1.tw/cwbook/images/Resource/web/bproduct/5/0000021135/0000021135.jpg?now=20190403111354651',
        points: 1000,
        type: 0
      },
      {
        title: '全閱讀',
        desc: '天下雜誌全閱讀訂閱服務喔',
        url: 'https://www.cw.com.tw/webaccess',
        img:
          'https://scontent.ftpe8-2.fna.fbcdn.net/v/t1.0-9/23172873_10154791211616930_6235309144808074478_n.jpg?_nc_cat=103&_nc_ht=scontent.ftpe8-2.fna&oh=4d51b8931a74bf2b167f8f7e6c8b1380&oe=5D436C66',
        points: 5000,
        type: 1
      },
      {
        title: '好喝的咖啡',
        desc: 'good drink coffee',
        url:
          'https://cw1.tw/CH/images/channel_master/34108ffc-dd36-4904-a8f5-2d1eb0570774.jpg',
        img:
          'https://cw1.tw/CH/images/channel_master/34108ffc-dd36-4904-a8f5-2d1eb0570774.jpg',
        points: 1000,
        type: 1
      }
    ],
    err => {
      console.error(err);
    }
  );
}

module.exports = {
  getProducts,
  fuzzleGetBooks
};
