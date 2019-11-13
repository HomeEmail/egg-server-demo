const Service = require('egg').Service;
const ejsExcel = require('ejsexcel');
const fs = require('fs');
class ImportService extends Service {

  /**
   *
   *
   * @param {string} xls_path
   * @memberof ImportService
   * @returns null or [] null表示文件内容格式不对
   */
  async checkAndReadXlsData(xls_path) { //读取和判断文件内容是否合格
    //获得Excel模板的buffer对象
    //只能读取xlsx格式的表格,表格要规矩，不要有合并单元格的情况
    try{
      let exlBuf = fs.readFileSync(xls_path)
      //getExcelArr 返回Promise对象
      let p = ejsExcel.getExcelArr(exlBuf)
      let exlJson = await p.then();
      //console.log(exlJson);//json 数组对象
      let result = [];
      if(exlJson[0].length<=1){
        return null;
      }
      for(let i=1,len=exlJson[0].length;i<len;i++){
        let row=exlJson[0][i];
        if(!!row&&row.length>0){
          if(!row[0]){
            return null; //不允许序号为空
          }
          if(!!row[0]&&row[0].indexOf('指标说明')>-1){
            break;
          }
          result.push(row);
        }
      }
      //console.log(result);
      return result;
    } catch (err){
      console.error(err);
      return null;
    }
  }

}

module.exports = ImportService;