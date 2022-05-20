const path = require('path');
const fs = require('fs');

const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf8');

readableStream.on('error', function (error) {
  console.log(`error: ${error.message}`);
});

readableStream.on('data', (chunk) => {
  console.log(chunk);
});
