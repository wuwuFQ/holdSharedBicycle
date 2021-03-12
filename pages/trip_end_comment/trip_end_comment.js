// pages/trip_end_comment/trip_end_comment.js
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor_1: '#008000',
    bgColor_2: '#ddd',
    bgColor_3: '#ddd',
    bgColor_4: '#ddd',
    satisfactionLevel: 1,
    tripId: '',
    amount: '',
    balance: '',
    startTime: '',
    endTime: '',
    durationTime: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    var startDate = utils.formatTimeDate(options.startTime, 'Y年M月D日 h:m:s');
    var endDate = utils.formatTimeDate(options.endTime, 'Y年M月D日 h:m:s');
    that.durationTimeFormat(options.durationTime);
    that.tripId = options.tripId;

    that.setData({
      amount: options.amount,
      balance: options.balance,
      startTime: startDate,
      endTime: endDate,

    })
    

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

  selectCommentHandle: function(e) {
    var that = this;
    var tag = parseInt(e.currentTarget.dataset.tag);
    switch (tag) {
      case 100:
        that.satisfactionLevel = 1;
        that.setData({
          bgColor_1: '#008000',
          bgColor_2: '#ddd',
          bgColor_3: '#ddd',
          bgColor_4: '#ddd',
        })
        break;
      case 200:
        that.satisfactionLevel = 2;
        that.setData({
          bgColor_1: '#ddd',
          bgColor_2: '#008000',
          bgColor_3: '#ddd',
          bgColor_4: '#ddd',
        })
        break;
      case 300:
        that.satisfactionLevel = 3;
        that.setData({
          bgColor_1: '#ddd',
          bgColor_2: '#ddd',
          bgColor_3: '#008000',
          bgColor_4: '#ddd',
        })
        break;
      case 400:
        that.satisfactionLevel = 4;
        that.setData({
          bgColor_1: '#ddd',
          bgColor_2: '#ddd',
          bgColor_3: '#ddd',
          bgColor_4: '#008000',
        })
        break;
      default:
        break;
    }
  },

  submitHandle: function() {
    var that = this;
 
    var header = {
      'content-type': 'application/json'
    }
    header.Authorization = getApp().getGlobalAuthorization();
    wx.request({
      url: getApp().globalData.httpURL + '/api/biz/trip/satisfaction',
      method: "POST",
      header: header,
      data: {
        rentId: that.tripId,
        satisfactionLevel: that.satisfactionLevel,
      },
      success: function(res) {
        console.log(res.data);
        wx.navigateBack({
  
        })
      },
      complete() {

      }
    })
  },


  //
  durationTimeFormat: function (duration) {
    var that = this;
    var time = parseInt(duration / 1000);
    var hour, minute, seconds;
    if (time >= 3600) {
      hour = parseInt(time / 3600);
      minute = parseInt((time - 3600 * hour) / 60);
      seconds = time - minute * 60 - hour * 3600;
    } else {
      hour = 0;
      minute = parseInt(time / 60);
      seconds = time - minute * 60;
    }
    if (minute < 10) {
      minute = '0' + minute
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    if (hour == 0) {
      that.setData({
        durationTime: minute + ':' + seconds,
      })
    } else {
      that.setData({
        durationTime: hour + ':' + minute + ':' + seconds,
      })
    }
  },
})