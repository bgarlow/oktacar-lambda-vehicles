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

    response = {
        statusCode: 200,
        isBase64Encoded: false,
        body: JSON.stringify(responseBody)
    };

    console.log(`mockApiService response follows...`);
    console.log(response);

    return response;
};