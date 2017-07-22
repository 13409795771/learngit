// mdetail.js
require('../../utils/constants.js')
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    match_detail:null,
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

    let match_id = options.match_id;
    if(match_id) {
      return this.fetchMatchDetail(match_id);
    }
    app.showToast('loading', '比赛参数不对');
    return wx.redirectTo({
      url: '/pages/index/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
    let teamName = this.data.rsp.team.name;
    let time = this.data.rsp.start_date + this.data.rsp.start_time;
    let place = this.data.rsp.activity_address.place;
    let id = this.data.rsp.id;
    let team_id = this.data.rsp.team.id;

    return app.shareMatch(teamName, time, place, id, team_id);
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
  /**
   * 获取比赛详情数据
   */
  fetchMatchDetail:function(match_id) {
    let that = this;
    app.fetchRsp(1,"FETCHMATCHDETAIL",{match_id:match_id},    function(rsp) {
       if(!rsp) {
         return app.showToast("loading", "比赛加载失败");
       }
       let items = [{
         tag: "球队",
         type: "text",
         value:rsp.team.name
       }, {
           tag: "活动地点",
           type: "text",
           value: rsp.activity_address.place
         }, {
           tag: "截止时间",
           type: "text",
           value:(rsp.join_date + ' ' + rsp.join_time)
         }, {
           tag: "比赛时间",
           type: "text",
           value: (rsp.start_date + ' ' + rsp.start_time)
         }, {
           tag: "订场类型",
           type: "text",
           value:(rsp.ground_type=='0' ? "半场":"全场")
         }, {
           tag: "比赛人数",
           type: "text",
           value: rsp.all_plan
         }, {
           tag: "后续活动",
           type: "text",
           value: rsp.after_game
         }, {
           tag: "当前状态",
           type: "text",
           value: MATCH_STATUS[rsp.status]
         }];
       that.data.items = items;
       that.data.rsp = rsp
       app.getUserInfo(function(userInfo){
         let pl = that.data.rsp.playerlist;
         for (let i = 0; i < pl.length; i++) {
           let id = pl[i].player_id;
           if(id == userInfo.player_id) {
              that.data.alreadyin = true;
           }
         }
         return that.setData(that.data);
       });
    });
    app.showToast("loading", "正在加载");
  },
  onMatch:function(e){
    let id = this.data.rsp.id;
    let formId = e.detail.formId;
    app.onMatch(id, formId);
  }

})