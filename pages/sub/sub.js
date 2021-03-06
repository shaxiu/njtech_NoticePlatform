// pages/home/home.js
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    picker: [],
    sub_list:[],
    opt_toShow:"",
    //订阅信息是否提交
    is_update:true,
    _id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    wx.showLoading({
      title: '加载中',
    })
    //获取用订阅信息
    wx.cloud.callFunction({
      name: 'getSubList',
    })
    .then(res => {
      var result = res.result.data
      if(result!=""){
        that.setData({
          _id:result[0]._id,
          sub_list:result[0].subList
        })
      }
      console.log("sublist",that.data.sub_list)
      //获取学院部门列表
      wx.cloud.callFunction({
        name: 'getSourceList'
      })
      .then(res => {
        var result = res.result.data
        for(var i=0;i<that.data.sub_list.length;i++){
          // console.log(that.data.sub_list[i]._id)
          result=result.filter(item=>item._id!=that.data.sub_list[i]._id)
          // console.log(result)
        }
        that.setData({
          picker:result
        })
        wx.hideLoading()
        // console.log(result)
      }).catch(res => {
        console.log("请求失败", res)
      })
    }).catch(res => {
      console.log("请求失败", res)
    })
  },

  PickerChange(e) {
    let that=this;
    if(that.data.picker==[]){
      return
    }
    var index=e.detail.value
    var sub_content=that.data.picker[index]
    var temp_subList=that.data.sub_list
    temp_subList.push(sub_content)
    that.data.picker.splice(index,1)
    that.setData({
      index: e.detail.value,
      sub_list:temp_subList,
      picker:that.data.picker,
      opt_toShow:sub_content,
      is_update:false
    })
  },
  onClose:function(e){
    var index=e.target.dataset.index
    // console.log(index)
    console.log(this.data.sub_list[index])
    var picker=this.data.picker
    var index_t=picker.findIndex(x => x._id ===this.data.sub_list[index]._id-1)
    // console.log(index_t)
    // picker.push(this.data.sub_list[index])
    picker.splice(index_t+1,0,this.data.sub_list[index])
    // console.log(picker)
    this.data.sub_list.splice(index,1)
    this.setData({
      picker:picker,
      sub_list:this.data.sub_list,
      is_update:false
    })
  },
  commit:function(){
    let that =this
    wx.requestSubscribeMessage({
      tmplIds: ['uewy-Hb_okdZ2rjaaQ0JdW5_6Ywbu73oUjepLBN5KDQ'],
      success (res) { 
        that.updateSubStatus(true)
      },
      fail(res){
        console.log(res)
        that.updateSubStatus(false)
      }
    })
    wx.showLoading({
      title: '订阅中',
    })
    /**
     * 调用云函数
     */
    console.log(that.data.sub_list)
    return wx.cloud.callFunction({
      name: 'setSubList',
      data: {
        _id:this.data._id,
        subList:that.data.sub_list
      }
    }).then(res=>{
      wx.hideLoading()
      that.setData({
        is_update:true,
        _id:111
      })
      wx.showToast({ // 显示Toast
        title: '订阅成功',
        icon: 'success',
        duration: 1500
      })
      app.globalData.is_update=true
      console.log(app.globalData.is_update)
    }).catch(res=>{
      console.log("请求失败",res)
    })
  },
  updateSubStatus:function(subStatus){
    console.log(subStatus)
    wx.cloud.callFunction({
      name: 'updateSubStatus',
      data: {
        isSub:subStatus
      }
    }).then(res=>{
      console.log(res)
    }).catch(res=>{
      console.log("更新失败",res)
    })
  },
  onHide:function(){
    let that=this;
    if(that.data.is_update==false){
      wx.showModal({
        title: '',
        content: '未保存订阅信息，是否保存',
        success(res) {
         if (res.confirm) {
           that.commit()
         }
        }
       })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})