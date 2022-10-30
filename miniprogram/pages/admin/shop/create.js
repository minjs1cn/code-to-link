const cloud = require('../../../utils/cloud');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
      name: '',
      address: '',
      tel: '',
      ad_jili_id: '',
      ad_banner_id: '',
      wifis: [],
    },
    id: '',
    sid: '',
    password: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id || options.query.id
    this.data.id = id
    this.getById(id)
  },

  async bindWifi(wifis) {
    await cloud.callFunction('admin/shop/bindWifi', {
      _id: this.data.id,
      wifis,
    })
    wx.showToast({
      title: '更新成功',
    })
  },

  async addWifi() {
    const res = await cloud.callFunction('admin/wifi/create', {
      sid: this.data.sid,
      password: this.data.password,
    })
    try {
      const wifis = (this.data.info.wifis || []).concat([
        {
          _id: res._id,
          sid: this.data.sid,
          password: this.data.password,
        }
      ])
      
      await this.bindWifi(wifis)
      this.setData({
        info: {
          ...this.data.info,
          wifis,
        }
      })
      wx.showToast({
        title: '保存成功',
      })
    } catch (error) {
      console.error(error)
    }
  },

  async formSubmitAd(e) {
    const data = e.detail.value
    console.log(data)
    await cloud.callFunction('admin/shop/bindAd', {
      ...data,
      _id: this.data.id,
    })
    wx.showToast({
      title: '更新成功',
    })
  },

  async formSubmitWifi(e) {
    const data = e.detail.value
    console.log(data)
    const wifis = []
    for (const key in data) {
      console.log(key)
      const [_, index, name] = key.split('.')
       if (!wifis[index]) { 
        wifis[index] = {}
       }
       wifis[index][name] = data[key]
    }
    console.log(wifis)
    await this.bindWifi(wifis)
  },

  async formSubmit(e) {
    const data = e.detail.value
    if (data.tel.length !== 11) return
    
    await this.save({
      _id: this.data.id,
      ...data
    })
  },

  async save(data) {
    try {
      await cloud.callFunction('admin/shop/update', data)
      wx.showToast({
        title: '保存成功',
      })
    } catch (error) {
      console.error(error)
    }
  },

  async getById(id) {
    try {
      const res =  await cloud.callFunction('admin/shop/getById', {
        id,
      })
      if (res.data) {
        this.setData({
          info: res.data
        })
      }
    } catch (error) {
      console.error(error)
    }
  },
})