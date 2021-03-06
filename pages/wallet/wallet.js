// pages/wallet/wallet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: "0.00",

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
    that.getUserInfo();

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
  balanceRechargeHandle: function () {
    wx.navigateTo({
      url: '../wallet_recharge/wallet_recharge',
    })
  },
  

  //获取用户信息
  getUserInfo: function () {
    var that = this;

    var header = {
      'content-type': 'application/json'
    }
    header.Authorization = getApp().getGlobalAuthorization();
        wx.request({
      url: getApp().globalData.httpURL + '/api/user/account',
      method: "POST",
      header: header,
      data: {

      },
      success: function (res) {
        console.log(res);
        var account = res.data.account;
        var basicInfo = res.data.basicInfo;
        var realInfo = res.data.realInfo;
        that.setData({
          balance: res.data.account.balance.toFixed(2)
        })

        

        wx.setStorage({
          key: 'account',
          data: account,
        });

        wx.setStorage({
          key: 'basicInfo',
          data: basicInfo,
        });

        wx.setStorage({
          key: 'realInfo',
          data: realInfo,
        });
      }
    })
  },


 })