// abt.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
      title: "基本信息",
      content: "球赞是一款针对广大业余球员，业余球队的约球软件，以微信小程序的方式对球队进行系统的信息化管理，让业余球队约球更加方便快速"
    },
    {
      title: "版权信息",
      content: "球赞(微信小程序)版权归其个人开发者所有@2017"
    }, {
      title: "版本信息",
      content: "0.0.1 内测版"
    }, {
      title: "联系方式",
      content: "antoniochen0205@qq.com"
    }]
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
    wx.stopPullDownRefresh()
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

  }
})