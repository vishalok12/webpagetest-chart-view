# webpagetest-chart-view
Fetch website performance details from webpagetest api and display in nice chart view using highcharts

## How to Use
1. Clone this repository.
2. Rename config-test.js to config.js and change your urls to test under url property.
3. Run this command to test from webpagetest api
```
# run just once after clone
npm install
# run this command every time you need to test performance
node index.js
```
4. Go to app directory, and run
```
npm install (run just once after clone)
bower install (run just once after clone)
node server.js
```
5. Now open <b>localhost:3000</b> and you should see the graphs.
