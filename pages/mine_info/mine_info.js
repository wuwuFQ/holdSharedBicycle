// pages/mine_info/mine_info.js
var utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    head_image: "/images/bike.png",
    nickName: "",
    phone: "",
    name: "",
  auth: "未认证",//0未认证 1待审核 2已认证 3认证失败

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
    utils.getUserInfo();

    var that = this;
    wx.getStorage({
      key: 'basicInfo',
      success: function (res) {
        that.setData({
          nickName: res.data.nickName,
        });
        if (res.data.avatarUrl) {
          that.setData({
            head_image: res.data.avatarUrl,
          });
        }
      },
    });

    wx.getStorage({
      key: 'realInfo',
      success: function (res) {
        switch (res.data.authenticationStatus) {
          case 0:
            that.auth = "未认证"
            break;
          case 1:
            that.auth = "待审核"
            break;
          case 2:
            that.auth = "已认证"
            that.setData({
              name: res.data.realName,
            })
            break;
          case 3:
            that.auth = "认证失败"
            break;

        }
        that.setData({
          auth: that.auth,
        })

      },
    });

    wx.getStorage({
      key: 'mobile',
      success: function (res) {
        that.setData({
          phone: res.data
        });
      },
    })
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

  headerImgViewHandle: function () {
    // var that = this;
//     wx.chooseImage({
//       count: 1,
//       sourceType: ["album", "camera"],
//       success: function (res) {
// console.log(res)
//         const tempFilePaths = res.tempFilePaths[0]
        
//         wx.showToast({
//           icon: 'none',
//           title: '暂未开放',
//         })
//       },
//     })

    // var header = {
    //   'content-type': 'application/json'
    // }
    // header.Authorization = getApp().getGlobalAuthorization();
    // wx.request({
    //   url: getApp().globalData.httpURL + '/api/biz/aliyun/oss/sts',
    //   method: "POST",
    //   header: header,
    //   data: {
    //     tokenTypeSpid: '2'
    //   },
    //   success: function (res) {
    //     console.log(res);
    //     var stsCredentialsModel = res.data.stsCredentialsModel;
    //     var accessKeyId = stsCredentialsModel.accessKeyId;
    //     var accessKeySecret = stsCredentialsModel.accessKeySecret;
    //     var expiration = stsCredentialsModel.expiration;
    //     var roleSessionName = stsCredentialsModel.roleSessionName;
    //     var securityToken = stsCredentialsModel.securityToken;

    //   }

    // })
  },

  nickNameHandle: function () {
wx.navigateTo({
  url: '../mine_info_modifyNickName/mine_info_modifyNickName',
})
  },


  //
  authClickHandle: function() {
    var that = this;
    
    if (that.auth == "已认证") {
      wx.show
      wx.showToast({
        title: '您已完成实名认证',
        icon: 'none'
      })
    } else if (that.auth == "待审核") {
      wx.showToast({
        title: '资料已提交，等待审核',
        icon: 'none'
      })
    } else { //未认证
wx.navigateTo({
  url: '../mine_info_auth/mine_info_auth',
})
    }
  }
})