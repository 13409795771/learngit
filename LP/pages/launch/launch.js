var app = getApp();
var util = require('../../utils/util.js')

Page({
  data: {
    items: [{
      tag: "选择球队",
      hint: "选择组织比赛的球队)",
      type: "picker",
      array: [],
      objectarray: [],
      index: 0,
      inputEvent: "bindPickerChange"
    }, {
      tag: "活动地点",
      hint: "在哪踢(必填)",
      type: "text",
      inputEvent: "bindInputAddress"
    }, {
      tag: "截止时间",
      hint: "报名最晚时间",
      type: "date_time",
      date: util.getDate(),
      maxDate: util.getDate(7),
      time: "00:00",
      inputDateEvent: "bindInputJoinDate",
      inputTimeEvent: "bindInputJoinTime"
    }, {
      tag: "比赛时间",
      hint: "比赛开始时间",
      type: "date_time",
      date: util.getDate(),
      maxDate: util.getDate(7),
      time: "19:00",
      inputDateEvent: "bindInputStartDate",
      inputTimeEvent: "bindInputStartTime"
    }, {
      tag: "订场类型",
      hint: "半场还是全场",
      type: "redio",
      redioDatas: [{
        name: "半场",
        value: '0'
      }, {
        name: "全场",
        value: '1'
      }],
      inputEvent: "bindInputGroundType"
    }, {
      tag: "比赛人数",
      hint: "最低邀请人数",
      type: "number",
      inputEvent: "bindInputAllAsked"
    }, {
      tag: "后续活动",
      hint: "吃饭还是唱k",
      type: "text",
      inputEvent: "bindInputAfterGame"
    },],
    req: {start_time:'00:00',start_date:'2017-05-13',join_time:'00:00',join_date:'2017-05-13'},
    ground_type:'0'
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  bindInputAddress: function (e) {
    var inputValue = e.detail.value;
    this.data.req.activity_address = { place: inputValue };
    this.setData(this.data);
  },
  bindInputJoinDate: function (e) {
    var inputValue = e.detail.value;
    this.data.req.join_date = inputValue;
    this.data.items[2].date = inputValue;
    this.setData(this.data);
  },
  bindInputJoinTime: function (e) {
    var inputValue = e.detail.value;
    this.data.req.join_time = inputValue;
    this.data.items[2].time = inputValue;
    this.setData(this.data);
  },
  bindInputStartDate: function (e) {
    var inputValue = e.detail.value;
    this.data.req.start_date = inputValue;
    this.data.items[3].date = inputValue;
    this.setData(this.data);
  },
  bindInputStartTime: function (e) {
    var inputValue = e.detail.value;
    this.data.req.start_time = inputValue;
    this.data.items[3].time = inputValue;
    this.setData(this.data);
  },
  bindInputGroundType: function (e) {
    var inputValue = e.detail.value;
    this.data.req.ground_type = inputValue;
    this.data.ground_type = inputValue;
    this.setData(this.data);
  },
  bindInputAllAsked: function (e) {
    var inputValue = e.detail.value;
    this.data.req.all_plan = inputValue;
    this.setData(this.data);

  },
  bindInputAfterGame: function (e) {
    var inputValue = e.detail.value;
    this.data.req.after_game = inputValue;
    this.setData(this.data);
  },
  bindPickerChange: function (e) {
    var inputValue = parseInt(e.detail.value);
    let team = this.data.items[0].objectarray[inputValue];
    this.data.req.team = { id: team.id,name:team.name}
    this.data.items[0].index = inputValue;
    this.setData(this.data);
  },
  onJoin: function (e) {
    wx.redirectTo({
      url: '/pages/join/join',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.fetchMyTeam();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  fetchMyTeam: function () {
    let that = this;
    app.getUserInfo(function (userInfo) {
      app.fetchRsp(1, 'TEAMLISTWITHME', { player_id: userInfo.player_id }, function (rsp) {
        if (!rsp || !rsp.teamlist) {
          return;
        }
        let teamList = rsp.teamlist;
        let oa = [];
        let nameArray = [];
        for (let i = 0; i < teamList.length; i++) {
          nameArray.push(teamList[i].name);
          oa.push({ id: teamList[i].id, name: teamList[i].name})
        }
        that.data.req.team = {
          id: teamList[0].id, name: teamList[0].name};
        that.data.items[0].array = nameArray;
        that.data.items[0].objectarray = teamList;
        that.setData(that.data);
      });
    });
  },
  onLaunch: function (e) {
    let req = this.data.req;
    if (!req.activity_address) {
      return app.showToast('loading', '请输入球队活动地址');
    }

    if (!req.all_plan) {
      return app.showToast('loading', '请输入比赛最低人数');
    }

    if((req.join_date + req.join_time) > (req.start_date+req.start_time) ){
      return app.showToast('loading', '输入截止时间晚于比赛时间');
    }

    let that = this;
    let form_id = e.detail.formId;
    app.getUserInfo(function (userInfo) {
      req.create_id = userInfo.player_id;
      let playerlist = [];
      playerlist.push({ player_id: userInfo.player_id, player_name: userInfo.nickName, player_icon: userInfo.avatarUrl, form_id: form_id });
      req.playerlist = playerlist;
      app.fetchRsp(1, 'CREATEMATCH', req, function (rsp) {
        if (!rsp) {
          return;
        }
        wx.redirectTo({
          url: '/pages/mdetail/mdetail?match_id=' + rsp.id
        })

      });
    });
  }
})