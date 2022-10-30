const qrCode = require('./actions/qrCode');
const shop = require('./actions/shop');
const wifi = require('./actions/wifi');

const admin = {
  qrCode,
  shop,
  wifi,
}

exports.main = async (event, context) => {
  return await admin[event.funName].main(event, context)
}