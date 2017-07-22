// pages/create/create.js
var app = getApp();
Page({
  data: {
    items: [{
      tag: "队名",
      hint: "起个帅气的队名吧(必填)",
      type: "text",
      name:'name',
      inputEvent: "bindInputTeamName"
    }, {
      tag: "联系方式",
      hint: "留下队长的手机号吧",
      type: "number",
      name: 'captain_phone',
      inputEvent: "bindInputPhone"
    }, {
      tag: "主场地点",
      hint: "队员们方便的球场在哪",
      type: "text",
      name: 'activity_address',
      inputEvent: "bindInputAddress"
    }, {
      tag: "订场类型",
      hint: "半场还是全场",
      type: "redio",
      name: 'ground_type',      
      redioData:[{
        name:"半场",
        value:'0'
      },{
        name: "全场",
        value: '1'
      }],
      inputEvent: "bindInputGroundType"
    },{
      tag: "球队人数",
      hint: "球队总人数上限",
      type: "number",
      name: 'all_plan',      
      inputEvent: "bindInputAll"
    }, {
      tag: "球队宣言",
      hint: "喊个响亮的口号吧",
      type: "text",
      name: 'slogan',      
      inputEvent: "bindInputSlogan",
    },],
    teamName: null,
    slogan: null,
    activity_address: null,
    all: null,
    msg_id: 1,
    ground_type:0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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
  bindInputTeamName: function (e) {
    var inputValue = e.detail.value;
    this.data.teamName = inputValue;
    this.setData(this.data);
  },
  bindInputSlogan: function (e) {
    var inputValue = e.detail.value;
    this.data.slogan = inputValue;
    this.setData(this.data);
  },
  bindInputAddress: function (e) {
    var inputValue = e.detail.value;
    this.data.activity_address = inputValue;
    this.setData(this.data);
  },
  bindInputAll: function (e) {
    var inputValue = e.detail.value;
    this.data.all = inputValue;
    this.setData(this.data);
  },
  bindInputPhone: function (e) {
    var inputValue = e.detail.value;
    this.data.phone = inputValue;
    this.setData(this.data);
  },
  bindInputGroundType:function(e) {
    var inputValue = e.detail.value;
    this.data.ground_type = inputValue;
    this.setData(this.data);
  },
  onCreate: function (e) {
    console.info('FORMID:'+e.detail.formId);
    if (!this.data.teamName) {
      return app.showToast('loading', '请输入球队名称');
    }

    if (!this.data.phone) {
      return app.showToast('loading', '请输入队长手机号');
    }

    if (!this.data.slogan) {
      return app.showToast('loading', '请输入球队宣言');
    }

    if (!this.data.activity_address) {
      return app.showToast('loading', '请输入球队活动地址');
    }

    if (!this.data.all) {
      return app.showToast('loading', '请输入球队人数限制');
    }

    if (this.data.all < 5 || this.data.all >30) {
      return app.showToast('loading', '输入的球队人数不正确');
    }

    let req = {};
    req.name = this.data.teamName;
    req.captain_id = app.globalData.userInfo.player_id;
    req.captain_name = app.globalData.userInfo.nickName;
    req.captain_icon = app.globalData.userInfo.avatarUrl;
    req.captain_phone = this.data.phone;
    req.create_time = new Date().toLocaleDateString();
    req.all_plan = this.data.all;
    req.already = 1;
    req.playerlist = [{ player_name: req.captain_name, player_id: req.captain_id, player_icon: req.captain_icon }];
    req.ground_type = this.data.ground_type;
    req.slogan = this.data.slogan;
    req.activity_address = { place: this.data.activity_address };
    req.from_id = e.detail.formId;

    app.fetchRsp(this.data.msg_id++, "ADDTEAM", req, (rsp) => {
      if (!rsp) {
        return;//app.showToast("loading", "创建失败");  
      }
      app.showToast("success", "创建成功");
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        });
      }, 2000);
    });
  }
})