const Subscription = require('egg').Subscription;

class TestSchedule extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '10080m', // 7天 m分钟间隔
            type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        //console.log('schedule test log uploadBasePath:'+this.ctx.app.config.uploadBasePath);
        //this.ctx.app.cache
    }
}

module.exports = TestSchedule;

//手动执行定时任务
//await app.runSchedule('update_cache');