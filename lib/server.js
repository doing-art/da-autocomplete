let express = require('express');
let fs = require('fs');
let path = require('path');

let app = express();

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/examples', express.static(path.join(__dirname, 'examples')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));

start();

function start() {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'examples/index.html'));
    });

    app.get('/search', (req, res) => {
        let searchPhrase = decodeURIComponent(req.param('searchPhrase'));
        let resultNumberToShow = req.param('resultNumberToShow');
        let responseData = {};
        let data;

        fs.readFile('examples/kladr.json', 'utf8', function (er, dataSource) {
            if (er) { throw er; }

            data = dataSource && JSON.parse(dataSource);
            data = filter(data, searchPhrase);

            if(data) {
                responseData.data = data.splice(0, resultNumberToShow);
                responseData.total = data.length;
            }

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
        let searchRegExp = new RegExp(`^${searchPhrase.toLowerCase()}`);

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

