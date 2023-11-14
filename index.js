const express = require('express');
const {Issuer, Strategy} = require ('openid-client');
const app = express();
const port = 8888;

const clientId = '34c8389b-6033-4f2a-9c96-8a32214a9065';
const clientSecret = 'c1GzSAwRo6';
const oidcDiscoveryUrl = 'https://cian.verify.ibm.com';

let client, oidcIssuer;


app.get('/', (req, res) => {
    res.send("Welcome to the OIDC Demo")
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})