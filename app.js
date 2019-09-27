App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
  //全局变量
  globalData: {
    httpURL:'https://appgw.honghe.wlcxbj.com',
    userInfo: null,
    auth:"",
  },

  //全局函数
  getUserLoginStatus: function () {
    var access_token = wx.getStorageSync('access_token');
    if (access_token) {
      var expires_time = wx.getStorageSync('expires_time');
      //获取当前时间戳  
      var timestamp = Date.parse(new Date());
      if (expires_time > timestamp) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

})
