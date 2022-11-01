// index.js
const cloud = require('../../utils/cloud');
const app = getApp()

// 在页面中定义激励视频广告
let videoAd = null

Page({
  data: {
    wifi: {
      name: '',
      password: ''
    },
    list: [],
    name: '',
    ad_jili_id: '',
    ad_banner_id: '',
    wifiId: '',
  },

  onLoad(options) {
    const { id = '9ca339b4635b4626004810581c69b066' } = options;
    this.getQrCode(id)

    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-84c41cc0014f84c8'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
      videoAd.onClose(res => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          this.startWifi()
        } else {
          // 播放中途退出，不下发游戏奖励
        }
      })
    }
  },

  linkWifi(e) {
    const { id } = e.target.dataset
    this.data.wifiId = id;
   
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
  },

  async startWifi() {
    const wifi = this.data.list.filter(item => item._id === this.data.wifiId)[0]
    try {
			//1.检测手机型号
			const sys = await wx.getSystemInfo();
			var system = 0;
			const isIOS = sys.platform === 'ios';
			const isAndroid = sys.platform === 'android';
			if (isAndroid) system = parseInt(sys.system.substr(8));
			if (isIOS) system = parseInt(sys.system.substr(4));
			if (isAndroid && system < 6) {
        wx.showToast({
          title: 'android版本过低',
        })
        return
			}
			if (isIOS && system < 11.2) {
        wx.showToast({
          title: 'ios版本过低'
        })
        return
			}
			//2.初始化 Wi-Fi 模块
			wx.startWifi({
			  success() {
			    wx.connectWifi({
			      SSID: wifi.name,
			      password: wifi.password,
			      success() {
			          if (isIOS) { // 是否是IOS可通过提前调用getSystemInfo知道
			            wx.onWifiConnected(result=> {
			              if (result.wifi.SSID === formData.name) {
			                wx.showToast({
			                		title: '连接成功'
			                });
			              }  else {
			                // 连接失败
											wx.showToast({
													title: '连接失败'
											});
			              }
			            })
			          } else {
			            // 连接成功
									wx.showToast({
											title: '连接成功'
									});
			          }
			      },
			      fail(e) {
			        // 连接失败
							wx.showToast({
									title: '连接失败'
							});
			      }
			    })
			  }
			})
		} catch (e) {
			wx.showToast({
					title: 'catch: ' + (e.message || '未知错误')
			});
		}
  },

  async getQrCode(id) {
    const data = await cloud.callFunction('client/qrCode/getById', {
      id,
    })
    this.setData({
      wifi: data.wifi,
      list: data.wifis,
      ad_banner_id: data.ad_banner_id,
      name: data.name,
    })
    this.data.ad_jili_id = data.ad_jili_id
  },

  openAdmin() {
    wx.navigateTo({
      url: '/pages/admin/qrCode/qrCode',
    })
  }
});
