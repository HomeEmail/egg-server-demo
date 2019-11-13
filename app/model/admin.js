module.exports = app => {
  const { STRING, INTEGER, DATE, BIGINT,TINYINT } = app.Sequelize;
  const Admin = app.model.define('admin', { //admin模型名称
    adminId: { //主键
      type: BIGINT(19),
      primaryKey: true,
      autoIncrement: true, // 对postgres来说会自动转为 SERIAL 
      field: 'admin_id' //此属性对应的数据库表里的字段名称
    },
    admin_account: STRING(64),
    admin_email: STRING(64),
    admin_password: STRING(128),
    admin_name: STRING(32),
    admin_phone: STRING(32),
    admin_age: INTEGER,
    admin_sex: STRING(4),
    admin_identity_number: STRING(32),
    created_at: DATE,
    updated_at: DATE,
    last_sign_in_at: DATE,
    disabled: TINYINT,
  },{
    tableName: 'admin', //此model对应的数据表名称
  });
  //没有主键的话可用 Model.removeAttribute('id') 来去掉,否则查询时默认带主键id导致查询失败

  Admin.findByAccount = async function(account) {
    return await this.findOne({
      where: {
        admin_account: account
      }
    });
  }

  // don't use arraw function
  Admin.prototype.logSignin = async function() {
    return await this.update({ last_sign_in_at: new Date() });
  }

  return Admin;
};