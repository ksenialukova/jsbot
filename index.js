const TelegramBot = require('node-telegram-bot-api');
const ogs = require('open-graph-scraper');
const firebase = require('firebase');

require('dotenv').config();

const TOKEN = "768728974:AAFt7_o83MqTODOIMK3LqsQys3pHF_sg5bs"

const bot = new TelegramBot(TOKEN, {polling: true})

const app = firebase.initializeApp({
    apiKey: "AIzaSyAueYVFHUxmFqCjtEJj3UiuI2x0YFDRpPM",
    authDomain: "jsbot-4e29e.firebaseapp.com",
    databaseURL: "https://jsbot-4e29e.firebaseio.com",
    projectId: "jsbot-4e29e",
    storageBucket: "jsbot-4e29e.appspot.com",
    messagingSenderId: "972360198460",
    appId: "1:972360198460:web:13aaeabecaadfc90"
})

const ref = firebase.database().ref();
const sitesRef = ref.child("sites");

// Reply to /bookmark
bot.onText(/\/bookmark (.+)/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id,'Got it, in which category?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Development',
          callback_data: 'development'
        },{
          text: 'Music',
          callback_data: 'music'
        },{
          text: 'Cute monkeys',
          callback_data: 'cute-monkeys'
        }
      ]]
    }
  });
});

// Callback query
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  // Scrap OG date
  ogs({'url': siteUrl}, function (error, results) {
    if(results.success) {
      // Push to Firebase
      sitesRef.push().set({
        name: results.data.ogSiteName,
        title: results.data.ogTitle,
        description: results.data.ogDescription,
        url: siteUrl,
        thumbnail: results.data.ogImage.url,
        category: callbackQuery.data
      });
      // Reply
      bot.sendMessage(message.chat.id,'Added \"' + results.data.ogTitle +'\" to category \"' + callbackQuery.data + '\"!');
    } else {
      // Push to Firebase
      sitesRef.push().set({
        url: siteUrl
      });
      // Reply
      bot.sendMessage(message.chat.id,'Added new website, but there was no OG data!');
    }
  });
});
