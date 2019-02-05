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
    return arr[1];
}

function parseDir1(dir) {
    if(dir === 1){
        return '*'
    }else{
        return ''
    }
}

function parseDir2(dir) {
    if(dir === 2){
        return '*'
    }else{
        return ''
    }
}

function getTimesKallhall() {
    httpGetAsync("https://pyapi.wwn.se/kallhall", function (r) {
        var parsed = JSON.parse(r);
        $('#update-time-kallhall').empty();
        $('#update-time-kallhall').append('Uppdaterad: '
            + parseTime(parsed.ResponseData.LatestUpdate));
        console.log(parsed.ResponseData.LatestUpdate);
        var trains = parsed.ResponseData.Trains;
        $('#train-list-kallhall').empty();
        for (var i = 0; i < trains.length; i++) {
            $('#train-list-kallhall').append(
                '<tr><td>'
                + trains[i].Destination
                + '</td><td>'
                + parseTimeNoDate(trains[i].ExpectedDateTime)
                + ' ' + parseDir1(trains[i].JourneyDirection)
                + '</td></tr>'
            );
        }
    })
}

function getTimesCity() {
    httpGetAsync("https://pyapi.wwn.se/city", function (r) {
        var parsed = JSON.parse(r);
        $('#update-time-city').empty();
        $('#update-time-city').append('Uppdaterad: '
            + parseTime(parsed.ResponseData.LatestUpdate));
        console.log(parsed.ResponseData.LatestUpdate);
        var trains = parsed.ResponseData.Trains;
        $('#train-list-city').empty();
        for (var i = 0; i < trains.length; i++) {
            $('#train-list-city').append(
                '<tr><td>'
                + trains[i].Destination
                + '</td><td>'
                + parseTimeNoDate(trains[i].ExpectedDateTime)
                + ' ' + parseDir2(trains[i].JourneyDirection)
                + '</td></tr>'
            );
        }
    })
}

function getTimes(){
    getTimesCity();
    getTimesKallhall();
}

getTimes();
var timerID = setInterval(function() {
    getTimes();
}, 30 * 1000);