module.exports = {
  buttonTemplate: {
    resetOrderFail: {
      text: '請問您是否要繼續訂購',
      actions: [
        {
          type: 'postback',
          label: '繼續訂購',
          displayText: '繼續訂購',
          data: 'reset=y'
        },
        {
          type: 'postback',
          label: '取消訂購',
          displayText: '取消訂購',
          data: 'reset=n'
        }
      ]
    }
  },
  carouselTemplate: {
    books: {
      title: String,
      text: String,
      actions: [
        {
          type: 'uri',
          label: '購買此書',
          uri: String
        }
      ],
      thumbnailImageUrl: String
    }
  },
  confirmTemplate: {
    sso: {
      text: '尚未進行驗身，是否進行?',
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
      ]
    }
  },
  text: {
    random: ['不好意思，小香還在學習中～', '您在說什麼，小香還聽不懂呦', '獎金是我們的喔ya', '獎金是我們的喔ya'],
    welcomeMessage:
      '感謝您成為小香的好友\udbc0\udc80！小香將不定期與您分享最新活動與限定優惠喔！請隨時關懷小香～\udbc0\udc96\n\n若您覺得通知的次數有點多，可以將「提醒」的功能關掉唷\udbc0\udc29\n但千萬別誤觸封鎖耶～否則會錯失優惠券和新書訊息等公告喔\udbc0\udc83\n\n\udbc0\udcb3更多功能都在下方選單，快點來看看吧！\udbc0\udc9d',
    invoiceNotice:
      '立刻上傳購買天下雜誌出版品的雜誌，100元即可獲得1點喔！\n累積的點數將可以於兌換功能內兌換各式精采好禮，快上傳您的購買發票吧！\n如果要結束集點功能，請輸入「結束集點」唷！',
    recognizeInvoiceFail:
      '唔，您上傳的圖片小香無法辨識耶！請重新上傳您的發票唷！',
    addPoints: '恭喜您，您已獲得 2 點，快去看看您可以獲得什麼好禮吧！',
    points:
      '您目前擁有的點數為 {POINTS} 點，以下為您目前可以兌換的好禮\n如果要結束兌換好禮，請輸入「結束兌獎」唷！',
    createOrderFail: '訂購失敗，請檢查您輸入的格式是否正確唷！',
    createMenuOrderSuccess: '謝謝您的訂購，10分鐘後記得來找小香取餐唷！',
    createSeatOrderSuccess:
      '小香收到訂位資料囉！您的訂位將保留十分鐘，如需取消訂位請致電(02)2506-1635，謝謝～',
    orderExists: '訂單已存在',
    pleaseFinishOrder: '請完成訂單建立操作',
    orderCancel: '已為您取消本次訂單',
    unknown: '毫無反應，就只是個 bot',
    searchStart:
      '您好，書香花園有最完整的天下雜誌群出版品，以專業的編輯角度，為您提供最新、最值得一讀的書刊！\n請輸入您想找的書籍關鍵字，小香將為您推薦精選的中外書籍與雜誌～\n如果要結束搜尋，請輸入「結束搜尋」唷！',
    searchEmpty: '唔，小香找不到您想找的書耶！要不要換個關鍵字找找看呢！',
    systemFail: '發生錯誤',
    resetState: '已結束服務',
    expired: '本服務已逾時，如要重啟請參考操作步驟',
    getACoffee:
      '恭喜您獲得 花園咖啡（中杯）一杯 ！來店消費時出示此畫面就可以兌換您的禮品囉！'
  },
  composite: {
    image: {
      menu: {
        type: 'image',
        originalContentUrl: 'https://i.imgur.com/BpVOoMI.jpg',
        previewImageUrl: 'https://i.imgur.com/BpVOoMI.jpg',
        animated: false
      }
    },
    text: {
      unknownPoints: {
        type: 'text',
        text:
          '不好意思，我們還不知道您的身份，請先進行登入\n如果要結束兌換好禮，請輸入「結束兌獎」唷！'
      },
      invoiceNotice: {
        type: 'text',
        text:
          '立刻上傳購買天下雜誌出版品的雜誌，100元即可獲得1點喔！\n累積的點數將可以於兌換功能內兌換各式精采好禮，快上傳您的購買發票吧！\n如果要結束集點功能，請輸入「結束集點」唷！'
      },
      foundBooks: {
        type: 'text',
        text: '小香幫你找到了以下幾本書...快來看看吧！！'
      },
      seatOrder: {
        type: 'text',
        text:
          '暱稱: 書小香\n聯絡電話: 09xxxxxxxx\n用餐人數: 1\n用餐日期: 2019/04/10\n用餐時間: 13:00'
      },
      menuOrder: {
        type: 'text',
        text:
          '暱稱: 書小香\n聯絡電話: 09xxxxxxxx\n餐點: 現烤厚片吐司-香蒜x1 紅茶x1'
      },
      orderBegin: {
        type: 'text',
        text: '麻煩依照下面格式填寫您的訂單～'
      },
      seatOrderBegin: {
        type: 'text',
        text:
          '您好，書香花園在喧囂的城市中為忙碌的您提供一個慢下來的空間\n您可以來這裡用餐、或者就點杯花園咖啡，挑一個最喜歡的角落，在音樂聲中選書、看書～\n請依照以下格式填寫訂位資料～\n如果要取消訂餐，請輸入「取消訂單」唷！'
      },
      menuOrderBegin: {
        type: 'text',
        text:
          '您好，書香花園所有的食材都經過仔細地挑選，並用心烹調，讓我們像家人般的款待您吧！\n餐點皆為現點現做，請讓我們為您預留10分鐘的製餐時間喔！\n請依照以下格式填寫訂餐資料～\n如果要取消訂餐，請輸入「取消訂單」唷！'
      }
    },
    carouselTemplate: {
      product: {
        type: 'template',
        altText: 'product template',
        template: {
          type: 'carousel',
          columns: []
        }
      }
    },
    confirmTemplate: {
      sso: {
        type: 'template',
        altText: 'sso confirmation',
        template: {
          text: '尚未進行驗身，是否進行?',
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
          ]
        }
      }
    }
  }
};
