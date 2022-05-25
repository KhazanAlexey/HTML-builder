const path = require('path');
const fs = require('fs');


function copyDir() {
  fs.rmdir(path.join(__dirname, 'files-copy'), {recursive: true}, (err) => {
    if (err) {
      throw err;
    }

    const allFiles = fs.promises.readdir(path.join(__dirname), {withFileTypes: true});
    allFiles.then((files) => {
      for (let file of files) {
        if (!file.isFile() && file.name !== 'files-copy') {
          const makeDir = fs.promises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true});
          makeDir.then(() => {
            readFile();
          });
        }
      }
    });

    function readFile() {
      const filesDir = fs.promises.readdir(path.join(__dirname, 'files'), {withFileTypes: true});
      filesDir.then((files) => {
        for (let file of files) {
          if (file.isFile()) {
            copyFile(file.name);
          }

        }
      });
    }

    function copyFile(file) {
      fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (err) => {
        if (err) console.log(err);
      });
    }
  });
}

copyDir();
