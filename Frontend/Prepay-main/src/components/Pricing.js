import React from 'react';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Terms and Conditions
        </h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              1. Service Scope
            </h2>
            <p className="text-gray-600 leading-relaxed">
              PrepayQR provides QR stands exclusively for UPI IDs. We do not
              offer any banking services and are not affiliated with NPCI
              (National Payments Corporation of India) or the BHIM application.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              2. Subscription Fee
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We charge a subscription fee for access to the PrepayQR Smart
              Calculator app and Dynamic QR Generator features. The subscription
              fee is mandatory to use these advanced functionalities.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              3. Cashback and Bonuses
            </h2>
            <p className="text-gray-600 leading-relaxed">
              PrepayQR does not guarantee any cashback or bonuses. Such offers,
              if available, are subject to change at the company’s discretion
              without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              4. Non-Refundable Subscription
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The subscription amount is non-refundable under any circumstances.
              Users are advised to review the terms before making a payment.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              5. Autopay Settings
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Users have the option to disable the Autopay feature in their UPI
              application to avoid automatic renewals of the subscription.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
          
               Email: prepayqr@gmail.com
            </p>
           

          </section>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            By using PrepayQR services, you agree to these terms and conditions.
            These terms may be updated periodically, and it is the user’s
            responsibility to review them regularly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
