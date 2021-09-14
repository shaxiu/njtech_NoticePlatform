// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'jwc-5g8a5u9u20586200'
})
const db = cloud.database()
const _=db.command
// 云函数入口函数
//分页
exports.main = async (event, context) => {
  if(event.type==0){
    return await cloud.database().collection('noticeList').field({
      _id: true,
      wbtitle: true,
      wbdate: true,
      owname:true
    })
    .where({
      newscontent:_.neq("None"),
      owner:_.in(event.range)
    })
    .orderBy('wbdate_num','desc')
    .skip(event.len)
    .limit(event.num)
    .get()
  }else{
    return await cloud.database().collection('noticeList').field({
      _id: true,
      wbtitle: true,
      wbdate: true,
      owname:true
    })
    .where({
      wbtitle:db.RegExp({
        regexp:event.key_val,
        options:'i'
      }),
      newscontent:_.neq("None"),
      owner:_.in(event.range)
    })
    .orderBy('wbdate_num','desc')
    .skip(event.len)
    .limit(event.num)
    .get()
  }
}