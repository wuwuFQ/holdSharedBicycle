//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');
Page({
  data: {
    windowWidth: '',
    windowHeight: '',
    tirpViewLeft: 0,
    longitude: '',
    latitude: '',
    scale: 17,
    interval: null, //轮询定时器
    tripView_hidden: true,
    tripTitle: '骑行中',
    tripTime: '00:00', //骑行时间
    tnoCode: '',
    tripViewTimer: null, //骑行视图定时器
    tripViewTimer_long: null, //骑行视图定时器  长连接 5
    tripView_continue_hidden: true, //继续用车按钮

  },

  //生命周期函数--监听页面加载
  onLoad: function(options) {
    var that = this;
    console.log(options)
  
    if (options.q) {
      var status = app.getUserLoginStatus();
      if (status) {
        let result = decodeURIComponent(options.q)
        if (result.indexOf('www.donglongbike.com') > 0) {

          var arr = result.split("code=");
          var tnoCode = arr[1];

          if (tnoCode) { //拿到车辆编码
            that.requestUnlock(tnoCode)
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
      }
   }

    that.locationUpdateChange();

    that.setupIcon();


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
    var that = this;

    that.mapctx = wx.createMapContext("map", this)

    that.movetoCenter();

    //是否登录
    var status = app.getUserLoginStatus();
    if (status) {
      utils.getUserInfo();

    } 
    // else {
    //   wx.reLaunch({
    //     url: '../login/login',
    //   })
    // }

    that.startIntervalTimer();


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
    var that = this;
    clearInterval(that.data.interval);
    clearInterval(that.data.tripViewTimer);
    clearInterval(that.data.tripViewTimer_long);
    that.data.tripViewTimer_long = null;
    that.data.interval = null;
    that.data.tripViewTimer = null;
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

  //监听位置
  locationUpdateChange: function() {
    var that = this;
    wx.startLocationUpdate({
      success: function() {
        wx.onLocationChange(function(res) {
          console.log('location change', res)
          that.data.longitude = res.longitude;
          that.data.latitude = res.latitude;
          wx.setStorage({
            key: 'userLatitude',
            data: that.data.latitude,
          })
          wx.setStorage({
            key: 'userLongitude',
            data: that.data.longitude,
          })
          console.log(that.data.longitude, that.data.latitude);

        });
      },
    });
  },

  //设置图标
  setupIcon: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {

        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          tirpViewLeft: res.windowWidth / 2 - 60,
          controls: [{
              id: 1,
              iconPath: "/images/location.png",
              position: {
                width: 40,
                height: 40,
                left: 20,
                top: res.windowHeight - 80
              },
              clickable: true
            }, {
              id: 2,
              iconPath: "/images/use.png",
              visibility: false,
              position: {
                width: 100,
                height: 100,
                left: res.windowWidth / 2 - 50,
                top: res.windowHeight - 120
              },
              clickable: true
            }, {
              id: 3,
              iconPath: "/images/avatar.png",
              position: {
                width: 35,
                height: 35,
                left: res.screenWidth - 60,
                top: res.windowHeight - 80
              },
              clickable: true
            },
            //  {
            // id: 4,
            // iconPath: "/images/warn.png",
            // position: {
            //   width: 40,
            //   height: 40,
            //   left: res.screenWidth - 60,
            //   top: res.windowHeight - 140
            // },
            // clickable: true
            // }, 
            {
              id: 5,
              iconPath: "/images/marker.png",
              position: {
                width: 18,
                height: 32,
                left: res.windowWidth / 2 - 9,
                top: res.windowHeight / 2 - 32
              }
            }
          ]
        })
      },
      fail: function(err) {
        console.log('获取设备信息失败');
      }
    })
  },

  //去中心位置
  movetoCenter: function() {
    var that = this;
    that.setData({
      longitude: that.data.longitude,
      latitude: that.data.latitude,
    })
    that.mapctx.moveToLocation();
    that.setData({
      scale: 17
    })

  },

  // 地图上的按钮 事件
  bindcontroltap: function(e) {
    var that = this;
    switch (e.controlId) {
      case 1: //定位
        that.movetoCenter();
        break;
      case 2: //扫一扫
        
        // if (getApp().getUserLoginStatus() == false) {
        //   wx.reLaunch({
        //     url: '../login/login',
        //   })
        //   return;
        // }
        var account = wx.getStorageSync('account');
        var realInfo = wx.getStorageSync('realInfo');
        // if (account.balance <= 0.0) {
        //   wx.showModal({
        //     title: '禁止用车',
        //     content: '余额不足，不能用车，请先充值余额。',
        //     showCancel: false,
        //   })
        //   return;
        // }
        if (realInfo.authenticationStatus == 1) {
          wx.showToast({
            title: '您的实名认证正在审核中',
            icon: 'none'
          })
          return;
        }


        if (realInfo.authenticationStatus != 2) {
          wx.showModal({
            title: '',
            content: '您还未实名认证，暂不能用车，请先进行实名认证。',
            confirmText: '去认证',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../mine_info_auth/mine_info_auth',
                })
              }
            }
          })
          return;
        }
        wx.navigateTo({
          url: '../unlock/unlock',
        })
        break;
      case 3: //我的
        // if (getApp().getUserLoginStatus() == false) {
        //   wx.reLaunch({
        //     url: '../login/login',
        //   })
        //   return;
        // }
        wx.navigateTo({
          url: '../mine/mine',
        })
        break;
      case 4: //故障上报
        wx.navigateTo({
          // url: '../warn/warn',
        })
        break;

    }
  },

  //请求开锁
  requestUnlock: function(tnoCode) {
    wx.showLoading({
      title: '开锁中...',
      mask: true,
    })
    var that = this;

    var header = {
      'content-type': 'application/json'
    }
    header.Authorization = getApp().getGlobalAuthorization();
    wx.request({
      url: getApp().globalData.httpURL + '/api/superbiz/unlock/carry',
      method: "POST",
      header: header,
      data: {
        tno: tnoCode,
        userlat: that.data.latitude,
        userlng: that.data.longitude,
      },
      success: function(res) {
        console.log(res.data);

        if (res.data.errcode == 4403) { //长连接开锁成功
          wx.setStorageSync('tidCode', res.data.tid);
          wx.setStorageSync('tnoCode', res.data.tno);
          //轮询锁的状态
          that.startIntervalTimer();
        } else { //开锁失败
          wx.hideLoading()
          wx.showModal({
            title: '开锁失败',
            content: res.data.errmsg,
            showCancel: false,
          })
        }
      },
      complete() {

      }
    })
  },

  //开启轮询timer
  startIntervalTimer: function() {
    var that = this;
    if (that.data.interval) {
      clearInterval(that.data.interval);
      that.data.interval = null;
    }

    wx.getStorage({
      key: 'tidCode',
      success: function(res) {

        that.data.interval = setInterval(function() {
          that.checkLockStatus(res.data);
        }, 5000);
        that.checkLockStatus(res.data);

      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  //锁的状态
  checkLockStatus: function(tid) {
    var that = this;

    var header = {
      'content-type': 'application/json'
    }
    header.Authorization = app.getGlobalAuthorization();
    wx.request({
      url: getApp().globalData.httpURL + '/api/biz/locker/status',
      method: "POST",
      header: header,
      data: {
        tid: tid,
        channel: "IOS",
        version: "1.0",
        deviceId: "123",
      },
      success: function(res) {
        console.log(res);
        var errcode = res.data.errcode;
        var lockStatus = res.data.lockerStatus;
        var legalParking = res.data.legalParking //1 内 2 外

        if (errcode == 4201) { //行程结束
          clearInterval(that.data.interval);
          clearInterval(that.data.tripViewTimer);
          clearInterval(that.data.tripViewTimer_long);
          that.data.tripViewTimer_long = null;
          that.data.interval = null;
          that.data.tripViewTimer = null;
          //endMark:结束行程为0 你告诉服务器改为1  然后跳转页面
          if (res.data.endMark == "0") {
            //告诉服务器结束行程并跳转结束页面
            that.requestForEndTripStatus(tid);
          }
          that.setData({
            tripView_hidden: true,
          })

        } else if (errcode == 0) {
          console.log('锁的状态 == ' + lockStatus)
          that.setData({
            tripView_hidden: false,
          })

          if (lockStatus == 3) { //骑行状态
            wx.hideLoading()
            that.setData({
              tripTitle: "骑行中",
              tripView_continue_hidden: true,
            })
            that.refreshTripView(res.data.duration, 3);

          } else if (lockStatus == 5) { //长连接状态
            wx.hideLoading()
            that.setData({
              tripTitle: "骑行中",
              tripView_continue_hidden: true,
            })
            that.refreshTripView(res.data.duration, 5);

          } else if (lockStatus == 6) { //临时停车
            that.setData({
              tripTitle: "临时停车",
              tripView_continue_hidden: false,
            })
            that.refreshTripView(res.data.duration, 6);

          } else if (lockStatus == 7) { //锁关闭，还未结束行程
            clearInterval(that.data.interval);
            that.data.interval = null;
            //判断区域内还是区域外   想要结束还是临停
            var contentText = "结束行程还是临时停车?"
            if (legalParking == 1) { //1 内 2 外
              contentText = "区域内停车，停车很规范，给你点个赞"
            } else if (legalParking == 2) {
              contentText = "停车区外停车，如结束行程将扣除五元调度费用，希望您规范停车"
            }
            wx.showModal({
              title: '锁已关闭',
              content: contentText,
              cancelText: '结束行程',
              cancelColor: '#FF0000',
              confirmText: '临时停车',
              confirmColor: '#008000',
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击临时停车')
                  that.tempOrEndTravel(tid, 1);
                } else if (res.cancel) {
                  console.log('用户点击结束行程')
                  that.tempOrEndTravel(tid, 2);
                }
              }
            })

          } else {
            that.setData({
              tripView_hidden: true,
            })
            clearInterval(that.data.interval);
            clearInterval(that.data.tripViewTimer);
            clearInterval(that.data.tripViewTimer_long);
            that.data.tripViewTimer_long = null;
            that.data.interval = null;
            that.data.tripViewTimer = null;
          }
        }
      },

    })
  },

  //结束行程 改变行程状态
  requestForEndTripStatus: function(tid) {
    var that = this;
    var header = {
      'content-type': 'application/json'
    }
    header.Authorization = app.getGlobalAuthorization();
    //结束行程 改变行程状态  endMark
    wx.request({
      url: app.globalData.httpURL + '/api/biz/endtrip/msg',
      method: "POST",
      header: header,
      data: {
        lng: that.data.longitude,
        lat: that.data.latitude,
        tid: tid,
        tripId: "",
        channel: "IOS",
        version: "1.0",
        deviceId: "123",
      },
      success: function(res) {
        clearInterval(that.data.interval);
        clearInterval(that.data.tripViewTimer);
        clearInterval(that.data.tripViewTimer_long);
        that.data.tripViewTimer_long = null;
        that.data.interval = null;
        that.data.tripViewTimer = null;
        console.log(res);
        //跳转评价页面 
        var obj = JSON.parse(res.data.endTripMsg);
        wx.navigateTo({
          url: '../trip_end_comment/trip_end_comment?tripId=' + obj.tripId + '&amount=' + obj.amount + '&balance=' + obj.balance + '&startTime=' + obj.startTime + '&endTime=' + obj.endTime + '&durationTime=' + obj.durationTime
        });
      },
    })

    ////告诉服务器行程结束
    wx.request({
      url: app.globalData.httpURL + '/api/biz/end/mark',
      method: "POST",
      header: header,
      data: {
        tid: tid,
        channel: "IOS",
        version: "1.0",
        deviceId: "123",
      },
      success: function(res) {
        console.log(res);
      },
    })
  },

  //刷新视图
  refreshTripView: function(duration, lockStatus) {
    var that = this;

    if (lockStatus == 5) {
      
      if (!that.data.tripViewTimer_long) {
        clearInterval(that.data.tripViewTimer);
        that.data.tripViewTimer = null;
        
        var time = parseInt(duration / 1000);
        that.data.tripViewTimer_long = setInterval(function() {
          time++;
          that.timeStampToFormat(time);
        }, 1000)
      }
    } else {
      
      if (!that.data.tripViewTimer) {
        clearInterval(that.data.tripViewTimer_long);
        that.data.tripViewTimer_long = null;

        var time = parseInt(duration / 1000);
        that.data.tripViewTimer = setInterval(function () {
          time++;
          that.timeStampToFormat(time);
        }, 1000)
      }
    }
    
  },

  //
  timeStampToFormat: function(time) {
    var that = this;
   
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
        tripTime: minute + ':' + seconds,
      })
    } else {
      that.setData({
        tripTime: hour + ':' + minute + ':' + seconds,
      })
    }
  },



  //临时停车  结束行程
  tempOrEndTravel: function(tid, action) {
    var that = this;
    var header = {
      'content-type': 'application/json'
    }
    header.Authorization = app.getGlobalAuthorization();
    wx.request({
      url: app.globalData.httpURL + '/api/superbiz/rent/choose',
      method: "POST",
      header: header,
      data: {
        tid: tid,
        action: action,
        channel: "IOS",
        version: "1.0",
        deviceId: "123",
      },
      success: function(res) {
        that.startIntervalTimer()
      },
    })
  },

  //继续用车
  tripView_continueHandle: function() {
    var that = this;

    wx.getStorage({
      key: 'tnoCode',
      success: function(res) {
        that.requestUnlock(res.data);

      },
    })

  }

})