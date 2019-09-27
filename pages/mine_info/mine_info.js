// pages/mine_info/mine_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head_image: "/images/bike.png",
    nickName: "",
    phone: "",
    name: "",
  auth: "未认证",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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
    var that = this;
    wx.getStorage({
      key: 'basicInfo',
      success: function (res) {
        that.setData({
          head_image: res.data.avatarUrl,
          nickName: res.data.nickName,
        });
      },
    });

    wx.getStorage({
      key: 'realInfo',
      success: function (res) {
        if (res.data.authenticationStatus == 2) {
          that.setData({
            auth: "已认证",
            name: res.data.realName,
          });
        }

      },
    });

    wx.getStorage({
      key: 'mobile',
      success: function (res) {
        that.setData({
          phone: res.data
        });
      },
    })

//阿里OSS上传
//     var auth = 'bearer ' + wx.getStorageSync("access_token");
//     var header = {
//       'content-type': 'application/json'
//     }
//     header.Authorization = auth;
// wx.request({
//   url: getApp().globalData.httpURL + '/api/biz/aliyun/oss/sts',
//   method: "POST",
//   header: header,
//   data: {
//     tokenTypeSpid: '2',
//     channel: "IOS",
//     version: "1.0",
//     deviceId: "123",
//   },
//   success: function (res) {
// console.log(res)
//     var ouploadOssModel = res.data.stsCredentialsModel;
//   },
// })
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

  headerImgViewHandle: function () {
    wx.chooseImage({
      count: 1,
      sourceType: ["album", "camera"],
      success: function (res) {
console.log(res)
        const tempFilePaths = res.tempFilePaths
        wx.showToast({
          icon: 'none',
          title: '暂未开放',
        })
      },
    })
  },

  nickNameHandle: function () {
wx.navigateTo({
  url: '../mine_info_modifyNickName/mine_info_modifyNickName',
})
  },
})