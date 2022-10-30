const qrCode = require('./actions/qrCode');

const admin = {
  qrCode,
}

exports.main = async (event, context) => {
  return await admin[event.funName].main(event, context)
}