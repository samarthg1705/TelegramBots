const Telegraf = require('telegraf');
const bot = new Telegraf('862453845:AAH1uqezgIYj2vHIby3GhvO5UsmXL_XQQmM');

bot.command('start', ctx => {
    console.log(ctx.chat.id);
  })


bot.launch()