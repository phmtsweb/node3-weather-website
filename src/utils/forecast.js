const request = require('postman-request');

const forecast = (callback, latitude, longitude, unit) => {
    if (latitude === undefined || longitude === undefined) {
        callback('Latitude and longitude is required!', undefined);
    } else {
        const baseURL = 'http://api.weatherstack.com/';
        const accessKey = '8e6561e8848c8bcf3bcfa64886bbe2ae';
        const units = unit || 'm';
        const queryURL = `current?access_key=${accessKey}&query=${latitude},${longitude}&units=${units}`;
        const url = baseURL + queryURL;

        request({
            url,
            json: true
        }, (error, { statusCode, body } = {}) => {
            if (error) {
                callback('Unable to connect to weather services!', undefined);
            } else if (statusCode !== 200 || body.error) {
                callback('Unable to find location!', undefined);
            } else {
                callback(undefined, {
                    temperature: body.current.temperature,
                    feelslike: body.current.feelslike,
                    description: body.current.weather_descriptions[0],
                    weatherURLImg: body.current.weather_icons[0],
                    humidity: body.current.humidity
                });
            }
        });
    }
};

module.exports = forecast;