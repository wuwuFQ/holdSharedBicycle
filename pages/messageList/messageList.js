// pages/messageList/messageList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataArr: [],
    pageNo: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
var that = this;
that.data.pageNo = 0;
that.getMessageList();
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
    var that = this;
    that.data.pageNo = 0;
    that.getMessageList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    that.data.pageNo++;
    that.getMessageList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getMessageList: function() {
    var that = this;

    var header = {
      'content-type': 'application/json'
    }
    header.Authorization = getApp().getGlobalAuthorization();
    wx.request({
      url: getApp().globalData.httpURL + '/api/user/msg/list',
      method: "POST",
      header: header,
      data: {
        pageNo: that.data.pageNo,
        pageSize: '10'
      },
      success: function (res) {
        console.log(res);
        var newarray = res.data.msg;
        if (that.pageNo == 0) {
          that.data.dataArr = newarray;
          that.setData({
            dataArr: that.data.dataArr,
          })
        } else {
          if (newarray.length == 0) {
            wx.showToast({
              title: '没有更多数据了',
              icon: 'none',
            })
          } else {
            that.data.dataArr = that.data.dataArr.concat(newarray);
            that.setData({
              dataArr: that.data.dataArr,
            })
          }
        }
      }
    })
  },

})