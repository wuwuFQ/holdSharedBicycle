// pages/wallet_recharge/wallet_recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor_1: '#008000',
    bgColor_2: '#D3D3D3',
    bgColor_3: '#D3D3D3',
    textColor_1: '#008000',
    textColor_2: '#000',
    textColor_3: '#000',

    price: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    that.price = '19';

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

  selectPriceHandle: function(e) {
    var that = this;
    var tag = parseInt(e.currentTarget.dataset.tag);
    switch (tag) {
      case 100:
        that.price = '19';
        that.setData({
          bgColor_1: '#008000',
          bgColor_2: '#D3D3D3',
          bgColor_3: '#D3D3D3',
          textColor_1: '#008000',
          textColor_2: '#000',
          textColor_3: '#000',
        })
        break;
      case 200:
        that.price = '200';
        that.setData({
          bgColor_1: '#D3D3D3',
          bgColor_2: '#008000',
          bgColor_3: '#D3D3D3',
          textColor_1: '#000',
          textColor_2: '#008000',
          textColor_3: '#000',
        })
        break;
      case 300:
        that.price = '300';
        that.setData({
          bgColor_1: '#D3D3D3',
          bgColor_2: '#D3D3D3',
          bgColor_3: '#008000',
          textColor_1: '#000',
          textColor_2: '#000',
          textColor_3: '#008000',
        })
        break;
      default:
        break;
    }
  },

  //点击充值
  rechargeHandle: function() {
    if (getApp().getUserLoginStatus() == false) {
      wx.reLaunch({
        url: '../login/login',
      })
      return;
    }
    
    var that = this;
    var userOpenID = wx.getStorageSync('userOpenID');
    if (userOpenID) {
      wx.checkSession({ //检测登录是否过期
        success: function(res) {
          //session_key 未过期，并且在本生命周期一直有效
          //去请求微信支付
          that.getWXPayParameter(userOpenID)
        },
        fail: function(res) {
          // session_key 已经失效，需要重新执行登录流程
          that.wxLogin();
        },
        complete: function(res) {},
      });
    } else { //没有登陆过
      that.wxLogin();
    }


  },

  wxLogin: function() {
    var that = this;
    wx.login({ //获取code
      success(res) {
        if (res.code) {
          //发起网络请求 换取openID
          console.log('登录成功！' + res.code)
          that.getUserOpenID(res.code);

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail: function(err) {

      }
    });
  },
  //去后台换取openID
  getUserOpenID: function(code) {
    var that = this;
    var header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
    header.Authorization = getApp().getGlobalAuthorization();
    wx.request({
      url: getApp().globalData.httpURL + '/api/pay/wx/findAppletsOpenID',
      method: "POST",
      header: header,
      data: {
        code: code,
      },
      success: function(res) {
        console.log(res)
        var data = res.data
        if (data == "0" || data == "-1") {

        } else {
          wx.setStorageSync("userOpenID", data)
          //去请求微信支付
          that.getWXPayParameter(data);
        }
      }
    })
    
  },
  //去请求微信支付需要的参数
  getWXPayParameter: function (userOpenID) {
    var that = this;

    var header = {
      'content-type': 'application/json'
    }
    header.Authorization = getApp().getGlobalAuthorization();
    wx.request({
      url: getApp().globalData.httpURL + '/api/pay/wx/appletsRecharge',
      method: "POST",
      header: header,
      data: {
        orderTypeSpid: '2',
        orderAmount: that.price,
        realpayAmount: that.price,
        openID: userOpenID,
        channel: "IOS",
        version: "1.0",
        deviceId: "123",
      },
      success: function (res) {
        console.log(res)
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.pkg,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(res) { 
            console.log(res);
            wx.navigateBack({
              
            })
          },
          fail(res) { }
        })
      }
    })
  },
})