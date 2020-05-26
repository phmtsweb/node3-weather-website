const request = require('postman-request');

const geocode = (address, callback) => {
    const baseURL = 'https://api.mapbox.com/';
    const accessToken = 'pk.eyJ1IjoicGVkcm9oYXoiLCJhIjoiY2thbGVjd2VmMGJlazJzcGswcGZtNTV0bCJ9.gFijUQHUmY17T06MjMQCWQ';
    const limit = 1;
    const addressEncoded = encodeURIComponent(address);
    const methodURL = 'geocoding/v5/mapbox.places/';
    const query = `${addressEncoded}.json?access_token=${accessToken}&limit=${limit}`;
    const url = baseURL + methodURL + query;

    request({
        url,
        json: true
    }, (error, { statusCode, body } = {}) => {
        if (error) {
            callback('Unable to connect to location services!', undefined);
        } else if (statusCode !== 200 || body.features.length === 0) {
            callback('Unable to find location. Try another search.', undefined);
        } else {
            const currentLocal = body.features[0];
            callback(undefined, {
                latitude: currentLocal.center[1],
                longitude: currentLocal.center[0],
                location: currentLocal.place_name
            });
        }
    });
};

module.exports = geocode;