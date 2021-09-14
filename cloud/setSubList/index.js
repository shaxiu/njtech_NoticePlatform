// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'jwc-5g8a5u9u20586200'
})
const db = cloud.database()
const _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.subList)
  if(event._id!=""){
    return await cloud.database().collection('subList').doc(event._id).update({
      data:{
        subList:event.subList
      }
    })
  }else{
    console.log("sublist",event.subList)
    return await cloud.database().collection('subList').add({
      data:{
        openId:event.userInfo.openId,
        subList:event.subList
      }
    })
  }
 
}