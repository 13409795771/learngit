//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    teamRsp: { teamlist: [], hiddenJoin:true},
    index:0,
    time:new Date().toLocaleDateString(),
    nomore:false
  },
  onLoad: function () {
   this.fetchData();
  },
  onShow: function () {

  },
  fetchData:function(){
    if(this.data.index ==0) {
      wx.stopPullDownRefresh();
      app.showToast('loading','正在加载');
    }
    app.showToast()
    let that = this;
    app.getUserInfo(function(userInfo){
      let player_id = userInfo.player_id;
      app.fetchRsp(1, 'TEAMLIST', { player_id: player_id, index: that.data.index, time: that.data.time }, (rsp) => {

        if (!rsp || !rsp.teamlist) {
          return;
        }

        var teamlist = rsp.teamlist;
        if (that.data.index == 0) {
          that.data.teamRsp = { teamlist: teamlist, hiddenJoin: false };
        } else if (teamlist.length > 0){
          that.data.teamRsp.teamlist = that.data.teamRsp.teamlist.concat(teamlist)
        }
        if(teamlist.length<5) {
          that.data.nomore = true;
        }
        that.setData(that.data);
      });
    });
  },
  onCreate:function(e) {
    app.onCreate(true);
  },
  onPullDownRefresh:function() {
    this.data.index = 0;
    this.data.nomore = false;
    this.data.time = new Date().toLocaleDateString();
    this.fetchData();
  },
  onReachBottom:function() {
    if (!this.data.nomore) {
      this.data.index++;
      this.fetchData();
    }
  }
})
