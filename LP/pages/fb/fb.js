// fb.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: [
      { title: '程序BUG', value: "程序BUG" },
      { title: '功能建议', value: "功能建议" },
      { title: '内容建议', value: "内容建议" },
      { title: '广告问题', value: "广告问题" },
      { title: '网络问题', value: "网络问题" },
      { title: '其他问题', value: "其他问题" },
    ],
    selected: "程序BUG"
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
  bindInputContent: function (e) {
    var inputValue = e.detail.value;
    this.data.content = inputValue;
  },
  bindInputContact: function (e) {
    var inputValue = e.detail.value;
    this.data.contact = inputValue;
  },
  bindRedioType: function (e) {
    var inputValue = e.detail.value;
    this.data.fb_type = inputValue;
  },
  onSubmit: function (e) {
    if (!this.data.content) {
      app.showToast('loading', '请填写反馈')
    }
    let content = this.data.content;
    let contact = this.data.contact;
    let fb_type = this.data.fb_type;
    app.getUserInfo(function (userInfo) {
      app.fetchRsp(1, "FEEDBACK", { player_id: userInfo.player_id, content: content, fb_type: fb_type, contact: contact }, function (rsp) {
        if (!rsp) {
          return;
        }
        app.showToast('success', '反馈成功');
        app.goBack(1);
      })
    });
  }
})