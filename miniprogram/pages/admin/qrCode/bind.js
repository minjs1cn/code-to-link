const cloud = require('../../../utils/cloud');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    columns: [],
    list: [],
    loading: false,
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { id } = options;
    console.log(id)
    this.data.id = id;
    this.getAll()
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    if (index === 0) {
      picker.setColumnValues(1, (this.data.list.find(item => item._id === value[0]._id).wifis || []))
    }
  },

  async getAll() {
    this.setData({
      loading: true,
    })
    const res = await cloud.callFunction('admin/shop/getAll')
    this.setData({
      list: res.data,
      loading: false,
      columns: [
        {
          values: res.data,
        },
        {
          values: (res.data[0].wifis || []),
        },
      ]
    })
  },

  async bindWifi(e) {
    const { picker, value, index } = e.detail;
    console.log(value)
    await cloud.callFunction('admin/qrCode/bindWifi', {
      _id: this.data.id,
      shopId: value[0]._id,
      wifiId: value[1]._id,
    })
    wx.showToast({
      title: '绑定成功',
    })
  },
})