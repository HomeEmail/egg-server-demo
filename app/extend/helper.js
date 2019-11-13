//一种快速扩展的方式
//Helper 用来提供一些实用的 utility 函数
//在nunjucks view 模板里可以直接使用 如 helper.relativeTime(item.time)
//可以在 Context 的实例上获取到当前请求的 Helper(ctx.helper) 实例
const moment = require('moment');
//相对于现在过去多少时间的一个语言描述
exports.relativeTime = time => moment(new Date(time*1000)).fromNow();


