var express = require('express');  
var request = require('request');
var fs = require('fs');

var urls;

try {
  urls = fs.readFileSync('urls.js', 'utf8')
} catch(e) {
  console.log('Error:', e.stack)
}
var app = express();  
app.use('/proxy', function(req, res) {  
  var url = decodeURIComponent(req.url.replace('/?url=',''));

  var knownHost = urls.indexOf(url) >= 0
  if (!knownHost) {
    res.sendStatus(400);
    return;
  }

  req.pipe(request({url: url, timeout: 5000}, function(error, response, body) { 
       if (error) {
          console.log("Error occurred");
          return res.sendStatus(504);
       } else {
          return res.sendStatus(200);
       }
  }));
});

app.use('/', function(req, res) {  
  return res.sendFile(req.url, { root: __dirname })
});

app.listen(process.env.PORT || 3000);
