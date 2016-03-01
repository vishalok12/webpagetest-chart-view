module.exports = {
  url: [
    {url: 'https://www.wordtray.com', name: 'Home Page'},
    {url: 'https://www.wordtray.com/login', name: 'Login Page'}
  ],
  viewFields: ['docTime', 'loadTime', 'fullyLoaded', 'SpeedIndex', 'visualComplete', 'bytesIn', 'bytesInDoc', 'requestsDoc', 'domElements', 'render', 'firstPaint', 'TTFB'],

  // get options from https://github.com/marcelduran/webpagetest-api#test-works-for-runtest-method-only
  options: {
    key: 'put-your-webtest-api-key',  // your webtest api key
    emulateMobile: true,              // to test on mobile
    location: 'ec2-ap-southeast-1:Chrome' // get list of locations from http://www.webpagetest.org/getLocations.php?f=html&k=A
  }
};
