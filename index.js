const express = require('express');
const session = require('express-session');
const {Issuer, Strategy} = require ('openid-client');
const app = express();
const path = require('path');
const port = 8888;

const clientId = '34c8389b-6033-4f2a-9c96-8a32214a9065';
const clientSecret = 'c1GzSAwRo6';
const oidcDiscoveryUrl = 'https://cian.verify.ibm.com/oauth2';

let client, oidcIssuer;

app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

Issuer.discover(oidcDiscoveryUrl)
    .then((issuer) => {
        oidcIssuer = issuer;
        client = new issuer.Client({client_id: clientId, client_secret: clientSecret});
    })
    .catch((err) => console.error('Error discovering OIDC issuer', err));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
    // res.send("Welcome to the OIDC Demo")

})

app.get('/login', (req, res) => {
    const state = Math.random().toString(36).substring(7);
    req.session.state = state;

    const authorizationUrl = client.authorizationUrl({
        redirect_uri: 'http://localhost:8888/callback',
        scope: 'openid profile email',
        code_challenge_method: 's256',
        state: state
    });

    console.log('Redirecting to authorization URL:', authorizationUrl);

    res.redirect(authorizationUrl);
});

app.get('/callback', async (req, res) =>{
    try{
        const state = req.query.state || req.session.state;
        if(!state){
            return res.status(400).send('Missing State Parameter');
        }
        const params = client.callbackParams(req);
        const tokenSet = await client.callback('http://localhost:8888/callback', params, {code_verifier: undefined});

        res.json(tokenSet);
        console.log('Callback params', params);
        console.log('Callback state', state);
    } catch (err){
        console.error('Error in callback:', err);
        res.status(500).send('Internal server error');
    }
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)


})