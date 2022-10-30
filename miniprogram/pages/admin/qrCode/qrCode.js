// index.js
const cloud = require('../../../utils/cloud');
const app = getApp()

Page({
  data: {
    qrCodeName: '',
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
    this.refreshList()
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
    this.getQrCode()
  },

  async bindrefresherrefresh() {
    this.setData({
      triggered: true
    })
    await this.refreshList()
    this.setData({
      triggered: false
    })
  },

  async getQrCode() {
    if (this.data.ended || this.data.loading) return
    this.data.loading = true
    try {
      const res =  await cloud.callFunction('admin/qrCode/get', {
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

  async saveQrCode(event) {
    const { fileid } = event.currentTarget.dataset
    console.log(fileid)
    try {
      const { tempFilePath } = await wx.cloud.downloadFile({
        fileID: fileid,
      })
      const { authSetting } = await wx.getSetting()
      if (!authSetting['scope.writePhotosAlbum']) {
        await wx.authorize({
          scope: 'scope.writePhotosAlbum',
        })
      }
      await wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
      })
      wx.showToast({
        title: '保存成功',
      })
    } catch (error) {
      wx.showToast({
        title: '保存失败',
      })
    }
  },

  bindQrCode(event) {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/admin/qrCode/bind?id=${id}`,
    })
  },

  async refreshList() {
    this.data.page = 1
    this.data.ended = false
    this.data.list = []
    await this.getQrCode()
  },

  async createQrCode() {
    try {
      const res = await cloud.callFunction('admin/qrCode/create', {
        name: this.data.qrCodeName,
      })
      this.refreshList()
    } catch (error) {
      
    }
  }
});
