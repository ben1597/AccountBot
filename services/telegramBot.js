
const TelegramBot = require('node-telegram-bot-api')
const redisClient = require('../config/redisClient')
const { setData } = require('./googleSheet.js')
const moment = require('moment/moment')
const googleSheetRepository = require('../repository/account/googleSheetRepository')
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

    bot.onText(/\/help/, async function (msg) {
      const chatId = msg.chat.id // 用戶的ID
      bot.sendMessage(chatId, '/$ - 喚醒記帳機器人 \n /link - 取得Google Sheet連結 \n Create|DocId|SheetId - 建立Google Sheet \n Rebind|DocId|SheetId - 重新綁定Google Sheet \n /test - 測試用')
    })

    bot.onText(/^\$/, async function (msg) {
    // bot.onText(/^\d+$/, async function (msg) {
      const chatId = msg.chat.id // 用戶的ID
      const cacheData = await redisClient.v4.get(chatId.toString())
      if (!cacheData) {
        bot.sendMessage(chatId, '尚未選擇記帳類別！')
        return
      }

      const googleSheet = await googleSheetRepository.getRecord(chatId.toString())
      if (!googleSheet || !googleSheet.id) {
        bot.sendMessage(chatId, '此聊天室尚未建立對應Google Sheet！輸入DocId和SheetId \nexample (Create|{DocId}|{SheetId})： \nCreate|1Dy6FMGd80NGuM5jmf7Chz1vgPxPCGn1XBtd-LSsGtA4|449205789')
        return
      }

      const cacheJson = JSON.parse(cacheData)
      const account = accountList.find(f => f.callback_data === cacheJson.callback_data)
      if (account) {
        const splitText = msg.text.replace('$', '').split('-')
        const money = splitText[0]
        const memo = splitText.length > 1 ? splitText[1] : ''
        const date = cacheJson.date ? cacheJson.date : moment().format('MM/DD')
        const resp = await setData(googleSheet.docId, googleSheet.sheetId, date, account.cell_header, money, memo)
        console.log(resp)
        bot.sendMessage(chatId, `${account.text}:${money}元，${memo ? '備註:' + memo : ''}，記帳完成！`)
      } else {
        bot.sendMessage(chatId, '尚未選擇記帳類別！')
      }
    })

    bot.onText(/\/\$/, async function (msg) {
      const chatId = msg.chat.id // 用戶的ID
      const googleSheet = await googleSheetRepository.getRecord(chatId.toString())
      // console.log(googleSheet)
      if (!googleSheet || !googleSheet.id) {
        bot.sendMessage(chatId, '此聊天室尚未建立對應Google Sheet！輸入DocId和SheetId \nexample (Create|{DocId}|{SheetId})： \nCreate|1Dy6FMGd80NGuM5jmf7Chz1vgPxPCGn1XBtd-LSsGtA4|449205789')
        // bot.sendMessage(chatId, '此聊天室尚未建立對應Google Sheet！點擊按鈕後輸入DocId和SheetId \nexample (DocId|SheetId)： \n1Dy6FMGd80NGuM5jmf7Chz1vgPxPCGn1XBtd-LSsGtA4|449205789', {
        //   reply_markup: {
        //     inline_keyboard: [[{ text: '初始化Google-Sheet-ID', callback_data: '/create-doc-id' }]],
        //     resize_keyboard: true,
        //     one_time_keyboard: true
        //   }
        // })
        // bot.sendPhoto(chatId, 'https://img.freepik.com/free-vector/collection-round-contact-buttons_23-2147607168.jpg')
        // bot.sendPhoto(chatId, 'https://35.185.130.105:3000/account_main.png')
      } else {
        inlineKeyboard(accountMenuList.find(f => f.callback_data === '/to-main'), chatId)
      }
    })

    bot.onText(/^Create\|/, async function (msg) {
      const chatId = msg.chat.id // 用戶的ID
      const docData = msg.text.split('|')
      const docId = docData[1]
      const sheetId = docData[2]

      const googleSheet = await googleSheetRepository.getRecord(chatId.toString())
      if (googleSheet && googleSheet.id) {
        bot.sendMessage(chatId, '此聊天室已建立對應Google Sheet！要重新綁定GoogleSheet請輸入Rebind+DocId和SheetId \nexample (Rebind|{DocId}|{SheetId})： \nRebind|1Dy6FMGd80NGuM5jmf7Chz1vgPxPCGn1XBtd-LSsGtA4|449205789')
      }

      if (!docId || !sheetId) {
        bot.sendMessage(chatId, '輸入格式錯誤，請重新輸入！')
        return
      }
      const result = await googleSheetRepository.insertRecord({ chatId, docId, sheetId })
      console.log(result)
      bot.sendMessage(chatId, '建立成功！')
    })

    bot.onText(/^Rebind\|/, async function (msg) {
      const chatId = msg.chat.id // 用戶的ID
      const docData = msg.text.split('|')
      const docId = docData[1]
      const sheetId = docData[2]

      if (!docId || !sheetId) {
        bot.sendMessage(chatId, '輸入格式錯誤，請重新輸入！')
        return
      }
      const result = await googleSheetRepository.updateRecord({ chatId, docId, sheetId })
      console.log(result)
      bot.sendMessage(chatId, '重新綁定成功！')
    })

    bot.onText(/\/link/, async function (msg) {
      const chatId = msg.chat.id // 用戶的ID
      const googleSheet = await googleSheetRepository.getRecord(chatId.toString())
      // console.log(googleSheet)
      if (!googleSheet || !googleSheet.id) {
        bot.sendMessage(chatId, '此聊天室尚未建立對應Google Sheet！輸入DocId和SheetId \nexample (Create|{DocId}|{SheetId})： \nCreate|1Dy6FMGd80NGuM5jmf7Chz1vgPxPCGn1XBtd-LSsGtA4|449205789')
      } else {
        bot.sendMessage(chatId, `https://docs.google.com/spreadsheets/d/${googleSheet.docId}/edit#gid=${googleSheet.sheetId}`)
      }
    })

    // 監聽inlineKeyboard回應
    bot.on('callback_query', async function (query) {
      const { data, message } = query
      const accountMenu = accountMenuList.find(f => f.callback_data === data)
      const response = {}

      if (accountMenu) { // 有對應的子選單
        inlineKeyboard(accountMenu, message.chat.id)
        response.text = accountMenu.msg
      } else if (data === '/select-date') { // 選擇日期
        sendDateInlineKeyboard(message.chat.id, 0)
        response.text = '請選擇日期！'
      } else if (data.includes('/date-previous')) { // 選擇往前日期
        let day = isNaN(data.split('-')[2]) ? parseInt(data.split('-')[3]) : parseInt(data.split('-')[2])
        if (data.split('-')[2] === 'm') day *= -1
        sendDateInlineKeyboard(message.chat.id, day - 5)
        response.text = '請選擇日期！'
      } else if (data.includes('/date-next')) { // 選擇往後日期
        let day = isNaN(data.split('-')[2]) ? parseInt(data.split('-')[3]) : parseInt(data.split('-')[2])
        if (data.split('-')[2] === 'm') day *= -1
        sendDateInlineKeyboard(message.chat.id, day + 5)
        response.text = '請選擇日期！'
      } else if (data.includes('/date-confirm')) { // 確認日期
        const date = data.split('-')[2]
        const cacheData = await redisClient.v4.get(message.chat.id.toString())
        const cacheJson = JSON.parse(cacheData ?? '{}')
        cacheJson.date = date
        await redisClient.set(message.chat.id, JSON.stringify(cacheJson), 'EX', 60 * 5)
        inlineKeyboard(accountMenuList.find(f => f.callback_data === '/to-main'), message.chat.id)
        response.text = `已選擇日期${date}請選擇記帳類別！`
      } else { // 確認選擇記帳類別
        const account = accountList.find(f => f.callback_data === data)
        if (!account) return

        const cacheData = await redisClient.v4.get(message.chat.id.toString())
        const cacheJson = JSON.parse(cacheData ?? '{}')
        cacheJson.callback_data = data
        await redisClient.set(message.chat.id, JSON.stringify(cacheJson), 'EX', 60 * 5)
        response.text = `已選取${account.text}，請輸入金額！`
      }

      bot.answerCallbackQuery(query.id, response)
    })
  }

  listenTest () {
    // 收到/cal開頭的訊息時會觸發這段程式
    bot.onText(/\/test/, function (msg) {
      const chatId = msg.chat.id // 用戶的ID
      bot.sendMessage(chatId, '沒錯我是新阿寶')
    })
  }
}

module.exports = new TelegramBotService()
