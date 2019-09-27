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

    price: '0.01',

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

  selectPriceHandle: function (e) {
    var that = this;
    var tag = parseInt(e.currentTarget.dataset.tag);
    switch (tag) {
    case 100:
that.price = '0.01';
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
    default: break;
    }
  },

  rechargeHandle: function () {
    
  }

})