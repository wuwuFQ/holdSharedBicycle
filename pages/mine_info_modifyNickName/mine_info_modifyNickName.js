// pages/mine_info_modifyNickName/mine_info_modifyNickName.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
oldNickName: "",
newNickName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
wx.getStorage({
  key: 'basicInfo',
  success: function(res) {
    that.oldNickName = res.data.nickName;
that.setData({
  oldNickName: res.data.nickName
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
  inputEventhandle: function (e) {
    var that = this;
    that.newNickName = e.detail.value;
  },
  saveHandle: function () {
    var that = this;

    if ( that.newNickName != undefined && that.newNickName != "" && that.newNickName != that.oldNickName){

      var auth = 'bearer ' + wx.getStorageSync("access_token");
      var header = {
        'content-type': 'application/json'
      }
      header.Authorization = getApp().getGlobalAuthorization();
      wx.request({
        url: getApp().globalData.httpURL + '/api/user/update/basicinfo',
        method: "POST",
        header: header,
        data: {
          nickName: that.newNickName
        },
        success: function (res) {
          console.log(res);
          var basicInfo = res.data.basicInfo;

          wx.setStorage({
            key: 'basicInfo',
            data: basicInfo,
          });

          wx.navigateBack({
            
          })
        },
})
    }
  },
})