'use strict';
let bodyParser = require('body-parser'),
    express = require('express'),
    Request = require('request'),
    fs = require('fs'),
    app = express();

app.set('port', 5873);
app.listen(app.get('port'), () => {
    console.log('Server started at port', app.get('port'));
});

app.use(bodyParser.urlencoded({
    "extended": true
}));
app.use((request, response, next) => {
    request.setEncoding('utf8');
    next();
});
// CORS
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.get('/crossdomain.xml', (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/xml'});
    fs.createReadStream('./crossdomain.xml').pipe(response);
});

app.all('/', entry);

let ranking = [],
    RANKING_SIZE = 10;
function entry(request, response) {
    console.log(`${request.method} ${(new Date()).toString()}`);
    console.log(`\x1b[33mHeader:\t ${JSON.stringify(request.headers)} \x1b[0m`);
    console.log(`Query:\t ${JSON.stringify(request.query)}`);
    console.log(`Body:\t ${JSON.stringify(request.body)}`);
    console.log(`Result: ${JSON.stringify(getRank(request.body))}`);
    // return response.status(200).send(JSON.stringify(getRank(request.body)));
    return response.status(200).send();
};
function getRank(inputData) {
    try {
        inputData.score = parseInt(inputData.score);
    } catch (e) {
    }
    inputData = !inputData.score ? {"score":0} : inputData;
    ranking.push(inputData);
    ranking.sort((a, b) => a.score < b.score);
    ranking = ranking.slice(0, RANKING_SIZE);
    return {
        ranking,
        "index": ranking.indexOf(inputData)
    }
}