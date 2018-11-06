const express = require('express');
const app = express();
const lib = require('./lib');

module.exports.handler = async (event, context) => {

    /**
     * This is a demo mock service designed to show information about the request event and context, as well as data passed in
     *  from a custom Lambda Authorizer. The response from this service is a JSON object containing useful information about the
     *  calling request as well as data form the authorizer, such as token claims, issuer, audience, and the policy document that
     *  will be enforced by the API gateway.
     **/

    //Bind prefix to log levels to make it easier to read the logs
    console.log = console.log.bind(null, '[LOG]');
    console.info = console.info.bind(null, '[INFO]');
    console.warn = console.warn.bind(null, '[WARN]');
    console.error = console.error.bind(null, '[ERROR]');

    console.log(`logGroupName: ${context.logGroupName}`);
    console.log(`logStreamName: ${context.logStreamName}`);

    let token;
    let response;

    let queryStringParams = event.queryStringParameters;
    // decode the incoming access token JWT so that it can be returned as part of the our demo APIs response
    // This is purely for demo purposes.
    try {
        token = await lib.inspectJwt(event);
    } catch (err) {
        token = err.message;
    }


    console.log(`event.queryStringParameters follows...`);
    console.log(queryStringParams);


    // We have configured our Lambda Authorizer to pass info about the access token, request context, policy decisions, etc. into our API.
    //  so that we can display it for demo purposes. We packed array and JSON objects into strings, and need to unpack them here.
    let effectArray = (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.effect) ? event.requestContext.authorizer.effect.split(' ') : 'event.requestContext.authorizer.effect is null. Do you have an authorizer assigned to this resource?';
    let jwks = (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.jwks) ? JSON.parse(event.requestContext.authorizer.jwks) : 'event.requestContext.authorizer.jwks is null. Do you have an authorizer assigned to this resource?';
    let claims = (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.claims) ? JSON.parse(event.requestContext.authorizer.claims) : 'event.requestContext.authorizer.claims is null. Do you have an authorizer assigned to this resource?';

    // Rather than displaying the stringified version of these objects, replace them with a placeholder "see below..." and display the full object as
    //  additional attributes on the API's response.

    if (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.effect) {
        event.requestContext.authorizer.effect = 'see effect attribute below...';
    }

    if (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.jwks) {
        event.requestContext.authorizer.jwks = 'see jwks attribute below...';
    }

    if (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.claims) {
        event.requestContext.authorizer.claims = 'see token attribute below...';
    }

    /*  This code block will return debugging info instead of the vehicle inventory
    // compose our response body - this service is primarily returns information about the request context and the
    //  data passed in from the Lambda Authorizer.
    var responseBody = {
        mockingService: 'myTestService',
        description: 'This is a demo service designed to show the request context and data from our Lambda Authorizer. Below are the event and context passed to this API. Below those are the effect of the policy decision, the jwks from our auth server, and the claims presented in the access token consumed by the Lambda authorizer',
        requestParams: queryStringParams,
        event: event,
        context: context,
        token: token,
        effect: effectArray,
        jwks: jwks,
        claims: claims,
    };
    */

    // compose response body simulating the vehicle inventory TODO: call another service using client credentials for actual DB lookup


    responseBody = {
        "inventory": [
            { "id":"112345", "make":"Jeep", "model":"Wrangler", "class":"Offroad", "desc":"Radio, CD, Anti-Theft Device, Anti-Skid Device, 4x4, Removable Top, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Power Mirrors, Power Windows, Tilt Steering\n", "price":"35", "avail":"true", "image_url":"https://www.cstatic-images.com/car-pictures/xl/usc80jes162b021001.png" },
            { "id":"122346", "make":"Ford", "model":"Explorer", "class":"SUV", "desc":"CD, Anti-Theft Device, Anti-Skid Device, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Dual Mirrors, Power Brakes, Power Driver Seat, Power Mirrors, Power Steering, Power Windows, Tilt Steering\n", "price":"55", "avail":"true", "image_url":"https://www.cstatic-images.com/car-pictures/xl/usc80fos101a021001.png" },
            { "id":"123347", "make":"Subaru", "model":"Forester", "class":"SUV", "desc":"Radio, CD, AWD, Anti-Theft Device, Anti-Skid Device, Bucket Seats, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Power Driver Seat, Power Mirrors, Power Windows, Tilt Steering\n", "price":"35", "avail":"false", "image_url":"https://www.cstatic-images.com/car-pictures/xl/usc70sus041f021001.png" },
            { "id":"544321", "make":"Honda", "model":"Accord", "class":"Midsize", "desc":"CD, Anti-Theft Device, Anti-Skid Device, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Dual Mirrors, Power Brakes, Power Driver Seat, Power Mirrors, Power Steering, Power Windows, Tilt Steering\n", "price":"25", "avail":"true", "image_url":"https://www.cstatic-images.com/car-pictures/xl/usc80hoc011e021001_2.png" },
            { "id":"545321", "make":"Mercedes-Benz", "model":"AMG C 43", "class":"Premium", "desc":"Radio, CD, Anti-Theft Device, Anti-Skid Device, Bucket Seats, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Navigational System, Power Driver Seat, Power Mirrors, Power Windows, Tilt Steering", "price":"125", "avail":"true", "image_url":"https://www.cstatic-images.com/car-pictures/xl/usc70mbcbg5a021001.png" },
            { "id":"546321", "make":"Cadillac", "model":"ATS-V", "class":"Premium", "desc":"Radio, CD, Anti-Theft Device, Anti-Skid Device, Bucket Seats, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Navigational System, Power Mirrors, Power Windows, Tilt Steering, V8 Engine", "price":"95", "avail":"false", "image_url":"https://www.cstatic-images.com/car-pictures/xl/usc60cac222a021001.png" },
            { "id":"547321", "make":"Chevrolet", "model":"Cruze", "class":"Midsize", "desc":"CD, Anti-Theft Device, Anti-Skid Device, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Dual Mirrors, Power Brakes, Power Driver Seat, Power Mirrors, Power Steering, Power Windows, Tilt Steering", "price":"15", "avail":"true", "image_url":"https://www.cstatic-images.com/car-pictures/xl/usc70chc302b021001.png" },
            { "id":"123845", "make":"Toyota", "model":"Tundra", "class":"Offroad", "desc":"Radio, CD, Anti-Theft Device, Anti-Skid Device, Bucket Seats, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Navigational System, Power Driver Seat, Power Mirrors, Power Windows, Tilt Steering, V8 Engine", "price":"65", "avail":"true", "image_url":"https://www.cstatic-images.com/car-pictures/xl/usc80tot109e021001.png" },
            { "id":"123946", "make":"Buick", "model":"Encore", "class":"SUV", "desc":"Radio, CD, Anti-Theft Device, Anti-Skid Device, Bucket Seats, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Navigational System, Power Driver Seat, Power Mirrors, Power Windows, Tilt Steering", "price":"45", "avail":"true", "image_url":"https://www.cstatic-images.com/car-pictures/xl/usc70bus041a021001.png" },
            { "id":"123479", "make":"Audi", "model":"S3", "class":"Premium", "desc":"Radio, CD, Anti-Theft Device, Anti-Skid Device, Bucket Seats, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Navigational System, Power Driver Seat, Power Mirrors, Power Windows, Tilt Steering, V8 Engine", "price":"72", "avail":"false", "image_url":"https://www.cstatic-images.com/car-pictures/xl/usc70auc321a021001.png" },
            { "id":"543218", "make":"Toyota", "model":"Prius c", "class":"Midsize", "desc":"Hybrid, Radio, CD, Anti-Theft Device, Anti-Skid Device, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Power Driver Seat, Power Mirrors, Power Windows, Tilt Steering", "price":"45", "avail":"true", "image_url":"https://www.cstatic-images.com/car-pictures/xl/usc70toc251b021001.png" },
            { "id":"754321", "make":"Volkswagen", "model":"Volkswagen Tiguan", "class":"SUV", "desc":"Radio, CD, Anti-Theft Device, Anti-Skid Device, Bucket Seats, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Navigational System, Power Mirrors, Power Windows, Tilt Steering, V8 Engine", "price":"75", "avail":"true", "image_url":"https://www.cstatic-images.com/car-pictures/xl/usc80vws031b021001.png" },
            { "id":"654321", "make":"Bentley", "model":"Bentley Flying Spur", "class":"Premium", "desc":"Radio, CD, Anti-Theft Device, Anti-Skid Device, Bucket Seats, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Navigational System, Power Driver Seat, Power Mirrors, Power Windows, Tilt Steering", "price":"356", "avail":"false", "image_url":"https://www.cstatic-images.com/car-pictures/main/USC50BEC111B021001.png" },
            { "id":"254321", "make":"Toyota", "model":"Camry", "class":"Midsize", "desc":"Radio, CD, Anti-Theft Device, Anti-Skid Device, Central Locking, Cruise Control, Driver Airbag, Dual Airbags, Power Driver Seat, Power Mirrors, Power Windows, Tilt Steering", "price":"35", "avail":"true", "image_url":"https://www.cstatic-images.com/car-pictures/xl/usc80toc021b021001.png" }
        ]
    };

    response = {
        statusCode: 200,
        isBase64Encoded: false,
        body: JSON.stringify(responseBody)
    };

    console.log(`mockApiService response follows...`);
    console.log(response);

    return response;
};