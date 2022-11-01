// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

const publisher_adunit_general = require('./actions/publisher_adunit_general')

const ad = {
  publisher_adunit_general,
}

const rp = options => new Promise((resolve, reject) => {
  request(options, (error, response) => {
    if (error) {
      reject(error)
    }
    resolve((typeof response.body === 'object') ? response.body : JSON.parse(response.body))
  })
})

async function getAccessToken() {
  const appid = 'wx46889fc9bfc7fc2d'
  const secret = 'd0340f16bd8866e5fde1011e773cbd2c'
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
  const result = await rp({
    url,
    method: 'get'
  })
  return result
}

const DbAccessToken = 'accessToken'

async function getCacheAccessToken() {
  const result = await db.collection(DbAccessToken).get()

  if (!result.data.length) {
    const { access_token, expires_in } = await getAccessToken();
    await db.collection(DbAccessToken).add({
      data: {
        accessToken: access_token,
        expiresIn: expires_in,
        createTime: Date.now(),
      }
    })
    return access_token
  }

  const { _id, accessToken, expiresIn, createTime } = result.data[0]

  if ((Date.now() - createTime) > (expiresIn - 10) * 1000) {
    const { access_token, expires_in } = await getAccessToken();
    await db.collection(DbAccessToken).doc(_id).set({
      data: {
        accessToken: access_token,
        expiresIn: expires_in,
        createTime: Date.now(),
      }
    })
    return access_token
  }

  return accessToken;
}

// 云函数入口函数
exports.main = async (event, context) => {
  const accessToken = await getCacheAccessToken()
  event.accessToken = accessToken

  return await ad[event.funName].main(event, context)
}