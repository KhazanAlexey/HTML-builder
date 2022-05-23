const path = require('path');
const fs = require('fs');


function copyStyles() {

  let allStyles = [];
  let promises = [];

  const allStylesFiles = fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});

  allStylesFiles.then((stylesFiles) => {
      for (const styleFile of stylesFiles) {
        if (styleFile.isFile() && path.extname(styleFile.name).slice(1) === 'css') {
          promises.push(readStyles(styleFile.name));
        }
      }
      Promise.all(promises).then(() => {
        writeCssToBundle();
      });
    }
  )
    .catch((e) => {
      console.log('read dir error', e);
    });

  async function readStyles(styleFileName) {
    try {
      let newStyleData = await fs.promises.readFile(path.join(__dirname, 'styles', styleFileName), 'utf8');
      allStyles.push(newStyleData);
      return newStyleData;

    } catch (e) {
      console.log('file Read Error', e);
    }
  }

  function writeCssToBundle() {
    const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf8');
    writeStream.write(allStyles.join(' '));
  }
}

copyStyles();
