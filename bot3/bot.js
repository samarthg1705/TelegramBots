const Telegraf = require("telegraf");

const bot = new Telegraf("1305095533:AAHIh5VCzZ5G-Ug72a94m3FtSiwzdxk4Ouo");

const axios = require('axios');

let dataStore = [];
getData();
bot.command('quote', ctx => {
  let maxRow = dataStore.filter(item => {
    return (item.row == '1' && item.col == '2');
  })[0].val;
  
  let k = Math.floor(Math.random() * maxRow) + 1;
  
  let quote = dataStore.filter(item => {
    return (item.row == k && item.col == '5');
  })[0];

  let message =
    `
Quote #${quote.row}:
${quote.val}
  `;
  ctx.reply(message);
})
bot.command('update', async ctx => {
  try {
   
    await getData();
    ctx.reply('updated');
  } catch (err) {
    console.log(err);
    ctx.reply('Error encountered');
  }
})
async function getData() {
  try {
    
    let res = await axios('https://spreadsheets.google.com/feeds/cells/1RkDAZPO2Ty6dZMmX43eb5wIGTk0Rw_GpuqaFcdCdIJc/1/public/full?alt=json');

    let data = res.data.feed.entry;
    
    dataStore = [];
    
    data.forEach(item => {
      dataStore.push({
        row: item.gs$cell.row,
        col: item.gs$cell.col,
        val: item.gs$cell.inputValue,
      })
    })
  } catch (err) {
    console.log(err);
    throw new Error;
  }
}
bot.launch();