// 格式化富文本
function formatRichText(html) {
  let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
    match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
    match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
    match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
    return match;
  });
  newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
    match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
    return match;
  });
  newContent = newContent.replace(/width="[^"]+"/gi, function (match, capture) {
    match = match.replace(/width="[^"]+"/gi, 'width="100%"');
    return match;
  });
  // 对text-indent大于100的span标签进行格式化（改为右对齐）
  newContent = newContent.replace(/<p[^>]*>/gi, function (match) {
    match = match.replace(/style="[^=>]*"/g, function (match) {
      match = match.replace(/text-indent:[^=>]*;/g, function (match) {
        if (Number(match.substring(12, match.length - 3)) > 100) {
          return "text-align:right;"
        } else {
          return match
        }
      })
      return match
    })
    return match
  })
  // 格式化span标签（允许span换行）
  newContent = newContent.replace(/<span[^>]*>/gi, function (match) {
    match = match.replace(/style="[^=>]*"/g, function (match) {
      return match.substring(0, match.length - 1) + ";overflow-wrap: break-word;\""
    })
    return match
  })
  //格式化img（将img链接补全）
  if (newContent.indexOf('img') != -1) { //判断img是否存在
    // console.log(newContent)
    newContent = newContent.replace(/<img [^>]*orisrc=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
      return '<img src=\"' + "http://jwc.njtech.edu.cn" + capture + '\" style="max-width:100%;height:auto;display:block;margin:10px 0;"/>';
    });
  }
  return newContent;
}
module.exports = {
  formatRichText
}