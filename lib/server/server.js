let express = require('express');
let fs = require('fs');

let app = express();

start();

function start() {
    app.get('/', (req, res) => {
        res.send('Default route');
    });

    app.get('/search', (req, res) => {
        let searchPhrase = req.param('searchPhrase');
        let resultNumberToShow = req.param('resultNumberToShow');
        let responseData = {};
        let data;

        fs.readFile('kladr.json', 'utf8', function (er, dataSource) {
            if (er) { throw er; }

            data = dataSource && JSON.parse(dataSource);
            responseData.data = filter(data, searchPhrase).splice(0, resultNumberToShow);
            responseData.total = responseData.data ? responseData.data.length : 0;

            res.send(responseData);
        });
    });

    app.listen(3000, () => {
        console.log('Server started!');
    });
}

function filter(result, searchPhrase) {
    let resultFiltered = [];

    if(result && searchPhrase) {
        let searchRegExp = new RegExp(`(\\s|^)${searchPhrase.toLowerCase()}`);

        for(let item of result) {
            if( searchRegExp.test(item.City.toLowerCase()) ) {
                resultFiltered.push(item);
            }
        }
    } else {
        resultFiltered = result;
    }

    return resultFiltered;
}

