const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command

async function getById(event, context) {
  const { id } = event;
  const res = await db.collection('qrCode')
    .doc(id)
    .get()
  const { wifiId, shopId } = res.data
  const { data: result } = await db.collection('shop')
    .doc(shopId)
    .get()
  const { wifis = [] } = result;
  const wifi = wifis.filter(item => item._id === wifiId)

  return {
    ...result,
    wifi,
  }
}

const actions = {
  getById,
}

exports.main = async (event, context) => {
  return await actions[event.funAction](event, context)
}