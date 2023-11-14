const express = require('express');
const {Issuer, Strategy} = require ('openid-client');
const app = express();
const port = 8888;

const clientId = '34c8389b-6033-4f2a-9c96-8a32214a9065';
const clientSecret = 'c1GzSAwRo6';
const oidcDiscoveryUrl = 'https://cian.verify.ibm.com/oauth2';

let client, oidcIssuer;

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
    const authUrl = client.authorizationUrl({
        redirect_uri: 'http://localhost:8888/callback',
        scope: 'openid profile email',
        // code_challenge,
        code_challenge_method: 's256',
        state: 'blankState'
    });
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) =>{
    const params = client.callbackParams(req);
    const tokenSet = await client.callback('http://localhost:8888/callback', params, {code_verifier: undefined});
    res.json(tokenSet);
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})