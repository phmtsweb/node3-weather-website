const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');




const app = express();
const port = process.env.PORT || 3000;

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');


//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));



app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Pedro Mascarenhas'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        imgURL: '/img/perfil.jpg',
        name: 'Pedro Mascarenhas'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'If you any questions, you do not hesitate to contact me. I will be happy to anwser you.',
        name: 'Pedro Mascarenhas'
    });
});

app.get('/weather/:address?/:unit?', (req, res) => {
    const { address, unit = 'm' } = req.params || {};
    const units = ['m', 'f', 's'].filter((element) => element === unit);
    if (units.length === 0) {
        return res.send({
            error: 'You must provide a valid numerical system'
        });
    }
    if (!address) {
        return res.send({
            error: 'You must provide an address'
        });
    }

    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            });
        }
        forecast((error, { temperature, feelslike, description, weatherURLImg, humidity } = {}) => {
            if (error) {
                return res.send({
                    error
                });
            }
            res.send({
                location,
                description,
                temperature,
                feelslike,
                weatherURLImg,
                humidity
            });
        }, latitude, longitude, unit);

    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }

    console.log(req.query);
    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.status(404).render('404', {
        title: 'Error',
        errorMessage: 'Help article not found',
        name: 'Pedro Mascarenhas'
    });
});

app.get('*', (req, res) => {
    res.status(404).render('404', {
        title: 'Error',
        errorMessage: 'Page not found',
        name: 'Pedro Mascarenhas'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});