// pages/mine_info_auth/mine_info_auth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
name: '',
cardId: '',
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

  bindinputNameHandle: function(e) {
    var that = this;
    that.name = e.detail.value.replace(/\s+/g, '');
  },
  bindinputCardHandle: function (e) {
    var that = this;
    that.cardId = e.detail.value.replace(/\s+/g, '');
  },
  //
  submitHandle: function() {
    var that = this;
    if (!that.name) {
wx.showToast({
  title: '请输入姓名',
  icon: 'none'
})
return;
    }
    if (!that.cardId) {
      wx.showToast({
        title: '请输入身份证',
        icon: 'none'
      })
      return;
    }

    

    var header = {
      'content-type': 'application/json'
    }
    header.Authorization = getApp().getGlobalAuthorization();
    wx.request({
      url: getApp().globalData.httpURL + '/api/biz/realinfo/verify',
      method: "POST",
      header: header,
      data: {
        realName: that.name,
        idCard: that.cardId,
      },
      success: function(res){
console.log(res);
        var errCode = res.data.errcode;
        var errmsg = res.data.errmsg;
        if (errCode == 1007) {
          wx.showModal({
            title: '实名认证',
            content: '恭喜您认证成功！',
            showCancel: false,
            success: function () {
              wx.navigateBack({
                delta: 2
              })
            }
          })
        } else {
          wx.showModal({
            title: '实名认证',
            content: errmsg,
            showCancel: false,
      
          })
        }

      },
    })
  },
})