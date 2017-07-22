//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    matchRsp:{}
  },
  onShow:function(){
    //生命周期函数--监听页面加载
    this.fetchMyMatch();
  },
  onLaunch:function() {
    app.onLaunchMatch(true);
  },
  fetchMyMatch: function () {
    let that = this;
    app.getUserInfo(function (userInfo) {
      app.fetchRsp(1, 'MATCHLIST', { player_id: userInfo.player_id }, function (rsp) {
        if (!rsp || !rsp.matchlist) {
          return;
        }
        that.data.matchRsp = {matchlist:rsp.matchlist,hiddenMatch:false};
        that.setData(that.data);
      });
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
