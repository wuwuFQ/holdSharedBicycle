// pages/login/login.js
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
    checkedStatus: false,

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
      var auth = 'Basic ' + that.base64encode(that.utf16to8('appClient:secret')).toString();
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
              key: "access_token",
              data: access_token
            })
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
            var expires_time = parseInt(expires_in) * 1000 + timestamp;
            wx.setStorage({
              key: "expires_time",
              data: expires_time
            })
            //异步缓存 延迟1秒
            setTimeout(function () {
              wx.reLaunch({
                url: '../index/index',
              });
              wx.hideLoading();
            }  , 1000);

          }
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
























  //
  //编码的方法
  base64encode: function(str) {
    //下面是64个基本的编码
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
        out += "==";
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
        out += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
  },
  //解码的方法
  base64decode: function(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {

      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while (i < len && c1 == -1);
      if (c1 == -1)
        break;

      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while (i < len && c2 == -1);
      if (c2 == -1)
        break;
      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

      do {
        c3 = str.charCodeAt(i++) & 0xff;
        if (c3 == 61)
          return out;
        c3 = base64DecodeChars[c3];
      } while (i < len && c3 == -1);
      if (c3 == -1)
        break;
      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

      do {
        c4 = str.charCodeAt(i++) & 0xff;
        if (c4 == 61)
          return out;
        c4 = base64DecodeChars[c4];
      } while (i < len && c4 == -1);
      if (c4 == -1)
        break;
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
  },
  utf16to8: function(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
    }
    return out;
  },
  utf8to16: function(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
      c = str.charCodeAt(i++);
      switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          // 0xxxxxxx
          out += str.charAt(i - 1);
          break;
        case 12:
        case 13:
          // 110x xxxx   10xx xxxx
          char2 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = str.charCodeAt(i++);
          char3 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 0x0F) << 12) |
            ((char2 & 0x3F) << 6) |
            ((char3 & 0x3F) << 0));
          break;
      }
    }
    return out;
  },

})