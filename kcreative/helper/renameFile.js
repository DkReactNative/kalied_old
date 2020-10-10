var fs = require('fs');
const rename =(oldpath,newpath) => {
	return new Promise((resolve,reject)=>{
      fs.rename(oldpath, newpath, function (err) {
        if(err){
        	console.log(err)
        	reject(false)
        } else{
        	resolve(true)
        }
      })
  })
}

module.exports = rename;