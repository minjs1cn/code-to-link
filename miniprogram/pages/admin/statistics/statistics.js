const cloud = require('../../../utils/cloud');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    id: '',
    info: {},
    list: [],
    total: 0,
    page: 1,
    size: 3,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.id = options.id
    console.log(this.data.id)
    this.getById(this.data.id)
  //  cloud.callFunction('ad/publisher_adunit_general/getBannerAd')
    // cloud.callFunction('ad/publisher_adunit_general/getJiliAd')
  },

  async getBannerAd() {
    const { list, total_num } = await cloud.callFunction('ad/publisher_adunit_general/getBannerAd')
    console.log('data', list, total_num)
  },
  async getJiliAd() {
    const { list = [], total_num } = await cloud.callFunction('ad/publisher_adunit_general/getJiliAd', {
      page_size: this.data.size,
      page: this.data.page,
    })
    this.setData({
      list: this.data.list.concat(list.filter(item => item.ad_unit_id === this.data.info.ad_jili_id))
    })
    this.data.total = total_num;
    if (this.data.page * this.data.size < this.data.total) {
      this.data.page++
      this.getJiliAd();
    }
  },

  onChange(event) {
    const { index } = event.detail
    switch(index) {
      case 0:
        console.log('BANNER')
        this.getBannerAd()
        break;
      case 1:
        console.log('JILI')
        this.getJiliAd()
        break;
      default:
        break;
    }
  },

  async getById(id) {
    try {
      const res =  await cloud.callFunction('admin/shop/getById', {
        id,
      })
      if (res.data) {
        this.data.info = res.data
      }
    } catch (error) {
      console.error(error)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})