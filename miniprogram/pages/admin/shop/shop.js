// index.js
const cloud = require('../../../utils/cloud');
const app = getApp()

Page({
  data: {
    shopName: '',
    list: [],
    scrollHeight: 0,
    page: 1,
    size: 15,
    ended: false,
    loading: false,
    triggered: false,
  },

  onLoad() {
  },

  onReady() {
    this.initScrollView();
  },

  onShow() {
    this.refreshList();
  },

  initScrollView() {
    let that = this;
    let screenHeight = wx.getSystemInfoSync().windowHeight
    console.log(screenHeight)
    that.setData({
      scrollHeight: screenHeight - 50 - 50 - 50
    })
  },

  bindscrolltolower() {
    console.log('bindscrolltolower')
    this.getShopList()
  },

  async bindrefresherrefresh() {
    console.log('bindrefresherrefresh')
    this.setData({
      triggered: true
    })
    await this.refreshList()
    this.setData({
      triggered: false
    })
  },

  async getShopList() {
    if (this.data.ended || this.data.loading) return
    try {
      this.data.loading = true
      const res =  await cloud.callFunction('admin/shop/get', {
        size: this.data.size,
        page: this.data.page
      })
      if (res.data.length) {
        this.setData({
          list: this.data.list.concat(res.data)
        })
        this.data.page += 1
      } else {
        this.data.ended = true
      }
    } catch (error) {
      console.error(error)
    }
    this.data.loading = false
  },

  async refreshList() {
    this.data.page = 1
    this.data.ended = false
    this.data.list = []
    await this.getShopList()
  },

  async createShop(event) {
    if (!this.data.shopName) return
    try {
      const res = await cloud.callFunction('admin/shop/create', {
        name: this.data.shopName,
      })
      const { _id } = res
      wx.navigateTo({
        url: `/pages/admin/shop/create?id=${_id}`,
      })
    } catch (error) {
      
    }
  },

  async bindWifi() {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/admin/shop/bind?id=${id}`,
    })
  }
});
