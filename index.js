// const { getData } = require('./googleSheet.js');

// (async () => {
//   const resp = await getData('1Dy6FMGd80NGuM5jmf7Chz1vgPxPCGn1XBtd-LSsGtA4', '449205789');
//   console.log(resp);
// })();

const { listenStart, listenCal, listenTest } = require('./telegramBot.js');

listenStart()
listenCal()
listenTest()
// sendKeyBoard(6205434411)