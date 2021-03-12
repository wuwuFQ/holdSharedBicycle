// pages/unlock/unlock.js
var utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  scanHandle: function() {
    if (getApp().getUserLoginStatus() == false) {
      wx.showModal({
        title: '登录提示',
        content: '需要登录后才能用车',
        confirmText: '去登录',
        cancelText: '暂不登录',
        success(res) {
          if (res.confirm) {
           
            wx.reLaunch({
              url: '../login/login',
            })
          } else if (res.cancel) {
           
          }
        }
      })
      return;
    }
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],

      success: function(res) {
        console.log(res);
        var result = res.result;
        if (result.indexOf('www.donglongbike.com') > 0) {

          var arr = result.split("code=");
          var tnoCode = arr[1];

          if (tnoCode) { //拿到车辆编码
            utils.requestUnlock(tnoCode)
          } else {
            wx.showModal({
              title: '扫码骑车',
              content: '二维码异常',
              showCancel: false,
            })
          }
        } else {
          wx.showModal({
            title: '扫码骑车',
            content: '二维码不正确',
            showCancel: false,
          })
        }
      },
    })
  },
  manualHandle: function() {
    wx.navigateTo({
      url: '../unlockManual/unlockManual',
    })
  },
})