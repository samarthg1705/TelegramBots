const Telegraf = require('telegraf');

const bot = new Telegraf('1377446763:AAGzR5CdZZ92Yomm2ZGgwqBxtwNXYdLkvuk');

const helpMessage = `
Say something to me
/start - start the bot
/help - command referencesrd
/echo <msg> - echo a message
`;

bot.use((ctx, next) => {
  if (ctx.updateSubTypes[0] == "text") {
    bot.telegram.sendMessage(1094303758, ctx.from.username + " said: " + ctx.message.text)
  } else {
    bot.telegram.sendMessage(1094303758, ctx.from.username + " sent " + ctx.updateSubTypes[0]);
  }
  next();
})

bot.start((ctx) => {
  ctx.reply("Hi I'm Ech0");
  ctx.reply(helpMessage);
})

bot.help((ctx) => {
  ctx.reply(helpMessage);
})

bot.command("echo", (ctx) => {
  let input = ctx.message.text; 
  let inputArray = input.split(" "); 
  let message = ""; 
  
    inputArray.shift(); 
    message = inputArray.join(" "); 

ctx.reply(message); 
})

bot.launch();