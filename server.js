const express = require('express');
const app = express();
const path = require('path');

const api_key ='81u14o7fg3jp7g';
const scope = ['r_basicprofile', 'r_emailaddress', 'rw_company_admin'];
const redirectUrl = 'https://mxians-tracking.herokuapp.com';
const Linkedin = require('node-linkedin')(api_key, 'EMhuyarIxKs22kSu');

var linkedin;

app.get('/', function(req, res) {  
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/oauth/linkedin', function(req, res) {
    // This will ask for permisssions etc and redirect to callback url.
    Linkedin.auth.setCallback(redirectUrl);
    Linkedin.auth.authorize(res, scope);    
});

app.get('/oauth/linkedin/callback', function(req, res) {
    Linkedin.auth.getAccessToken(res, req.query.code, req.query.state, function(err, results) {
        if ( err )
            return console.error('eror',err);
 
        /**
         * Results have something like:
         * {"expires_in":5184000,"access_token":". . . ."}
         */
 
        linkedin = Linkedin.init(results.acess_token);
         
        // return res.redirect('/facebook');
    });
});

app.get('/facebook', function(req, res) {
    // This will ask for permisssions etc and redirect to callback url.            
    linkedin.companies_search.name('facebook', 1, function(err, company) {
        name = company.companies.values[0].name;
        desc = company.companies.values[0].description;
        industry = company.companies.values[0].industries.values[0].name;
        city = company.companies.values[0].locations.values[0].address.city;
        websiteUrl = company.companies.values[0].websiteUrl;

        res.send('<p>name',name,'desc',desc,'</p>');
    });    
});

app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
});



// var key = ''
//   , secret = ''
//   , callbackUrl = ''
//   , LinkedIn = require('../')
//   , rl = require('readline')
//   , linkedIn = new LinkedIn(key, secret)
//   , qs = require('querystring')
//   , util = require('util');

// linkedIn.OAuth2.getAuthorizeUrl(callbackUrl, function(err, url) {
//   console.log('Follow the url to get code: \n' + url)
// });
// var i = rl.createInterface(process.stdin, process.stdout);

// i.question("Enter oauth_verifier: ", function(code) {
//   i.close();
//   process.stdin.destroy();
//   console.log(callbackUrl);
//   linkedIn.OAuth2.getAccessToken(code, callbackUrl, function(error, accessToken, accessTokenSecret) {
//     if(error) console.log(error);    
//     var params = {};

//     params.access_token = accessToken;

//     linkedIn.OAuth2.accessToken = accessToken;
//     linkedIn.OAuth2.accessTokenSecret = accessTokenSecret;
//     // v1/people/~/connections
        
//   })
// });