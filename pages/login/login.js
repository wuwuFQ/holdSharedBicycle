// pages/login/login.js
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '获取验证码', //按钮文字
    currentTime: 61, //倒计时
    disabled: false, //按钮是否禁用
    phone: '', //获取到的手机栏中的值
    Code: '',
    checkedStatus: true,

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

  checkboxChange: function(e) {
    this.setData({
      checkedStatus: e.detail.value.length == 1 ? true : false
    });
  },

  phoneInputHandle: function(e) {
    this.setData({
      phone: e.detail.value
    });
    console.log(this.data.phone);
  },
  codeInputHandle: function(e) {
    this.setData({
      Code: e.detail.value
    });
    console.log(this.data.Code);
  },

  getCodeAction: function() {
    var that = this;
    that.setData({
      disabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
      color: '#ccc',
    });

    var phone = that.data.phone;
    var currentTime = that.data.currentTime //把手机号跟倒计时值变例成js值
    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空

    if (phone == '') {
      warn = "手机号不能为空";
    } else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
      warn = "手机号格式不正确";
    } else { //验证码接口
      wx.request({
        url: getApp().globalData.httpURL + '/api/pub/smscode',
        method: "POST",
        data: {
          mobile: phone
        },

        success: function(res) {
          console.log(res)
          //当手机号正确的时候提示用户短信验证码已经发送
          wx.showToast({
            title: '短信验证码已发送',
            icon: 'none',
            duration: 2000
          });
          //设置一分钟的倒计时
          var interval = setInterval(function() {
            currentTime--; //每执行一次让倒计时秒数减一
            that.setData({
              text: currentTime + 's', //按钮文字变成倒计时对应秒数

            })
            //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
            if (currentTime <= 0) {
              clearInterval(interval)
              that.setData({
                text: '重新发送',
                currentTime: 61,
                disabled: false,
                color: '#008000'
              })
            }
          }, 1000);
        },
        fail: function(err) {
          console.log(err)
        }
      });

    }
    if (warn != null) {

      wx.showModal({
        title: '提示',
        content: warn,
        showCancel: false,
      })
      that.setData({
        disabled: false,
        color: '#008000'
      })
    }
  },

  loginButtonClick: function() {
 
    var that = this;
    var phone = that.data.phone;
    var code = that.data.Code;
    var checkedStatus = that.data.checkedStatus;
    var warn = null;

    if (phone == '') {
      warn = "手机号不能为空";
    } else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
      warn = "手机号格式不正确";
    } else if (code == '') {
      warn = "验证码不能为空";
    } else if (checkedStatus == false) {
      warn = "请勾选用户协议";
    } else { //登录接口
      wx.showLoading({
        title: '登录中...',
        mask: true,
      })
      var auth = 'Basic ' + utils.base64encode(utils.utf16to8('appClient:secret')).toString();

      // var auth = 'Basic ' + that.base64encode(that.utf16to8('appClient:secret')).toString();
      console.log(auth);
      var header = {
        'content-type': 'application/x-www-form-urlencoded'
      }
      header.Authorization = auth;







      wx.request({
        url: getApp().globalData.httpURL + '/oauth/token',
        method: "POST",
        header: header,
        data: {
          username: phone,
          password: code,
          grant_type: "password",
          channel: "IOS",
          version: "1.0",
          deviceId: "123",
        },

        success: function(res) {
          
          console.log(res)
          if (res.statusCode == 200) {
            var access_token = res.data.access_token;
            var expires_in = res.data.expires_in;
            var mobile = res.data.mobile;
            var userId = res.data.userId;
            getApp().globalData.auth = 'bearer ' + access_token;

            
            wx.setStorage({
              key: "mobile",
              data: mobile
            })
            wx.setStorage({
              key: "userId",
              data: userId
            })
            //获取当前时间戳  
            var timestamp = Date.parse(new Date());
            var expires_time = parseInt(expires_in) + timestamp;
            wx.setStorage({
              key: "expires_time",
              data: expires_time
            })
            wx.setStorage({
              key: "access_token",
              data: access_token,
              success: function () {
                wx.reLaunch({
                  url: '../index/index',
                });
                

              }, fail: function (err) {
                console.log(err)
              }
            })
         
       
            //异步缓存 延迟1秒
            // setTimeout(function () {
            //   wx.reLaunch({
            //     url: '../index/index',
            //   });
            //   wx.hideLoading();
            // }  , 1000);

          }
          wx.hideLoading();
        },
        fail: function(err) {
          wx.hideLoading()
          console.log(err)
        }
      })
    }

    if (warn != null) {
      wx.showModal({
        title: '提示',
        content: warn,
        showCancel: false,
      })
    }
  },
  


})