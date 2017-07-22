// tdetail.js
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
    if (wx.showShareMenu) {
      console.info('wx.showShareMenu');
      wx.showShareMenu({
        withShareTicket: true
      })
    }
    let team_id = options.team_id;
    if (team_id) {
      return this.fetchTeamDetail(team_id);
    }
    app.showToast('loading', '球队参数不对');
    return wx.redirectTo({
      url: '/pages/index/index'
    });
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
    let teamName = this.data.rsp.name;
    let team_id = this.data.rsp.id;
    return app.shareTeam(teamName, team_id);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  fetchTeamDetail:function(team_id) {
    let that = this;
    app.fetchRsp(1, "FETCHTEAMDETAIL", { team_id: team_id }, function (rsp) {
      if (!rsp) {
        return app.showToast("loading", "比赛加载失败");
      }
      let items = [{
        tag: "球队",
        type: "text",
        value: rsp.name
      }, {
        tag: "主场",
        type: "text",
        value: rsp.activity_address.place
      }, {
        tag: "创建时间",
        type: "text",
        value: (rsp.create_time)
      }, {
        tag: "预定场地",
        type: "text",
        value: (rsp.ground_type == '0' ? "半场" : "全场")
      }, {
        tag: "招募人数",
        type: "text",
        value: rsp.all_plan
      }, {
        tag: "当前状态",
        type: "text",
        value: TEAM_STATUS[rsp.status]
      }];
      that.data.items = items;
      that.data.rsp = rsp
      app.getUserInfo(function (userInfo) {
        let pl = that.data.rsp.playerlist;
        for (let i = 0; i < pl.length; i++) {
          let id = pl[i].player_id;
          if (id == userInfo.player_id) {
            that.data.alreadyin = true;
          }
        }
        return that.setData(that.data);
      });
    });
    app.showToast("loading", "正在加载");

  },
  onJoin: function (e) {
    let team_id = this.data.rsp.id;
    let team_name = this.data.rsp.name;
    app.onJoin(team_id, team_name);
  }
})