//index.js
//获取应用实例
var app = getApp();
Page({
  onShareAppMessage: app.shareApp,
  data: {
    tabs: ['我的比赛', '我的球队',],
    onTab:'我的比赛',
    indexmenu: [
      {
        'icon': 'https://pp2bb.cn/images/ic_filter_tilt_shift.png',
        'text': '创建球队',
        'url': 'create'
      },
      {
        'icon': 'https://pp2bb.cn/images/ic_person_add.png',
        'text': '加入球队',
        'url': 'join'
      },
      {
        'icon': 'https://pp2bb.cn/images/ic_open_with.png',
        'text': '发起比赛',
        'url': 'launch'
      },
      {
        'icon': 'https://pp2bb.cn/images/ic_games.png',
        'text': '参与比赛',
        'url': 'match'
      }
    ]
  },
  onLoad:function(){
    app.showToast("loading","正在加载");
  },
  onShow:function(){
    let that = this;
    setTimeout(function() {
      that.refresh();
    },300);
  },
  onClick:function(e) {
    let tab = e.target.id;
    this.data.onTab = tab;
    this.setData(this.data);
    this.refresh();
  },
  onJoin:function(e) {
    wx.navigateTo({
      url: '/pages/join/join',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onLaunch:function(e) {
    app.onLaunchMatch(false);
  },
  fetchMyTeam: function () {
    let that = this;
    app.getUserInfo(function (userInfo) {
      app.fetchRsp(1, 'TEAMLISTWITHME', { player_id: userInfo.player_id }, function (rsp) {
        if (!rsp || !rsp.teamlist) {
          return;
        }
        that.data.teamRsp = { teamlist: rsp.teamlist, hiddenJoin: true};
        that.setData(that.data);
      });
    });
  },
  fetchMyMatch: function() {
    let that = this;
    app.getUserInfo(function (userInfo) {
      app.fetchRsp(1, 'MATCHLISTWITHME', { player_id: userInfo.player_id }, function (rsp) {
        if (!rsp || !rsp.matchlist) {
          return;
        }
        that.data.matchRsp = { matchlist: rsp.matchlist, hiddenMatch: true };
        that.setData(that.data);
      });
    });
  },
  refresh:function() {
    if (this.data.onTab == "我的比赛") {
      this.fetchMyMatch();
    } else {
      this.fetchMyTeam();
    }
  },
  onSearch:function() {
    wx.showModal({
      title: '提示',
      content: '内测版本暂不提供搜索服务',
      showCancel:false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })  }
})
