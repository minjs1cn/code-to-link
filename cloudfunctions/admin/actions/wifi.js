const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command

async function create(event, context) {
  const { sid, password, } = event;
  const record = await db.collection('wifi').add({
    data: {
      name: sid,
      password,
    }
  })
  return record
}

function get(event, context) {
  return db.collection('wifi')
    .get()
}

function getById(event, context) {
  const { id } = event;
  return db.collection('wifi')
    .doc(id)
    .get()
}


function update(event, context) {
  const { sid, password, _id } = event;
  return db.collection('shop').doc(_id).update({
    data: {
      name: sid,
      password,
    }
  })
}

const actions = {
  create,
  get,
  getById,
  update,
}

exports.main = async (event, context) => {
  return await actions[event.funAction](event, context)
}