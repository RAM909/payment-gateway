var ccav = require('./ccavutil.js');
//    var crypto = require('crypto');
var qs = require('querystring');

exports.postReq = function (request, response) {
    var body = '';
    var workingKey = '83C3CBE7B2F113911CD116FE1E27EAED'; // Put in the 32-Bit key shared by CCAvenues.
    var accessCode = 'AVCN54LB03AB47NCBA'; // Put in the Access Code shared by CCAvenues.
    var encRequest = '';
    var formbody = '';

    // Generate Md5 hash for the key and then convert to base64 string
    var md5 = crypto.createHash('md5').update(workingKey).digest();
    var keyBase64 = Buffer.from(md5).toString('base64');

    // Initializing Vector and then convert to base64 string
    var ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]).toString('base64');



    var jsonData = request.body;
    console.log(jsonData);

    // Parse incoming JSON data
    var jsonData = JSON.parse(body);

    // Convert JSON data to a string for encryption
    var jsonString = JSON.stringify(jsonData);

    // Encrypt JSON data
    encRequest = ccav.encrypt(jsonString, keyBase64, ivBase64);
    console.log(encRequest);

    // Construct the new form for submission
    formbody = '<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';

    // Respond to the client with the new HTML form
    response.writeHeader(200, { "Content-Type": "text/html" });
    response.write(formbody);
    response.end();

    return;
};
