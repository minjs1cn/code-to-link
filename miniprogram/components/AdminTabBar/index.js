// components/AdminTabBar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: Number,
  },

  observers: {
    active: function(active) {
      this.setData({
        index: active
      });
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTabChange(event) {
      const name = event.detail
      const urls = [
        "/pages/admin/qrCode/qrCode",
        "/pages/admin/shop/shop",
        "/pages/admin/statistics/statistics",
        "/pages/admin/my/my",
      ]
      if (name === this.data.index) {
        return
      }
      this.setData({
        index: name
      })
      wx.redirectTo({
        url: urls[name]
      })
    },
  }
})
