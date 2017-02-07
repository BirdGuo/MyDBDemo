function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 使用util中方法需要在此添加暴露的方法
 */
module.exports = {
  formatTime: formatTime,
  convertToStarsArray: convertToStarsArray,
  formatNumber: formatNumber,
  http:http,
  convertToCastString:convertToCastString,
  convertToCastInfos:convertToCastInfos

}

/**
 * 统计星星数量
 */
function convertToStarsArray(stars) {

  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {

    if (i <= num) {
      array.push(1);
    } else {
      array.push(0)
    }
  }
  return array;
}

function convertToCastString(casts){
  var castsjoin = "";
  for(var idx in casts){
    castsjoin = castsjoin + casts[idx].name+" / ";
  }
  console.log(castsjoin)
  return castsjoin.substring(0,castsjoin.length-2);
}

function convertToCastInfos(casts){
  var castsArray=[]
  for(var idx in casts){
    var cast = {
      img:casts[idx].avatars ? casts[idx].avatars.large:"",
      name:casts[idx].name
    }
    castsArray.push(cast)
  }
  return castsArray;
}

function http(url, callBack) {
  wx.request({
    url: url,
    header: { "Content-Type": "json" },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      // success
      console.log(res);
      callBack(res.data)
    },
    fail: function (error) {
      // fail
      console.log(error)
    },
    complete: function () {
      // complete
    }
  })
}

