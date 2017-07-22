//app.js
App({
  isDebug: true,
  onLaunch: function (options) {
    console.info('onLaunch:' + JSON.stringify(options))
    this.getUserInfo('', options ? options.shareTicket:null);
    // //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  //获取用户信息，app启动时就获取，用的时候直接用
  getUserInfo: function (cb, st = null) {
    var that = this;
    if (this.globalData.isLogining) {
      return setTimeout(function () {
        that.getUserInfo(cb);
      }, 1000);
    }

    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      this.globalData.isLogining = true;
      wx.login({
        success: function (res) {
          let code = res.code;
          //发起网络请求
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              if (code) {
                // that.fetchRsp(1, 'FETCHOPENID', { code: code }, function (rsp) {
                //   that.globalData.userInfo.player_id = rsp.openid;
                //   that.globalData.userInfo.session_key = rsp.session_key;
                //   that.globalData.userInfo.expires_in = rsp.expires_in;

                //   that.fetchRsp(1, 'CREATEPLAYER', that.globalData.userInfo, function (rsp) {
                //     that.globalData.isLogining = false;
                //     if (st) {
                //       that.getShareInfo(function (rsp) {
                //         that.globalData.userInfo.openGId = rsp.openGId;
                //         typeof cb == "function" && cb(that.globalData.userInfo);
                //       },st)
                //       return;
                //     }
                //     typeof cb == "function" && cb(that.globalData.userInfo);
                  // });
                // });
              }
            },
            fail: function () {
              that.globalData.isLogining = false;
              wx.redirectTo({
                url: 'pages/index/index',
              })
            }
          })
        }
      })
    }
  },
  //全局变量
  globalData: {
    isLogining: false,
    userInfo: null,
  },
  //后台请求统一入口
  fetchRsp(msg_id, func, req, cb) {
    var that = this;
    if (that.globalData.isLogining && !that.globalData.userInfo) {
      return setTimeout(function () {
        if (that.globalData.isLogining && !that.globalData.userInfo) {
          return that.fetchRsp(msg_id, func, req, cb);
        }
        return that.doRequest(msg_id, func, req, cb);
      }, 1000);
    }
    return that.doRequest(msg_id, func, req, cb);

  },

  doRequest: function (msg_id, func, req, cb) {
    let that = this;
    wx.request({
      url: 'http://localhost:30001/server',
      data: {
        func: func,
        msg_id: msg_id,
        cuid: null,
        req: req
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.ret_code == '0' & res.data.err_code == '0') {
          return cb(res.data.rsp);
        }
        let msg = res.data.err_code != '0' ? res.data.err_msg : res.data.ret_msg;
        that.showToast('loading', msg);
        return cb(null);
      },
      fail: function (err) {
        that.showToast('loading', '即将为你服务');
        return cb(null);
      }
    });
  },

  //弹出消息
  showToast(type, title) {
    wx.showToast({
      title: title,
      icon: type ? type : '',
    });
  },
  //分享app
  shareApp: function () {
    return {
      title: '有球踢了!赞',
      path: '/pages/index/index',
      success: function (res) {
        app.showToast("success", "感谢你的分享")
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //分享比赛
  shareMatch: function (teamName, time, place, matchid, team_id) {
    return {
      title: teamName + '有场球，你来不来',
      path: '/pages/mdetail/mdetail?match_id=' + matchid,
      success: function (res) {
        return app.onShareSuccess(res, team_id);
      }
    }
  },
  //分享球队
  shareTeam: function (teamName, team_id) {
    return {
      title: teamName + '邀请你加入球队',
      path: '/pages/tdetail/tdetail?team_id=' + team_id,
      success: function (res) {
        return app.onShareSuccess(res, team_id);
      }
    }
  },
  //回退界面
  goBack(delta) {
    setTimeout(function () {
      wx.navigateBack({
        delta: delta
      });
    }, 1500);

  },
  //报名比赛
  onMatch: function (match_id, form_id) {
    app.getUserInfo(function (userInfo) {
      app.fetchRsp(1, 'JOINMACTH', { player_id: userInfo.player_id, player_name: userInfo.nickName, player_icon: userInfo.avatarUrl, match_id: match_id, openGId: userInfo.openGId, form_id: form_id}, function (rsp) {
        if (!rsp) {
          return;
        }
        app.showToast("success", "已加入比赛");
        setTimeout(function(){
          app.goBack(1);
        },2000)
      });
    });
  },
  //发起比赛
  onLaunchMatch: function (shouldPopCurrent) {
    let param = {
      url: '/pages/launch/launch',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    };
    shouldPopCurrent ? wx.redirectTo(param) : wx.navigateTo(param);
  },
  onJoin: function (team_id, team_name) {
    let player_id = app.globalData.userInfo.player_id;
    let player_name = app.globalData.userInfo.nickName;
    let player_icon = app.globalData.userInfo.avatarUrl;
    let req = {
      player_id: player_id,
      player_name: player_name,
      player_icon: player_icon,
      team_id: team_id,
      team_name: team_name,
      openGId: app.globalData.userInfo.openGId
    };
    app.fetchRsp(1, "JOINTEAM", req, (rsp) => {
      if (rsp == null) {
        return;
      }

      let statusTips = ["已提交待审核", "审核通过", "审核未通过", "已在球队中", "成功加入"];
      app.showToast("success", statusTips[rsp.status]);
      app.goBack(1);
    });
  },
  onCreate: function (shouldPopCurrent) {
    let param = {
      url: '/pages/create/create',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    };
    shouldPopCurrent ? wx.redirectTo(param) : wx.navigateTo(param);
  },
  onShareSuccess: function (res, team_id) {
    app.showToast("success", "分享成功")
    let sts = res.shareTickets;
    if (sts && sts.length > 0) {
      let st = sts[0];
      app.getShareInfo(function (rsp) {
        console.info('DECRYPT RESULT:' + rsp);
        if (!rsp || !rsp.openGId) {
          return;
        }
        let shareReq = { team_id: team_id, openGId: rsp.openGId }
        app.fetchRsp(1, 'SHARETEAMJOIN', shareReq, function (shrsp) {

        })
      }, st)
    }
  },
  getShareInfo(cb,st) {
    wx.getShareInfo({
      shareTicket: st,
      success: function (res) {
        if (res.encryptedData) {
          app.getUserInfo(function (userInfo) {
            let sk = userInfo.session_key;
            let req = { sessionKey: sk, encryptedData: res.encryptedData, iv: res.iv };
            app.fetchRsp(1, 'DECRYPT', req, function (rsp) {
              if (cb && typeof cb == "function") {
                cb(rsp);
              }
            })
          });
        }
      },
      fail:function(err) {

      }
    })
  }
})
var app = getApp();