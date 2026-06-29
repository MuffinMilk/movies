const https = require('https');
https.get('https://docs.google.com/uc?export=download&id=1Wln4GrxsR6XL-u1XZ8vynnIQJ6R3kyDZ', (res) => {
  console.log(res.statusCode);
  console.log(res.headers);
});
