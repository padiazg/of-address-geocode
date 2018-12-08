"use strict"

const request = require('request-promise-native');
const querystring = require("querystring");
const URL = "https://maps.google.com/maps/api/geocode/json";

module.exports = (context, callback) => {
    const { Http_Method, Http_Query, Http_Content_Type, API_KEY } = process.env;

    // check method
    if (Http_Method != "GET" && Http_Method != "POST") {
        callback("Method not allowed", null);
        return;
    } // (Http_Method != "GET" && Http_Method != "POST")  ...

    // check if parameters are present
    if ((Http_Method =="GET" && !Http_Query) || (Http_Method =="POST" && !Http_Query && !context)) {
        callback("Missing parameters", null);
        return;
    }

    if (!API_KEY) {
      callback("API key is missing", null);
      return;
    }

    const payload = Http_Query ? Http_Query : context;
    let parameters = querystring.parse(payload);

    if (!parameters.address) {
        callback('You must provide an address to geocode', undefined);
        return;
    } // if (!parameters.amount || !parameters.rate || !parameters.term) ...

    const ADDRESS = encodeURI(parameters.address);

    //const ADDRESS = encodeURIComponent('ACOSTA ÑU Y GENERAL DELGADO');
    request.get({ uri:  `${URL}?address=${ADDRESS}&key=${API_KEY}` })
    .then(data => { callback(undefined, data) })
    .catch(err => { callback(error, undefined) })
    ;
}
