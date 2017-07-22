// pages/my/my.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    featurelist: [{
      icon: 'https://pp2bb.cn/images/ic_team_manager.png',
      title: '球队管理',
      url: '../tm/tm'
    // }, {
    //     icon: 'https://pp2bb.cn/images/ic_touch_app.png',
    //   title: '比赛管理',
    //   url: '../mm/mm'
    }, {
        icon: 'https://pp2bb.cn/images/ic_history_match.png',
      title: '历史比赛',
      url: '../hm/hm'
    },{
      icon: 'https://pp2bb.cn/images/ic_feedback.png',
      title: '反馈问题',
      url: '../fb/fb'
    // }, {
    //   icon: 'https://pp2bb.cn/images/ic_touch_app.png',
    //   title: '联系客服',
    //   url: '../cs/cs'
    }, {
        icon: 'https://pp2bb.cn/images/ic_info.png',
      title: '关于球赞',
      url: '../abt/abt'
    }]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.data.userInfo = userInfo;
      that.setData(that.data);
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  editPlayerInfo: function () {

  }
})
