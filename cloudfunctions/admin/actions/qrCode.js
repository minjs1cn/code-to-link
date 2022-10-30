const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command

async function create(event, context) {
  // 创建二维码记录
  const { name = 'WIFI二维码' } = event;
  const record = await db.collection('qrCode').add({
    data: {
      name,
      visible: true,
    }
  })
  // 获取二维码buffer
  const res = await cloud.openapi.wxacode.get({
    path: `pages/index/index?id=${record._id}`,
  })
  const { buffer } = res
  // 将图片上传云存储空间
  const upload = await cloud.uploadFile({
    cloudPath: `code/${record._id}.png`,
    fileContent: buffer
  });
  const { fileID } = upload;
  // 更新二维码记录
  await db.collection('qrCode').doc(record._id).update({
    data: {
      visible: true,
      uri: fileID,
    }
  })

  return {
    name,
    uri: fileID
  }
}

async function admin() {
  // 获取二维码buffer
  const res = await cloud.openapi.wxacode.get({
    path: `pages/admin/qrCode/qrCode`,
  })
  const { buffer } = res
  // 将图片上传云存储空间
  const upload = await cloud.uploadFile({
    cloudPath: `admin/admin.png`,
    fileContent: buffer
  });
  const { fileID } = upload;

  return {
    uri: fileID,
  }
}

function get(event, context) {
  const { page = 1, size = 20 } = event;
  return db.collection('qrCode')
    // .where({
    //   visible: _.eq(visible),
    // })
    .skip((page - 1) * size)
    .limit(size)
    .get()
}

function update(event, context) {
  const { scene, _id } = event;
  return db.collection('qrCode').doc(_id).update({
    data: {
      scene
    }
  })
}

function bindWifi(event, context) {
  const { shopId, wifiId , _id } = event;
  return db.collection('qrCode').doc(_id).update({
    data: {
      shopId, wifiId,
    }
  })
}

const actions = {
  create,
  get,
  update,
  bindWifi,
  admin,
}

exports.main = async (event, context) => {
  return await actions[event.funAction](event, context)
}