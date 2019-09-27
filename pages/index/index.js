//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    longitude: 0,
    latitude: 0,
    scale: 17
  },

//生命周期函数--监听页面加载
  onLoad: function (options) {
    this.timer = options.timer;
    wx.getLocation({
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          

        })
      },
      fail: (err) => {
        console.log("获取位置失败")
      }
    })


    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: "/images/location.png",
            position: {
              width: 40,
              height: 40,
              left: 20,
              top: res.windowHeight - 80
            },
            clickable: true
          }, {
            id: 2,
            iconPath: "/images/use.png",
            position: {
              width: 100,
              height:100,
              left: res.windowWidth / 2 - 50,
              top: res.windowHeight - 120
            },
            clickable: true
          }, {
            id: 3,
            iconPath: "/images/avatar.png",
            position: {
              width: 40,
              height: 40,
              left: res.screenWidth - 60,
              top: res.windowHeight - 80
            },
            clickable: true
          }, {
            id: 4,
            iconPath: "/images/warn.png",
            position: {
              width: 40,
              height: 40,
              left: res.screenWidth - 60,
              top: res.windowHeight - 140
            },
            clickable: true
          }, {
            id: 5,
            iconPath: "/images/marker.png",
            position: {
              width: 30,
              height: 50,
              left: res.windowWidth / 2 - 15,
              top: res.windowHeight / 2 - 50
            }
          }]
        })
      },
    })
  },

  /**
    * 生命周期函数--监听页面初次渲染完成
    */
  onReady: function () {

  },


  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    this.mapctx = wx.createMapContext("map", this)
    
    this.movetoCenter();

   //是否登录
    var status = app.getUserLoginStatus();
    if (status) {

    } else {
      wx.reLaunch({
        url: '../login/login',
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


//去中心位置
  movetoCenter: function () {
    this.mapctx.moveToLocation();
    this.setData({
      scale: 17
    })
   
  },

  // 地图上的按钮 事件
 bindcontroltap: function (e) {
    switch (e.controlId) {
      case 1:  //定位
        this.movetoCenter();
        break;
      case 2:  //扫一扫
        if (this.timer) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.scanCode({
            success: () => {
              wx.showLoading({
                title: '正在获取密码',
              })
              wx.request({
                url: 'https://www.easy-mock.com/mock/5963172d9adc231f357c8ab1/ofo/getname',

                success: (res) => {
                  console.log(res);
                  wx.hideLoading();
                  wx.redirectTo({
                    url: '../scanResult/index?password=' + res.data.data.password + '&number=' + res.data.data.number,
                    success: () => {
                      wx.showToast({
                        title: '获取密码成功',
                        duration: 1000
                      })
                    }
                  })
                }
              })
            }
          })
        }
        break;
      case 3:  //我的
        wx.navigateTo({
          url: '../mine/mine',
        })
        break;
      case 4: //故障上报
        wx.navigateTo({
          url: '../warn/warn',
        })
        break;

    }
  },

})
