const weatherForm = document.querySelector('form');
const search = document.querySelector('input');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = search.value;
    const result = document.getElementById('result');
    result.textContent = 'Loading...'
    getWeather(location, (response) => {
        const mainContent = document.querySelector('main-content');
        if (!result) {
            result = document.createElement('div');
            result.id = 'result';
            mainContent.appendChild(result);
        } else {
            while (result.firstChild) {
                result.removeChild(result.firstChild);
            }
        }
        if (response.error) {
            const error = document.createElement('p');
            error.appendChild(document.createTextNode(response.error));
            result.appendChild(error);
        } else {
            const { location, description, temperature, feelslike, weatherURLImg } = response || {};
            console.log(weatherURLImg);
            const pLocation = document.createElement('p');
            const pDescription = document.createElement('p');
            const forecast = document.createElement('p');
            const weatherImg = document.createElement('img');
            weatherImg.src = weatherURLImg;
            const divImg = document.createElement('div');
            const divInfo = document.createElement('div')
            pLocation.appendChild(document.createTextNode(location));
            pDescription.appendChild(document.createTextNode(description));
            forecast.appendChild(document.createTextNode(`It is currently ${temperature} degrees out. It feels like ${feelslike} degrees out.`));
            divImg.appendChild(weatherImg);
            divInfo.appendChild(pLocation);
            divInfo.appendChild(pDescription);
            divInfo.appendChild(forecast);
            result.appendChild(divImg);
            result.appendChild(divInfo);
        }
    });

});

const getWeather = (location, callback) => {
    const baseURL = '/weather';
    fetch(`${baseURL}/${location}`).then((response) => {
        response.json().then((data) => {
            callback(data);
        });
    });
};