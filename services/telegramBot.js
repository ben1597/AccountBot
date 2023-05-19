
const TelegramBot = require('node-telegram-bot-api')
const redisClient = require('../config/redisClient')
const { setData } = require('./googleSheet.js')
const moment = require('moment/moment')
// const { json } = require('express')
// const fs = require('fs')
// const fetch = require('node-fetch-commonjs')

const token = '6147479541:AAHfaSxg1HlHJOWHcYZL_fTG13kYIgVIfhw'
// 括號裡面的內容需要改為在第5步獲得的Token
const bot = new TelegramBot(token, { polling: true })

const accountMenuList = [
  {
    text: '記帳類別',
    msg: '歡迎使用記帳機器人！',
    split_nums: 2,
    callback_data: '/to-main',
    menu_list: [{ text: '飲食', callback_data: '/to-sub-food' }, { text: '生活', callback_data: '/to-sub-life' }, { text: '其他', callback_data: '/to-sub-other' }, { text: '收入', callback_data: '/to-sub-income' }, { text: '選擇日期', callback_data: '/select-date' }]
  },
  {
    text: '飲食',
    msg: '請選擇食物類別！',
    split_nums: 3,
    callback_data: '/to-sub-food',
    menu_list: [{ text: '早餐', callback_data: '/food-breakfast' }, { text: '午餐', callback_data: '/food-lunch' }, { text: '晚餐', callback_data: '/food-dinner' }, { text: '餐飲其他', callback_data: 'food-other' }, { text: '飲料', callback_data: 'food-drink' }, { text: '咖啡', callback_data: 'food-coffee' }]
  },
  {
    text: '生活',
    msg: '請選擇生活類別！',
    split_nums: 3,
    callback_data: '/to-sub-life',
    menu_list: [{ text: '生活用品', callback_data: '/life-basicCommodities' }, { text: '日常', callback_data: '/life-daily' }, { text: '投資理財', callback_data: '/other-invest' }, { text: '交通', callback_data: '/life-traffic' }, { text: '治裝/美容', callback_data: '/life-dressAndBeauty' }, { text: '娛樂', callback_data: '/life-entertainment' }, { text: '交際/聚餐', callback_data: '/life-social' }]
  },
  {
    text: '其他',
    msg: '請選擇其他類別！',
    split_nums: 3,
    callback_data: '/to-sub-other',
    menu_list: [{ text: '投資理財', callback_data: '/other-invest' }, { text: '學習', callback_data: '/other-study' }, { text: '保險', callback_data: '/other-insurance' }, { text: '醫療', callback_data: '/other-medicate' }, { text: '寵物', callback_data: '/other-pet' }, { text: '其他', callback_data: '/other-other' }]
  },
  {
    text: '收入',
    msg: '請選擇收入類別！',
    split_nums: 3,
    callback_data: '/to-sub-income',
    menu_list: [{ text: '薪資', callback_data: '/income-salary' }, { text: '獎金', callback_data: '/income-bonus' }, { text: '投資', callback_data: '/income-invest' }, { text: '保險', callback_data: '/income-insurance' }, { text: '其他', callback_data: '/income-other' }]
  }
]

const accountList = [{ text: '早餐', callback_data: '/food-breakfast', cell_header: 'B' }, { text: '午餐', callback_data: '/food-lunch', cell_header: 'C' }, { text: '晚餐', callback_data: '/food-dinner', cell_header: 'D' }, { text: '餐飲其他', callback_data: 'food-other', cell_header: 'E' }, { text: '飲料', callback_data: 'food-drink', cell_header: 'F' }, { text: '咖啡', callback_data: 'food-coffee', cell_header: 'G' },
  { text: '生活用品', callback_data: '/life-basicCommodities', cell_header: 'H' }, { text: '日常', callback_data: '/life-daily', cell_header: 'I' }, { text: '投資理財', callback_data: '/other-invest', cell_header: 'J' }, { text: '交通', callback_data: '/life-traffic', cell_header: 'K' }, { text: '治裝/美容', callback_data: '/life-dressAndBeauty', cell_header: 'L' }, { text: '娛樂', callback_data: '/life-entertainment', cell_header: 'M' },
  { text: '交際/聚餐', callback_data: '/life-social', cell_header: 'N' }, { text: '學習', callback_data: '/other-study', cell_header: 'O' }, { text: '保險', callback_data: '/other-insurance', cell_header: 'P' }, { text: '醫療', callback_data: '/other-medicate', cell_header: 'Q' }, { text: '寵物', callback_data: '/other-pet', cell_header: 'R' }, { text: '其他', callback_data: '/other-other', cell_header: 'S' },
  { text: '薪資', callback_data: '/income-salary', cell_header: 'U' }, { text: '獎金', callback_data: '/income-bonus', cell_header: 'V' }, { text: '投資', callback_data: '/income-invest', cell_header: 'W' }, { text: '保險', callback_data: '/income-insurance', cell_header: 'X' }, { text: '其他', callback_data: '/income-other', cell_header: 'Y' }]

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

const sendDateInlineKeyboard = function (chatId, day) {
  const dateArray = []
  for (let i = 0; i < 6; i++) {
    const date = moment().add('d', day).add('d', i).format('MM/DD')

    dateArray.push({ text: date, callback_data: '/date-confirm-' + date })
    if (i === 5) {
      const plusMinusSign = day >= 0 ? 'p' : 'm'
      dateArray.push({ text: '<<', callback_data: `/date-previous-${plusMinusSign}-${Math.abs(day)}` })
      dateArray.push({ text: '>>', callback_data: `/date-next-${plusMinusSign}-${Math.abs(day)}` })
    }
  }

  bot.sendMessage(chatId, '選擇日期！', {
    reply_markup: {
      inline_keyboard: splitKeyboard(dateArray, 3),
      resize_keyboard: true,
      one_time_keyboard: true
    }
  })
}

// 使用Long Polling的方式與Telegram伺服器建立連線
class TelegramBotService {
  async listenStart () {
    // console.log(bot.getUpdates())

    // bot.onText(/^.*$/, function (msg) {
    //   const chatId = msg.chat.id // 用戶的ID
    //   //   TelegramBotService.checkInput(chatId, msg.text)
    //   // inlineKeyboard(accountList.find(f => f.callback_data === '/to-main'), chatId)
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
    bot.onText(/^\$/, async function (msg) {
    // bot.onText(/^\d+$/, async function (msg) {
      const chatId = msg.chat.id // 用戶的ID
      // const account = accountList.find(f => f.callback_data === data)

      const cacheData = await redisClient.v4.get(chatId.toString())
      if (!cacheData) {
        bot.sendMessage(chatId, '尚未選擇記帳類別！')
        return
      }

      const cacheJson = JSON.parse(cacheData)
      const account = accountList.find(f => f.callback_data === cacheJson.callback_data)
      if (account) {
        // const today = moment()
        // console.log((today.get('month') + 1) + ',' + today.get('date'))
        // const date = cacheJson.date ? cacheJson.date : `${(today.get('month') + 1  )}月${today.get('date')}日`
        const splitText = msg.text.replace('$', '').split('-')
        const money = splitText[0]
        const memo = splitText.length > 1 ? splitText[1] : ''
        const date = cacheJson.date ? cacheJson.date : moment().format('MM/DD')
        const resp = await setData('1Dy6FMGd80NGuM5jmf7Chz1vgPxPCGn1XBtd-LSsGtA4', '449205789', date, account.cell_header, money, memo)
        console.log(resp)
        bot.sendMessage(chatId, `${account.text}:${money}元，${memo ? '備註:' + memo : ''}，記帳完成！`)
      } else {
        bot.sendMessage(chatId, '尚未選擇記帳類別！')
      }
    })

    bot.onText(/\/\$/, function (msg) {
      const chatId = msg.chat.id // 用戶的ID
      //   TelegramBotService.checkInput(chatId, msg.text)
      inlineKeyboard(accountMenuList.find(f => f.callback_data === '/to-main'), chatId)
    })

    // 監聽inlineKeyboard回應
    bot.on('callback_query', async function (query) {
      const { data, message } = query
      const accountMenu = accountMenuList.find(f => f.callback_data === data)
      const response = {}
      // console.log(query)
      // console.log(message.from.id, message.message_id, message.chat.id)

      if (accountMenu) {
        inlineKeyboard(accountMenu, message.chat.id)
        response.text = accountMenu.msg
      } else if (data === '/select-date') {
        sendDateInlineKeyboard(message.chat.id, 0)
        response.text = '請選擇日期！'
      } else if (data.includes('/date-previous')) {
        let day = isNaN(data.split('-')[2]) ? parseInt(data.split('-')[3]) : parseInt(data.split('-')[2])
        if (data.split('-')[2] === 'm') day *= -1
        sendDateInlineKeyboard(message.chat.id, day - 5)
        response.text = '請選擇日期！'
      } else if (data.includes('/date-next')) {
        let day = isNaN(data.split('-')[2]) ? parseInt(data.split('-')[3]) : parseInt(data.split('-')[2])
        if (data.split('-')[2] === 'm') day *= -1
        sendDateInlineKeyboard(message.chat.id, day + 5)
        response.text = '請選擇日期！'
      } else if (data.includes('/date-confirm')) {
        const date = data.split('-')[2]
        const cacheData = await redisClient.v4.get(message.chat.id.toString())
        const cacheJson = JSON.parse(cacheData ?? '{}')
        cacheJson.date = date
        await redisClient.set(message.chat.id, JSON.stringify(cacheJson), 'EX', 60 * 60 * 5)
        inlineKeyboard(accountMenuList.find(f => f.callback_data === '/to-main'), message.chat.id)
        response.text = `已選擇日期${date}請選擇記帳類別！`
      } else {
        const account = accountList.find(f => f.callback_data === data)
        if (!account) return

        const cacheData = await redisClient.v4.get(message.chat.id.toString())
        const cacheJson = JSON.parse(cacheData ?? '{}')
        cacheJson.callback_data = data
        await redisClient.set(message.chat.id, JSON.stringify(cacheJson), 'EX', 60 * 60 * 5)
        response.text = `已選取${account.text}，請輸入金額！`
      }

      bot.answerCallbackQuery(query.id, response)
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
  //       const chatId = msg.chat.id // 用戶的ID
  //       let resp = match[1].replace(/[^-()\d/*+.]/g, '')
  //       // match[1]的意思是 /cal 後面的所有內容
  //       resp = '計算結果為: ' + eval(resp)
  //       // eval是用作執行計算的function
  //       bot.sendMessage(chatId, resp) // 發送訊息的function
  //     })
  //   }

  listenTest () {
    // 收到/cal開頭的訊息時會觸發這段程式
    bot.onText(/\/test/, function (msg) {
      const chatId = msg.chat.id // 用戶的ID
      bot.sendMessage(chatId, '沒錯我是新阿寶')
    })
  }
}

module.exports = new TelegramBotService()
