const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const TOKEN = process.env.TELEGRAM_API_TOKEN

const bot = new TelegramBot(TOKEN, {polling: true})


bot.on('message', msg => {
    const {chat: {id}} = msg
    bot.sendMessage(id, "Hello")
})
