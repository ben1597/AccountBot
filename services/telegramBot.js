
const TelegramBot = require('node-telegram-bot-api')
// const fs = require('fs')
// const fetch = require('node-fetch-commonjs')

const token = '6147479541:AAHfaSxg1HlHJOWHcYZL_fTG13kYIgVIfhw'
// 括號裡面的內容需要改為在第5步獲得的Token
const bot = new TelegramBot(token, { polling: true })

const accountList = [
  {
    text: '記帳類別',
    msg: '歡迎使用記帳機器人！',
    split_nums: 2,
    callback_data: '/to-main',
    menu_list: [{ text: '飲食', callback_data: '/to-sub-food' }, { text: '生活', callback_data: '/to-sub-life' }, { text: '其他', callback_data: '/to-sub-other' }, { text: '收入', callback_data: '/to-sub-income' }]
  },
  {
    text: '飲食',
    msg: '請選擇食物類別！',
    split_nums: 3,
    callback_data: '/to-sub-food',
    menu_list: [{ text: '早餐', callback_data: '/food-breakfast' }, { text: '午餐', callback_data: '/food-lunch' }, { text: '晚餐', callback_data: '/food-dinner' }]
  },
  {
    text: '生活',
    msg: '請選擇生活類別！',
    split_nums: 3,
    callback_data: '/to-sub-life',
    menu_list: [{ text: '生活用品', callback_data: '/life-basicCommodities' }, { text: '日常', callback_data: '/life-daily' }, { text: '治裝/美容', callback_data: '/life-dressAndBeauty' }, { text: '娛樂', callback_data: '/life-entertainment' }, { text: '交際/聚餐', callback_data: '/life-social' }]
  },
  {
    text: '其他',
    msg: '請選擇其他類別！',
    split_nums: 3,
    callback_data: '/to-sub-other',
    menu_list: [{ text: '投資理財', callback_data: '/other-invest' }, { text: '學習', callback_data: '/other-study' }, { text: '保險', callback_data: '/other-insurance' }, { text: '交通', callback_data: '/other-traffic' }, { text: '寵物', callback_data: '/other-pet' }, { text: '其他', callback_data: '/other-other' }]
  },
  {
    text: '收入',
    msg: '請選擇收入類別！',
    split_nums: 3,
    callback_data: '/to-sub-income',
    menu_list: [{ text: '薪資', callback_data: '/income-salary' }, { text: '獎金', callback_data: '/income-bonus' }, { text: '投資', callback_data: '/income-invest' }, { text: '保險', callback_data: '/income-insurance' }, { text: '交通', callback_data: '/income-traffic' }, { text: '其他', callback_data: '/income-other' }]
  }
]

const inlineKeyboard = function (account, chatId) {
  bot.sendMessage(chatId, account.msg, {
    reply_markup: {
      inline_keyboard: splitKeyboard(account.menu_list, account.split_nums),
      resize_keyboard: true,
      one_time_keyboard: true
    }
  })
}

const splitKeyboard = function (array, num) {
  const newArray = []
  for (let i = 0; i < array.length; i += num) {
    newArray.push(array.slice(i, i + num))
  }
  return newArray
}

// 使用Long Polling的方式與Telegram伺服器建立連線
class TelegramBotService {
  listenStart () {
    // console.log(bot.getUpdates())

    // bot.onText(/^.*$/, function (msg) {
    //   const chatId = msg.chat.id // 用戶的ID
    //   //   TelegramBotService.checkInput(chatId, msg.text)
    //   inlineKeyboard(accountList.find(f => f.callback_data === '/to-main'), chatId)
    // })
    // const img = fs.createReadStream('./img/account_main.png')

    // bot.onText(/\/start/, function (msg) {
    //   const chatId = msg.chat.id // 用戶的ID
    //   bot.sendPhoto({
    //     chat_id: chatId,
    //     caption: '歡迎使用記帳機器人！',
    //     photo: img
    //   })
    // })

    bot.onText(/\/account/, function (msg) {
      const chatId = msg.chat.id // 用戶的ID
      //   TelegramBotService.checkInput(chatId, msg.text)
      inlineKeyboard(accountList.find(f => f.callback_data === '/to-main'), chatId)
    })

    // 監聽inlineKeyboard回應
    bot.on('callback_query', function (query) {
      const { data, message } = query
      const account = accountList.find(f => f.callback_data === data)
      // console.log(query)
      inlineKeyboard(account, message.chat.id)

      bot.answerCallbackQuery(query.id, { text: account.msg })
    })
  }

  // static checkInput (chatId, msg) {
  //   const regexStart = /\/start/
  //   const regexFood = /飲食/g
  //   const regexLife = /生活/g
  //   const regexOther = /其他類別/g
  //   const regexIncome = /收入/g

  //   if (regexStart.test(msg)) {
  //     bot.sendMessage(chatId, '歡迎使用記帳機器人！', {
  //       reply_markup: {
  //         keyboard: [['飲食', '生活', '其他類別', '收入']],
  //         resize_keyboard: true,
  //         one_time_keyboard: true
  //       }
  //     })
  //   }
  //   if (regexFood.test(msg)) {
  //     bot.sendMessage(chatId, '請選擇飲食類別', {
  //       reply_markup: {
  //         keyboard: [['早餐', '午餐', '晚餐']],
  //         resize_keyboard: true,
  //         one_time_keyboard: true
  //       }
  //     })
  //   }
  //   if (regexLife.test(msg)) {
  //     bot.sendMessage(chatId, '請選擇生活類別', {
  //       reply_markup: {
  //         keyboard: [['生活用品', '日常', '治裝/美容'],
  //           ['娛樂', '交際/聚餐']],
  //         resize_keyboard: true,
  //         one_time_keyboard: true
  //       }
  //     })
  //   }
  //   if (regexOther.test(msg)) {
  //     bot.sendMessage(chatId, '請選擇其他類別', {
  //       reply_markup: {
  //         keyboard: [['投資理財', '學習', '醫療'],
  //           ['保險', '交通', '寵物', '其他']],
  //         resize_keyboard: true,
  //         one_time_keyboard: true
  //       }
  //     })
  //   }
  //   if (regexIncome.test(msg)) {
  //     bot.sendMessage(chatId, '請選擇收入類別', {
  //       reply_markup: {
  //         keyboard: [['薪資', '獎金', '投資(入)'],
  //           ['保險(入)', '其他(入)']],
  //         resize_keyboard: true,
  //         one_time_keyboard: true
  //       }
  //     })
  //   }
  // }

  //   listenCal () {
  //     // 收到/cal開頭的訊息時會觸發這段程式
  //     bot.onText(/\/cal (.+)/, function (msg, match) {
  //       const fromId = msg.from.id // 用戶的ID
  //       let resp = match[1].replace(/[^-()\d/*+.]/g, '')
  //       // match[1]的意思是 /cal 後面的所有內容
  //       resp = '計算結果為: ' + eval(resp)
  //       // eval是用作執行計算的function
  //       bot.sendMessage(fromId, resp) // 發送訊息的function
  //     })
  //   }

  listenTest () {
    // 收到/cal開頭的訊息時會觸發這段程式
    bot.onText(/\/test/, function (msg) {
      const fromId = msg.from.id // 用戶的ID
      bot.sendMessage(fromId, '沒錯我是新阿寶')
    })
  }
}

module.exports = new TelegramBotService()
