const express = require('express');
const { auth } = require('express-openid-connect');
const cors = require('cors');
const bodyparser = require('body-parser');

const app = express();

// setup auth to use with auth0
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'FkUgZltTZZxWorSyfqAJnfxTLBNNxKJTneXJiSQb',
    baseURL: 'https://austinh.us',
    clientID: 'DQt0cSZntrGrnRPunTmYfO2X2q4lMO8H',
    issuerBaseURL: 'https://dev-n2vqanuz0v3jyfc5.us.auth0.com'
};

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(auth(config));

app.get('/', (req, res) => {
    // if the user is not logged in, redirect to login page
    if (!req.oidc.isAuthenticated()) {
        return res.redirect('/login');
    }
    // if the user is logged in, show the main page
    res.sendFile(__dirname + '/main.html');
});

app.get('/login', (req, res) => {
    // if the user is logged in, redirect to main page
    if (req.oidc.isAuthenticated()) {
        return res.redirect('/');
    }
    // if the user is not logged in, redirect to the auth0 login page
    res.oidc.login({
        returnTo: '/'
    });
});

app.get('/logout', (req, res) => {
    // logout the user
    req.oidc.logout();
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});