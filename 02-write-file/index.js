const path = require('path');
const fs = require('fs');


console.log('Enter the data to be displayed ');
let data = '';
process.stdin.on('data', function (chunk) {
  let myBuffer = Buffer.from(chunk, 'utf8').toString();

  const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf8');

  if (myBuffer.trim() == 'exit') {
    console.log('bye!');
    writeStream.end()
    process.exit(0);

  }

  data += chunk;

  writeStream.on('error', function (error) {
    console.log(`error: ${error.message}`);
  });
// write some data with a base64 encoding
  writeStream.write(data, 'utf8');

// the finish event is emitted when all data has been flushed from the stream
  writeStream.on('finish', () => {
    console.log('wrote all data to file');
  });

  // close the stream
  process.on('SIGINT',()=>{
    console.log('bye')
    writeStream.end()
    process.exit(0);
  })
});

