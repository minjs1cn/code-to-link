module.exports = {
  onTabChange(event) {
    console.log()
    const { url } = event.detail;
    wx.navigateTo({
      url,
    })
  }
}