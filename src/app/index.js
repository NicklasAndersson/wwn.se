import '../style/style.scss';

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function parseTime(time) {
    var arr = time.split('T');
    return arr[0] + ' ' + arr[1];
}

function parseTimeNoDate(time) {
    var arr = time.split('T');
    return arr[1].substring(0,5);
}

function parseDir(dir) {
    if (dir === 1) {
        return '(N)'
    } else {
        return ''
    }
}

var parsedCity;
var parsedKallhall;

function getTimesFor(place, title) {
    httpGetAsync("https://pyapi.wwn.se/" + place, function (r) {
        var parsed = JSON.parse(r);
        $('#update-time').empty();
        $('#update-time').append('Uppdaterad: '
            + parseTime(parsed.ResponseData.LatestUpdate));
        $('#train-list').append(buildSeparatorRow(title));
        var trains = parsed.ResponseData.Trains;
        for (var i = 0; i < trains.length; i++) {
            $('#train-list').append(
                buildRow(trains[i])
            );
        }
    })
}

function drawTable() {

}

function buildTableHeader() {
    return '<thead>' +
        '<tr>' +
        '<th>Destination</th>' +
        '<th>Avgång</th>' +
        '<th></th>' +
        '<th></th>' +
        '</tr>' +
        '</thead>';
}

function buildSeparatorRow(title) {
    return '<tr><th scope="row" colspan="4">' +
        title
        + '</th></tr>'
}

function buildRow(train) {
    return '<tr><td>'
        + train.Destination
        + '</td><td>'
        + train.DisplayTime
        + '</td><td>'
        + parseTimeNoDate(train.ExpectedDateTime)
        + '</td><td>'
        + parseDir(train.JourneyDirection)
        + '</td></tr>'
}

function clearTable() {
    $('#train-list').empty();
    $('#train-list').append(buildTableHeader());
}

function getTimes() {
    clearTable();
    getTimesFor('kallhall','från Kallhäll');
    getTimesFor('city','från Stockholm City');
}

$(document).ready(function () {
    getTimes();
    var timerID = setInterval(function () {
        getTimes();
    }, 30 * 1000);
});
