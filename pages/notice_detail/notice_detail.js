// pages/notice_detail/notice_detail.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var id = options.id
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.database().collection("noticeList")
      .doc(Number(id))
      .get({
        success(res) {
          res.data.newscontent=util.formatRichText(res.data.newscontent)
          that.setData({
            notice: res.data
          })
          wx.hideLoading()
        },
        fail(err) {
          console.log("请求失败", err)
        }
      })
  },
  copyLink:function(){
    let that=this;
    var owname=that.data.notice.owname
    var title=that.data.notice.wbtitle
    var url=that.data.notice.wbnewsurl
    var toCopy=owname+":"+title+"\n"+url
    wx.setClipboardData({
      data: toCopy,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
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

  }
})