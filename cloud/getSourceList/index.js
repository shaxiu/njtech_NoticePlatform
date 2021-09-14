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
  return await cloud.database().collection("sourceList")
  .field({
    owner: true,
    owname: true
  })
  .get()
}