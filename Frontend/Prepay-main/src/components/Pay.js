import React, { useEffect } from 'react';

const RazorpayPayment = () => {


  return (
    <div >
      <h1>PrepayQR charge</h1>
      <form>
      <body>
      <form><script src="https://cdn.razorpay.com/static/widget/subscription-button.js" data-subscription_button_id="pl_Pq9pCATyioax5B" data-button_theme="rzp-dark-standard" async> </script> </form>
      </body>
      </form>
    </div>
  );
};

export default RazorpayPayment;
