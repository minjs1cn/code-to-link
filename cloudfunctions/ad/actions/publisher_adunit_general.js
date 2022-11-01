const cloud = require('wx-server-sdk')
const request = require('request')
const dayjs = require('dayjs')
const qs = require('qs')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();
const _ = db.command

const rp = options => new Promise((resolve, reject) => {
  request(options, (error, response) => {
    if (error) {
      reject(error)
    }
    resolve((typeof response.body === 'object') ? response.body : JSON.parse(response.body))
  })
})

const get = async (event, ad_slot) => {
  const { accessToken, page = 1, page_size = 10, start_date, end_date, ad_unit_id } = event
  const obj = {
    page,
    page_size,
    start_date: start_date ? start_date : dayjs().subtract(2, 'day').startOf('M').format('YYYY-MM-DD'),
    end_date: end_date ? end_date : dayjs().subtract(2, 'day').endOf('M').format('YYYY-MM-DD'),
    ad_slot,
    ad_unit_id
  }
  const str = qs.stringify(obj)
  console.log(str)
  const url = `https://api.weixin.qq.com/publisher/stat?action=publisher_adunit_general&access_token=${accessToken}&${str}`
  const res = await rp({
    url,
    method: 'get',
  })
  return res;
}

const getBannerAd = async (event, context) => {
  return await get(event,'SLOT_ID_WEAPP_BANNER' );
}

const getJiliAd = async (event, context) => {
  return await get(event,'SLOT_ID_WEAPP_REWARD_VIDEO' );
}

const actions = {
  getBannerAd,
  getJiliAd,
}

exports.main = async (event, context) => {
  return await actions[event.funAction](event, context)
}