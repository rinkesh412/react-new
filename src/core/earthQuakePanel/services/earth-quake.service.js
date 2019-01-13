export function getEarthQuakeData() {
    var fetchProperties = {
        method: 'GET',
    };

    return fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02', fetchProperties)
        .then(response => response.json());
}