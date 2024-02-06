const express = require("express")
const cors = require("cors")
const app = express()
const url = require('url');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
const bodyParser = require('body-parser');
const fs = require('fs');
var ccav = require('./ccavutil.js');
var crypto = require('crypto');

app.use(bodyParser.json());
ccavReqHandler = require('./src/ccavRequestHandler.js');
ccavResHandler = require('./src/ccavResponseHandler.js');

// app.use()


app.get("/", cors(), (req, res) => {

})


app.post("/ccavRequestHandler", async (req, res) => {
    var jsonData = req.body;
    console.log(jsonData);
    const { merchant_id, order_id, currency, amount, redirect_url, cancel_url, language = 'EN' } = req.body;
    const payment = `merchant_id=${merchant_id}&order_id=${order_id}&currency=${currency}&amount=${amount}&redirect_url=${redirect_url}&cancel_url=${cancel_url}&language=${language}`;
    console.log(payment);

    try {
        var body = '';
        var workingKey = '83C3CBE7B2F113911CD116FE1E27EAED'; // Put in the 32-Bit key shared by CCAvenues.
        var accessCode = 'AVCN54LB03AB47NCBA'; // Put in the Access Code shared by CCAvenues.
        var encRequest = '';
        var formbody = '';

        var md5 = crypto.createHash('md5').update(workingKey).digest();
        var keyBase64 = Buffer.from(md5).toString('base64');
        var ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]).toString('base64');
        // var jsonData = JSON.parse(body);

        var jsonString = JSON.stringify(jsonData);
        console.log('jsondata:', jsonString)

        encRequest = ccav.encrypt(payment, keyBase64, ivBase64);
        console.log(encRequest);
        res.send(encRequest);

        // formbody = '<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';

        // Respond to the client with the new HTML form
        // res.writeHeader(200, { "Content-Type": "text/html" });
        // res.write(formbody);
        // res.end();
        // const url = ('https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&Merchant_Id=${merchant_id}&encRequest=${encRequest}');

        const redirectUrl = url.format({
            protocol: 'https',
            host: 'test.ccavenue.com',
            pathname: '/transaction/transaction.do',
            query: {
                command: 'initiateTransaction',
                Merchant_Id: merchant_id,
                encRequest: encRequest,
            },
        });


        console.log(redirectUrl);

        // Redirect the user to the CCAvenue URL
        try {
            // Your existing code...

            // Instead of redirecting from client-side, redirect from server-side
            res.status(302).redirect(redirectUrl); // 302 Found: Redirect
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Internal Server Error' }); // Handle errors properly
        }





    }
    catch (e) {
        console.log(e);
        // res.json("fail")
    }

})


app.post('/ccavResponseHandler', function (request, response) {
    ccavResHandler.postRes(request, response);
})


app.listen(8000, () => {
    console.log("port connected");
})