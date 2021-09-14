// app.js
App({
  globalData:{
    is_update:true
  },
  onLaunch() {
    wx.cloud.init({
      env:'jwc-5g8a5u9u20586200'
    })
  },
})
