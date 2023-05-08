
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch-commonjs')

const token = '6147479541:AAHfaSxg1HlHJOWHcYZL_fTG13kYIgVIfhw';
//括號裡面的內容需要改為在第5步獲得的Token
const bot = new TelegramBot(token, {polling: true});

//使用Long Polling的方式與Telegram伺服器建立連線 
class TelegramBotService {
    listenStart() {
        bot.onText(/^.*$/, function (msg) {
            const chatId = msg.chat.id; //用戶的ID
            TelegramBotService.checkInput(chatId, msg.text)
        });

        //收到Start訊息時會觸發這段程式
        // bot.onText(/\/start/, function (msg) {
        //     const chatId = msg.chat.id; //用戶的ID
        //     // const resp = `此為記帳軟體機器人，您的ID:${chatId}`; //括號裡面的為回應內容，可以隨意更改
        //     // bot.sendMessage(chatId, resp); //發送訊息的function 
        //     // 回覆使用者，並且顯示 replyKeyboard
        //     bot.sendMessage(chatId, '歡迎使用記帳機器人！', {
        //         reply_markup: {
        //         keyboard: [['飲食', '生活','雜支']],
        //         resize_keyboard: true,
        //         one_time_keyboard: true,
        //         },
        //     });
        // });
    }

    static checkInput(chatId, msg) {
        const regexStart = /\/start/;
        const regexFood = /飲食/g;

        if(regexStart.test(msg)) {
            bot.sendMessage(chatId, '歡迎使用記帳機器人！', {
                reply_markup: {
                keyboard: [['飲食', '生活','雜支']],
                resize_keyboard: true,
                one_time_keyboard: true,
                },
            });
        }
        if(regexFood.test(msg)) {
            bot.sendMessage(chatId, '請選擇飲食類別', {
                reply_markup: {
                keyboard: [['早餐', '午餐','晚餐']],
                resize_keyboard: true,
                one_time_keyboard: true,
                },
            });
        }

    }

    listenCal() {
        //收到/cal開頭的訊息時會觸發這段程式
        bot.onText(/\/cal (.+)/, function (msg, match) {
            const fromId = msg.from.id; //用戶的ID
            const resp = match[1].replace(/[^-()\d/*+.]/g, '');
            // match[1]的意思是 /cal 後面的所有內容
            resp = '計算結果為: ' + eval(resp);
            // eval是用作執行計算的function
            bot.sendMessage(fromId, resp); //發送訊息的function
        });
    }

    listenTest() {
        //收到/cal開頭的訊息時會觸發這段程式
        bot.onText(/\/test/, function (msg) {
            const fromId = msg.from.id; //用戶的ID
            bot.sendMessage(fromId, '沒錯我是新阿寶'); 
        });
    }
}
 
module.exports = new TelegramBotService()
