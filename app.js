const express = require('express')
const app = express()
// const port = 80;
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const URL = process.env.NODE_ENV === 'production' ? 'https://osw-email.herokuapp.com' : 'http://localhost:3001'

// const db = require('./models')

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}


app.get('/', (req, res) => {
  var options = {
    root: path.join(__dirname, 'public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  var fileName = 'form.html';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.error('err', err);
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

app.get('/replace', (req, res) => {
  console.log('query', req.query);

  fs.readFile('Template_EE-OSW.html', 'utf8', function (err,data) {
  // fs.readFile('input.html', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    var regex = /000000/gi;
    var SNregex = /schoolname/gi;
    var SLregex = /schoollink/gi;
    var UTMregex = /111111/gi;
    var SMIregex = /222222/gi;
    var footregex = /0000ff/gi;
    
    var modifiedEmail = data.replace(SLregex, req.query.schoollink);
    modifiedEmail = modifiedEmail.replace(footregex, req.query.buttoncolor);
    modifiedEmail = modifiedEmail.replace('**http://www.balfour.com/schoolname**', req.query.footerURL);
    modifiedEmail = modifiedEmail.replace(SNregex, req.query.schoolname);
    modifiedEmail = modifiedEmail.replace("It's time to order your Official [School] Ring!", req.query.schoolnamehead);
    modifiedEmail = modifiedEmail.replace(UTMregex, req.query.UTM);
    modifiedEmail = modifiedEmail.replace(SMIregex, req.query.SMI);
    modifiedEmail = modifiedEmail.replace('Be part of a timeless [Nickname] tradition. Order your personalized ring to show your pride and celebrate your success with fellow classmates.', req.query.nickname);
    modifiedEmail = modifiedEmail.replace('ONE DAY ONLY', req.query.days);
    modifiedEmail = modifiedEmail.replace('**Day**, **Month** **#**', req.query.day);
    modifiedEmail = modifiedEmail.replace('**s00**', req.query.starthour);
    modifiedEmail = modifiedEmail.replace('**a.m.**', req.query.am);
    modifiedEmail = modifiedEmail.replace('**e00**', req.query.endhour);
    modifiedEmail = modifiedEmail.replace('0019.XXXXX', req.query.MJNumber);
    modifiedEmail = modifiedEmail.replace('**p.m.**', req.query.pm);
    modifiedEmail = modifiedEmail.replace('**Location**', req.query.location);
    modifiedEmail = modifiedEmail.replace(regex, req.query.buttoncolor);

    fs.writeFileSync('XXXX_EE-OSW.html', modifiedEmail);
    res.download('XXXX_EE-OSW.html');
  });

});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
