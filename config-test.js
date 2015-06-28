module.exports = {
  url: [
    'https://www.wordtray.com',
    'https://www.wordtray.com/login'
  ],

  // get options from https://github.com/marcelduran/webpagetest-api#test-works-for-runtest-method-only
  options: {
    key: 'put-your-webtest-api-key',  // your webtest api key
    emulateMobile: true,              // to test on mobile
    location: 'ec2-ap-southeast-1:Chrome' // get list of locations from http://www.webpagetest.org/getLocations.php?f=html&k=A
  }
};
