// const { promises: fs } = require("fs");
const fs = require('fs');
const path = require('path');
let template = '';

async function copyDir(src, dest) {
  await fs.promises.rm(path.resolve(__dirname, dest), {recursive: true, force: true}, (err) => {
    if (err) throw err;
  });
  await fs.promises.mkdir(dest, {recursive: true});
  let entries = await fs.promises.readdir(src, {withFileTypes: true});

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory() ?
      await copyDir(srcPath, destPath) :
      await fs.promises.copyFile(srcPath, destPath);
  }
}
// copy assets
copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets')).then((res,er)=>{
  if(er) console.log('assets dont copy')
 else console.log('assets copy successfully')
})


// create template from components
async function replaceTemplate(template) {
  try {
    const componentsPath = path.join(__dirname, 'components');
    let components = (await fs.promises.readdir(componentsPath, {withFileTypes: true}))
      .filter(el => !el.isDirectory() && path.extname(el.name).toLowerCase() === '.html')
      .map(el => el.name);
    for (let component of components) {
      const re = new RegExp(`{{${component.replace(/\.[^/.]+$/, '')}}}`, 'g');
      const data = await fs.promises.readFile(path.join(componentsPath, component), 'utf-8');
      template = template.replace(re, data);
    }
    await fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), template, 'utf-8');

  } catch (e) {
    console.log(e);
  }
}

// copy styles
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
    const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf8');
    writeStream.write(allStyles.reverse().join(' '));
  }
}

// read template
function read(filePath) {
  const readableStream = fs.createReadStream(filePath, 'utf8');

  readableStream.on('data', (chunk) => {
    template += chunk;
  });
  readableStream.on('end', function () {
    console.log('All the data in the file has been read');
    replaceTemplate(template).then((res,er)=>{
      if(er) console.log('template dont replaced')
      else console.log('template replaced successfully')
    })
    copyStyles();
  });
}

read(path.join(__dirname, 'template.html'));
