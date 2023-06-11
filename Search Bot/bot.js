const Telegraf = require('telegraf');
const axios = require('axios');
const bot = new Telegraf('1273702191:AAGOj5P60SRvZWlNvEr-lCTL32D-CIi5lNA');
const apikey = `17706397-2da93cbbabe9acfc8958dd4f0`;

bot.command(['start', 'help'], ctx => {
  let message = `
Welcome to Surf Bot!
Use the inline mode below
@samarthssixthbot i <search image>
@samarthssixthbot w <search wiki>
@samarthssixthbot g <search gif>
`;

  ctx.reply(message, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Search Image', switch_inline_query_current_chat: 'i ' }
        ],
        [
          { text: 'Search Wiki', switch_inline_query_current_chat: 'w ' }
        ],
        [
          { text: 'Search Gif', switch_inline_query_current_chat: 'g ' }
        ]
      ]
    }
  })
})

bot.inlineQuery(['start', 'help'], ctx => {
  let message = `
Welcome to Surf Bot!
@samarthssixthbot i <search image>
@samarthssixthbot w <search wiki>
@samarthssixthbot g <search gif>
  `;

  let results = [
    {
      type: 'article',
      id: '1',
      title: 'Help Reference',
      input_message_content: {
        message_text: message
      },
      description: 'Sends help message on how to use the bot',
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Search Image', switch_inline_query_current_chat: 'i ' }
          ],
          [
            { text: 'Search Wiki', switch_inline_query_current_chat: 'w ' }
          ],
          [
            { text: 'Search Gif', switch_inline_query_current_chat: 'g ' }
          ]
        ]
      }
    }
  ]

  ctx.answerInlineQuery(results);
})

bot.inlineQuery(/i\s.+/, async ctx => {
  let input = ctx.inlineQuery.query.split(' '); 
  input.shift(); 
  let query = input.join(' ');

  let res = await axios.get(`https://pixabay.com/api/?key=${apikey}&q=${query}`);
 
  let data = res.data.hits;

  let results = data.map((item, index) => {
    return {
      type: 'photo',
      id: String(index),
      photo_url: item.webformatURL,
      thumb_url: item.previewURL,
      photo_width: 300,
      photo_height: 200,
      caption: `[Source](${item.webformatURL})\n[Large Image](${item.largeImageURL})`,
      parse_mode: 'Markdown'
    }
  })
  ctx.answerInlineQuery(results)
})

bot.inlineQuery(/w\s.+/, async ctx => {
  let input = ctx.inlineQuery.query.split(' ');
  input.shift();
  let query = input.join(' ');

  let res = await axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${query}&limit=50`);
  let data = res.data;
  let allTitles = data[1]; 
  let allLinks = data[3]; 

  if (allTitles == undefined) {
    return;
  }

  let results = allTitles.map((item, index) => {
    return {
      type: 'article',
      id: String(index),
      title: item,
      input_message_content: {
        message_text: `${item}\n${allLinks[index]}`
      },
      description: allLinks[index],
      reply_markup: {
        inline_keyboard: [
          [
            { text: `Share ${item}`, switch_inline_query: `w ${item}` }
          ]
        ]
      }
    }
  })
  ctx.answerInlineQuery(results);
})

bot.inlineQuery(/g\s.+/, async ctx => {
  let input = ctx.inlineQuery.query.split(' '); 
  input.shift(); 
  let query = input.join(' ');

   let res = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=JGOvWPP3aEWyKaKxhyTUtRP3Gif5bMKX&q=${query}&limit=25&offset=0&rating=g&lang=en
  `);
 
  let data = res.data.data;
  console.log(data)
  let results = data.map((item, index) => {
    return {
      type: 'gif',
      id: item.id,
      gif_url: item.url,
      thumb_url: item.bitly_gif_url,
      gif_width: 300,
      gif_height: 200,
      caption: item.title,
      parse_mode: 'Markdown'
    }
  })
  ctx.answerInlineQuery(results)
})
bot.launch();