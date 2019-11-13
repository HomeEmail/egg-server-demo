var log4js = require('log4js');

log4js.configure({
  appenders: {
    everything: { type: 'dateFile', filename: 'log/access.log', pattern:'.yyyy-MM-dd.log', maxLogSize: 104857600, backups: 5, compress: true }//大约100M分割一个日记压缩包
  },
  categories: {
    default: { appenders: [ 'everything' ], level: 'trace'}
  }
});

var logger1=log4js.getLogger('access');//getLogger的参数可以设置成输出日记的那个代码文件路径,方便定位查找bug

var logger2=log4js.getLogger(__filename);//把当前代码文件路径输出到日记中

//下面是输出日记，并区分了level，如：trace,debug,info ,error等
logger1.trace('log:','this is a trace log');
logger2.trace('log:','this is a trace log');
logger1.debug('mysql:','mysql timeout');
logger1.info('mysql:','mysql wait');
logger1.warn('mysql:','mysql memorey warn');
logger1.error('pay:','pay failure');
logger1.fatal('mysql:','mysql killed');
logger1.mark('pay:','pay stop');

//关于其他问题（例如：如何结合PM2）可以看看这个 https://nomiddlename.github.io/log4js-node/faq.html
