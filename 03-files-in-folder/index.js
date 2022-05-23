const path = require('path');
const fs = require('fs');

const allFiles = fs.promises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});

allFiles.then((res) => {
  for (let file of res) {
    if (file.isFile()) {
      const filePath = path.join(__dirname, 'secret-folder', file.name);
      fs.stat(filePath, (err, stats) => {
        const name = path.basename(filePath, `${path.extname(filePath)}`);
        console.log(`${name} - ${path.extname(filePath).slice(1)} - ${(stats.size / 1024).toFixed(3)} kb`);
      });
    }
  }
});
