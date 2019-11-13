const fs = require('mz/fs');
const path = require('path');
const dirPath = path.join(__dirname,'1');
console.log('文件夹'+dirPath);
async function test(){
  if(! await fs.exists(dirPath)){
    await fs.mkdir(dirPath);
  }else{
    console.log('文件夹存在'+dirPath);
  }
}
//test();