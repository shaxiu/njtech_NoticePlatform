// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    notice: [],
    hasMoreNotice: true,
    isLoading: false,
    opt_show: "我的订阅",
    // 所有源
    source_all: [],
    source_index: [],
    // 订阅源
    sub_index: [],
    sub_all: [],
    objectMultiArray: [
      [{
        id: 0,
        owname: '我的订阅'
      }, {
        id: 1,
        owname: '全部'
      }]
    ],
    multiIndex: [0, 0],
    ow: 0,
    type: 0,
    key_val: ''
  },
  onLoad() {
    let that = this;
    //我的订阅-全部 owner号
    that.getSub_notice_List()
    wx.cloud.callFunction({
        name: 'getSourceList'
      })
      .then(res => {
        var temp_a = {
          _id: -1,
          owname: "全部",
          owner: -1
        }
        // console.log(res.result.data)
        //全部-全部 owner号
        var source_index = []
        var result = res.result.data
        for (var i = 0; i < result.length; i++) {
          source_index.push(result[i].owner)
        }
        //向初始化的多列选择器中加入默认项-我的订阅-全部
        var objectMultiArray = that.data.objectMultiArray
        var temp = JSON.stringify(that.data.sub_all)
        objectMultiArray[1] = JSON.parse(temp)
        objectMultiArray[1].unshift(temp_a)
        that.setData({
          source_index: source_index,
          source_all: result,
          objectMultiArray: objectMultiArray
        })
        wx.hideLoading()
      }).catch(res => {
        console.log("请求失败", res)
      })
  },
  onShow:function(){
    if(app.globalData.is_update==true&&this.data.notice!=''){
      this.getSub_notice_List()
    }
  },
  /**
   * 获取通知列表数据
   * ------------------
   * 参数 ow 为 owner号
   * 如果选择 全部-全部则 owner号为-1
   * 如果选择 我的订阅-全部则 owner号为0
   * 否则owner号即选项owner号
   * 默认显示我的订阅 0
   * -------------------------
   * 参数 type 为查询类型
   * type=0 即 普通查询
   * type=1 即 模糊搜索查询
   */
  getNoticeList: function (ow = 0, type = 0, key_val = '') {
    let that = this
    let num = 12
    let page = Math.ceil(that.data.notice.length / num)
    var source_range = []
    // console.log(that.data.source_index)
    if (ow == -1) {
      source_range = that.data.source_index
    } else if (ow == 0) {
      source_range = that.data.sub_index
    } else {
      source_range.push(ow)
    }
    that.setData({
      isLoading: true,
      ow: ow,
      type: type,
      key_val: key_val
    })
    /**
     * 调用云函数
     */
    return wx.cloud.callFunction({
      name: 'getNoticeList',
      data: {
        type,
        range: source_range,
        len: num * page,
        num: num,
        key_val: key_val
      }
    }).then(res => {
      console.log(res)
      that.setData({
        notice: that.data.notice.concat(res.result.data)
      })
      if (res.result.data.length < num) {
        that.setData({
          hasMoreNotice: false
        })
      }
      that.setData({
        isLoading: false
      })
      wx.hideLoading()
    }).catch(res => {
      console.log("请求失败", res)
    })
  },
  getSub_notice_List: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
        name: 'getSubList',
      })
      .then(res => {
        var result = res.result.data
        if (result != "") {
          that.setData({
            sub_all: result[0].subList
          })
        }
        var sub_index = []
        var sub_all = that.data.sub_all
        for (var i = 0; i < sub_all.length; i++) {
          sub_index.push(sub_all[i].owner)
        }
        that.setData({
          sub_index: sub_index,
          notice:[],
          multiIndex: [0, 0],
          opt_show: "我的订阅"
        })
        that.getNoticeList()
        app.globalData.is_update=false
        that.MultiColumnChange({detail: {column: 0, value: 0}})
        that.MultiColumnChange({detail: {column: 1, value: 0}})
      }).catch(res => {
        console.log("请求失败", res)
      })
  },
  /**
   * 显示通知详情页
   */
  showNotice: function (e) {
    let flag = e.currentTarget.dataset.flag;
    // console.log(flag)
    wx.navigateTo({
      url: '/pages/notice_detail/notice_detail?id=' + flag,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 如果无数据了就不要再发请求了
    if (!this.data.hasMoreNotice) return;
    // 节流
    if (!this.data.isLoading) {
      this.getNoticeList(this.data.ow)
    }
  },
  /**
   * 多列选择器
   */
  MultiChange(e) {
    var opt_1 = this.data.objectMultiArray[0][e.detail.value[0]].owname
    var opt_2 = this.data.objectMultiArray[1][e.detail.value[1]].owname
    var opt_show = ""
    this.setData({
      notice: []
    })
    if (opt_1 == "全部" && opt_2 == "全部") {
      opt_show = opt_1
      this.getNoticeList(-1)
    } else if (opt_1 == "我的订阅" && opt_2 == "全部") {
      opt_show = opt_1
      this.getNoticeList(0)
    } else {
      if (opt_2.indexOf("南京工业大学") != -1) {
        opt_2 = opt_2.slice(6)
      }
      opt_show = opt_2
      this.getNoticeList(this.data.objectMultiArray[1][e.detail.value[1]].owner)
    }
    this.setData({
      multiIndex: e.detail.value,
      opt_show: opt_show
    })
  },
  MultiColumnChange(e) {
    var temp_a = {
      _id: -1,
      owname: "全部",
      owner: -1
    }
    let data = {
      objectMultiArray: this.data.objectMultiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            var temp = JSON.stringify(this.data.sub_all)
            temp = JSON.parse(temp)
            temp.unshift(temp_a)
            data.objectMultiArray[1] = temp
            break;
          case 1:
            var temp = JSON.stringify(this.data.source_all)
            temp = JSON.parse(temp)
            temp.unshift(temp_a)
            data.objectMultiArray[1] = temp
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  /**
   * 搜索框
   */
  search: function (e) {
    let search_content = e.detail.value
    if (search_content == null || search_content == '') {
      return
    }
    this.setData({
      notice: []
    })
    this.getNoticeList(this.data.ow, 1, search_content)
  },
  /**
   * 取消搜索内容
   */
  hideInput: function () {
    this.setData({
      key_val: ''
    })
  }
})