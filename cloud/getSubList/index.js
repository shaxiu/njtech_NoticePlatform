// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'jwc-5g8a5u9u20586200'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  return await cloud.database().collection("subList")
  .field({
    _id: true,
    subList: true
  }).where({
    openId:event.userInfo.openId
  })
  .get()
}