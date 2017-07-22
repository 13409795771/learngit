// tm.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchTeamJoin();
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

  },
  fetchTeamJoin: function () {
    let that = this;
    app.getUserInfo(function (userInfo) {
      app.fetchRsp(1, 'FETCHMYTEAMJOIN', { player_id: userInfo.player_id }, function (rsp) {
        if (!rsp) {
          return;
        }
        that.data.teamjoinlist = rsp.team_join_list;
        that.setData(that.data);
      })
    })
  },
  rejectTeamJoin: function (e) {
    this.handleTeamJoin(e, true);
  },
  acceptTeamJoin: function (e) {
    this.handleTeamJoin(e, false);
  },
  handleTeamJoin: function (e, rejectOrAccept) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定' +  (rejectOrAccept?'拒绝':'批准')+'吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let teamJoin = e.target.dataset.item;
          let team_id = teamJoin.team_id;
          let player_id = teamJoin.player_id;
          app.getUserInfo(function (userInfo) {
            let captain_id = userInfo.player_id;
            app.fetchRsp(1, rejectOrAccept ? "REJECTTEAMJOIN" : "ACCEPTTEAMJOIN", {
              team_id: team_id, player_id: player_id, captain_id: captain_id
            }, function (rsp) {
              if (!rsp) {
                return;
              }
              let st = rsp.status;
              if (st == 1 || st == 2) {
                let tips = ['成功加入','已拒绝'];
                app.showToast('success', tips[st-1]);
              } 
              that.fetchTeamJoin();
              return;
            })
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})