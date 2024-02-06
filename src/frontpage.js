import React, { useState } from 'react';
import axios from "axios"
var ccav = require('./ccavutil.js');
var crypto = require('crypto');



const PaymentForm = () => {
  const [formData, setFormData] = useState({
    merchant_id: '3182319',
    order_id: '9090',
    currency: 'INR',
    amount: '1.00',
    redirect_url: 'http://localhost:3001/ccavResponse',
    cancel_url: 'http://localhost:3001/ccavResponse',
    language: 'EN', // Default value
  });
  const payment = `merchant_id=${formData.merchant_id}&order_id=${formData.order_id}&currency=${formData.currency}&amount=${formData.amount}&redirect_url=${formData.redirect_url}&cancel_url=${formData.cancel_url}&language=${formData.language}`;

  console.log(payment);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendJsonData = async () => {
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


      encRequest = ccav.encrypt(payment, keyBase64, ivBase64);
      console.log(encRequest);


      if (encRequest) {
        console.log("redirecting now:");
        const merchant_id = formData.merchant_id;
        console.log(merchant_id);
        window.location.href = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&Merchant_Id=${merchant_id}&encRequest=${encRequest}`;

        setMessage('Payment request sent successfully');
      } else {
        // Handle error response
        setMessage('Error sending payment request');
        console.error('Error sending JSON data');
      }
    } catch (error) {
      // Handle fetch error
      setMessage('Error during fetch');
      console.error('Fetch error:', error);
    }
  };

  return (
    <div>
      <form>
        <label>
          Merchant ID:
          <input type="text" name="merchant_id" value={formData.merchant_id} onChange={handleChange} />
        </label>
        <br />

        <label>
          Order ID:
          <input type="text" name="order_id" value={formData.order_id} onChange={handleChange} />
        </label>
        <br />

        <label>
          Currency:
          <input type="text" name="currency" value={formData.currency} onChange={handleChange} />
        </label>
        <br />

        <label>
          Amount:
          <input type="text" name="amount" value={formData.amount} onChange={handleChange} />
        </label>
        <br />

        <label>
          Redirect URL:
          <input type="text" name="redirect_url" value={formData.redirect_url} onChange={handleChange} />
        </label>
        <br />

        <label>
          Cancel URL:
          <input type="text" name="cancel_url" value={formData.cancel_url} onChange={handleChange} />
        </label>
        <br />

        <label>
          Language:
          <input type="text" name="language" value={formData.language} onChange={handleChange} />
        </label>
        <br />
      </form>
      <button onClick={sendJsonData}>Checkout</button>
      <p>{message}</p>
    </div>
  );
};

export default PaymentForm;
