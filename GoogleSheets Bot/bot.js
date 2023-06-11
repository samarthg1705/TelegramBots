const Telegraf = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('1227888550:AAG3E1UiIWCG1bcTwSaI3X54Bk2QqNFAk5E');
//api key from https://min-api.cryptocompare.com/
const apikey = "da070e2781369c2446227b7e2cf515cdee789f3d853e03569f40c608492471dd";

//start command handler
bot.command('start', ctx => {
  sendStartMessage(ctx);
})

//start callback query - for back to menu buttons
bot.action('start', ctx => {
  ctx.deleteMessage();
  sendStartMessage(ctx);
})

//function to send startMessage so we don't have repeated code
function sendStartMessage(ctx) {
  let startMessage = `Welcome, this bot gives you cryptocurrency information`;
  bot.telegram.sendMessage(ctx.chat.id, startMessage,
    {
      reply_markup: {
        inline_keyboard: [
          //each inner array in inline_keyboard represents a row
          //doc: https://core.telegram.org/bots/api#inlinekeyboardmarkup
          [
            { text: "Crypto Prices", callback_data: 'price' }
          ],
          [
            { text: "CoinMarketCap", url: 'https://apify.com/covid-19' }
          ],
          [
            { text: "Bot Info", callback_data: 'info' }
          ]
        ]
      }
    })
}

//callback query handler for 'price'
bot.action('price', ctx => {
  let priceMessage = `Get Price Information. Select one of the cryptocurrencies below`;

  //delete main menu message
  ctx.deleteMessage();
  //send new message for price page
  bot.telegram.sendMessage(ctx.chat.id, priceMessage,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "BTC", callback_data: 'price-BTC' },
            { text: "ETH", callback_data: 'price-ETH' }
          ],
          [
            { text: "BCH", callback_data: 'price-BCH' },
            { text: "LTC", callback_data: 'price-LTC' }
          ],
          [
            { text: "Back to Menu", callback_data: 'start' },
          ],
        ]
      }
    })
})

//string array to input into action middleware so it will be triggered whenever any string is matched
let priceActionList = ['price-BTC', 'price-ETH', 'price-BCH', 'price-LTC'];
//callback query handlers for price buttons
bot.action(priceActionList, async ctx => {
  //extract symbol from callback data eg. BTC
  let symbol = ctx.match.split('-')[1];

  try {
    //call cryptocompare API with symbol gotten from button
    let res = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apikey}`);
    //store data object into a variable named data
    let data = res.data.DISPLAY[symbol].USD;

    //prepares message for user
    let message =
      `
Symbol: ${symbol}
Price: ${data.PRICE}
Open: ${data.OPENDAY}
High: ${data.HIGHDAY}
Low: ${data.LOWDAY}
Supply: ${data.SUPPLY}
Market Cap: ${data.MKTCAP}
`;

    //delete price page
    ctx.deleteMessage();
    //send new message containing crypto info with back button
    bot.telegram.sendMessage(ctx.chat.id, message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Back to prices', callback_data: 'price' }
          ]
        ]
      }
    })

  } catch (err) {
    console.log(err);
    ctx.reply('Error Encountered');
  }

})

//callback query handler for info
bot.action('info', ctx => {
  //answer callback query so that loading icon on button goes away
  ctx.answerCbQuery();
  //send message to invoke and open reply keyboard
  bot.telegram.sendMessage(ctx.chat.id, "Bot Info", {
    reply_markup: {
      keyboard: [
        [
          { text: "Credits" },
          { text: "API" }
        ],
        [
          { text: "Remove Keyboard" },
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  })
})

//handles text message for 'Credits'
bot.hears('Credits', ctx => {
  ctx.reply('This bot was made by Samarth Ghai');
})

//handles text message for 'API'
bot.hears('API', ctx => {
  ctx.reply('This bot uses APIFY API');
})

//handles text message for 'Remove Keyboard' and removes keyboard on user's telegram interface
bot.hears("Remove Keyboard", ctx => {
  bot.telegram.sendMessage(ctx.chat.id, "Removed Keyboard",
    {
      reply_markup: {
        remove_keyboard: true
      }
    })
})

bot.launch();