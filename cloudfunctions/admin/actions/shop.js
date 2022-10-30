const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command

async function create(event, context) {
  const { name, address, tel, } = event;
  const record = await db.collection('shop').add({
    data: {
      name,
      address,
      tel,
    }
  })
  return record
}

function get(event, context) {
  const { page = 1, size = 20 } = event;
  return db.collection('shop')
    .skip((page - 1) * size)
    .limit(size)
    .get()
}

function getAll(event, context) {
  return db.collection('shop')
    .get()
}

function getById(event, context) {
  const { id } = event;
  return db.collection('shop')
    .doc(id)
    .get()
}


function update(event, context) {
  const { name, tel, address, _id } = event;
  return db.collection('shop').doc(_id).update({
    data: {
      name,
      tel,
      address,
    }
  })
}

function bindWifi(event, context) {
  const { wifis = [], _id } = event;
  return db.collection('shop').doc(_id).update({
    data: {
      wifis: wifis.map(({ sid, ...rest }) => ({
        name: sid,
        ...rest
      }))
    }
  })
}

function bindAd(event, context) {
  const { ad_jili_id, ad_banner_id, _id } = event;
  return db.collection('shop').doc(_id).update({
    data: {
      ad_jili_id,
      ad_banner_id,
    }
  })
}

const actions = {
  create,
  get,
  getById,
  update,
  bindWifi,
  getAll,
  bindAd,
}

exports.main = async (event, context) => {
  return await actions[event.funAction](event, context)
}