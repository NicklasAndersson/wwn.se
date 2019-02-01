function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function getTimes() {
    httpGetAsync("https://pyapi.wwn.se/", function (r) {
        trains = JSON.parse(r).ResponseData.Trains
        for (var i = 0; i < trains.length; i++){
            userList.add({
                destination: trains[i].Destination,
                time: trains[i].ExpectedDateTime
            })
        }
    })
}

var options = {
    valueNames: [ 'destination', 'time' ],
    // Since there are no elements in the list, this will be used as template.
    item: '<li><h3 class="destination"></h3><p class="time"></p></li>'
};
var values = [
    {
        destination: 'Inga Hämtade',
        time: ''
    }
];

var userList = new List('trains', options, values);

getTimes();