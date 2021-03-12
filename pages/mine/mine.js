// pages/mine/mine.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_src: "/images/bike.png",
    nickName: "昵称",
    auth_icon: "/images/idNumber.png",
    credit: '',
    // mine_group_title: ["钱包", "行程", "消息", "用户指南", "关于我们", "设置"],
    // mine_group_imgs: ["/images/userwallet.png", "/images/usertrip.png", "/images/usernews.png", "/images/userGuide.png", "/images/useraboutUs.png", "/images/userSetUp.png"],

    // mine_group_title: ["钱包", "行程", "消息",  "设置"],
    // mine_group_imgs: ["/images/userwallet.png", "/images/usertrip.png", "/images/usernews.png", "/images/userSetUp.png"],

    mine_group_title: ["钱包", "优惠券", "设置"],
    mine_group_imgs: ["/images/userwallet.png", "/images/userCoupons.png", "/images/userSetUp.png"],



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
    var that = this;
    //是否登录
    var status = getApp().getUserLoginStatus();
    if (status) {
      that.getUserInfo();

    } else {
      // wx.reLaunch({
      //   url: '../login/login',
      // })
    }

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
  //获取用户信息
  getUserInfo: function() {
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
      success: function(res) {
        console.log(res);
        var account = res.data.account;
        var basicInfo = res.data.basicInfo;
        var realInfo = res.data.realInfo;

        if (basicInfo.avatarUrl) {
          that.setData({
            header_src: basicInfo.avatarUrl,
          });
        }
        that.setData({
          nickName: basicInfo.nickName,
          credit: account.point,
        });

        wx.setStorage({
          key: 'account',
          data: account,
        });

        wx.setStorage({
          key: 'basicInfo',
          data: basicInfo,
          success: function(res) {
          
            
          },
        });

        wx.setStorage({
          key: 'realInfo',
          data: realInfo,
          success: function(res) {
            if (realInfo.authenticationStatus == 2) {
              //认证审核 通过 ，其他的则没有认证
              that.setData({
                auth_icon: "/images/idNumber_already.png"
              });
            } else {
              that.setData({
                auth_icon: "/images/idNumber.png"
              });
            }
          },
        });
      }
    })
  },


  didSelectCellHandle: function(e) {
    if (getApp().getUserLoginStatus() == false) {
      wx.showModal({
        title: '登录提示',
        content: '需要登录后才能查看信息',
        confirmText: '去登录',
        cancelText: '暂不登录',
        success(res) {
          if (res.confirm) {

            wx.reLaunch({
              url: '../login/login',
            })
          } else if (res.cancel) {

          }
        }
      })
      return;
    }
    console.log(e);
    var tag = e.currentTarget.dataset.tag;
    switch (tag) {
      case 0:
      wx.navigateTo({
        url: '../wallet/wallet',
      })
      break;
      case 1:
        wx.navigateTo({
          url: '../couponList/couponList',
        })
        // wx.navigateTo({
        //   url: '../tripList/tripList',
        // })
        break;
      case 2:
        wx.navigateTo({
          url: '../setting/setting',
        })
        // wx.navigateTo({
        //   url: '../messageList/messageList',
        // })
        break;
      case 3:
        // wx.navigateTo({
        //   url: '../setting/setting',
        // })
        break;
      case 4:
        break;
      case 5:
      
        break;
        default:
        break;
    }
  },

  header_imageViewClick: function () {
    if (getApp().getUserLoginStatus() == false) {
      wx.showModal({
        title: '登录提示',
        content: '需要登录后才能查看信息',
        confirmText: '去登录',
        cancelText: '暂不登录',
        success(res) {
          if (res.confirm) {

            wx.reLaunch({
              url: '../login/login',
            })
          } else if (res.cancel) {

          }
        }
      })
      return;
    }
wx.navigateTo({
  url: '../mine_info/mine_info',
})
  },

})