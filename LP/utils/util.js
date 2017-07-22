function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getDate(dayFromNow) {
  let date = new Date();
  if(dayFromNow != null) {
    date.setTime(date.getTime() + dayFromNow*60*60*24*1000);
  }
  return date.getFullYear() + '-' + formatNumber(date.getMonth() + 1) + '-' + formatNumber(date.getDate());
}

module.exports = {
  formatTime: formatTime,
  getDate: getDate
}
