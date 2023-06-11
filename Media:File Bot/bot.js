const Telegraf = require('telegraf');
const bot = new Telegraf('1361903928:AAEjkBAM1Y-a2CJG4oZhWZUmyjWFRMI_0UM');

bot.command(['start', 'help'], ctx => {
  let message = `
Help Reference:
/imgdog - get image of dog
/gifdog - get gif of dog
/locgod - get location of dog
/dogs - get photos of dogs
/listdog - get text file dogs
  `;
  ctx.reply(message);
})

bot.command('imgdog', ctx => {
 
  bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
 
  bot.telegram.sendPhoto(ctx.chat.id,
    {
      source: 'res/dog1.jpg'
    },
    {
      
      reply_to_message_id: ctx.message.message_id
    }
  )
})

bot.command('gifdog', ctx => {
  
  bot.telegram.sendChatAction(ctx.chat.id, "upload_video");
  
  bot.telegram.sendAnimation(ctx.chat.id,
    "https://media0.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif",
    {
      reply_to_message_id: ctx.message.message_id
    }
  )
})

bot.command('dogs', ctx => {

  let dogs = ['res/dog1.jpg', 'res/dog2.jpg', 'res/dog3.jpg', 'res/dog4.jpg', 'res/dog5.jpg'];
  
  let result = dogs.map(dogs => {
    return {
      type: 'photo',
      media: {
        source: dogs
      }
    }
  })
  
  bot.telegram.sendMediaGroup(ctx.chat.id, result);
})

bot.command('listdog', ctx => {
  bot.telegram.sendDocument(ctx.chat.id,
    {
      source: "res/dogslist.txt"
    },
    {
      
      thumb: { source: "res/dog1.jpg" }
    })
})

bot.command('locdog', ctx => {
  
  bot.telegram.sendLocation(ctx.chat.id, 1.3521, 103.8198);
})


bot.launch();