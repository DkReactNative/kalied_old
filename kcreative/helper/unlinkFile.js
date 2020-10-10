var fs = require('fs');
const unlink = (pathFile) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(pathFile)) {
      fs.unlink(pathFile, function (errs) {
        if (errs) {
          console.log(errs)
          resolve(errs)
        } else {
          resolve(true)
        }
      });
    } else {
      resolve(true)
    }
  })
}
module.exports = unlink;