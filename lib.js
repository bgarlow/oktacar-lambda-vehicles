require('dotenv').config({ silent: true });
const jwt = require('jsonwebtoken');


// extract and return the Bearer Token from the Lambda event parameters
const getToken = (event) => {

    const tokenString = event.headers.Authorization;
    if (!tokenString) {
        throw new Error('jstinspector -> Expected "event.authorizationToken" parameter to be set');
    }

    const match = tokenString.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
        throw new Error(`jstinspector -> Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
    }
    return match[1];
};

module.exports.inspectJwt = (params) => {

    console.log(params);

    const token = getToken(params);
    const decoded = jwt.decode(token, {complete: true});
    if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new Error('jstinspector -> invalid token');
    }

    return decoded;
};