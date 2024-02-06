import React from 'react';

const PaymentForm = () => {
  const sendJsonData = async () => {
    const jsonData = {

        merchant_id:3182319,
        order_id:9090,
        currency:INR,
        amount:6000.00,
        redirect_url:'http://localhost:3001/ccavResponse',
        cancel_url:'http://localhost:3001/ccavResponse',
        language:EN
      // ... other fields
    };

    try {
      console.log(jsonData);
      const response = await fetch('/ccavRequestHandler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        // Handle successful response if needed
        console.log('JSON data sent successfully');
      } else {
        // Handle error response
        console.error('Error sending JSON data');
      }
    } catch (error) {
      // Handle fetch error
      console.error('Fetch error:', error);
    }
  };

  return (
    <div>
      <button onClick={sendJsonData}>Checkout</button>
    </div>
  );
};

export default PaymentForm;
