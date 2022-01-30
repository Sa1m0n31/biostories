const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

con.connect((err) => {
    /* Edit pages */
    router.post("/update", (request, response) => {
       const { termsOfService, privacyPolicy, complaints, returns, shippingAndPayment, aboutUs } = request.body;

       console.log(request.body);

       const values = [termsOfService, privacyPolicy, complaints, returns, shippingAndPayment, aboutUs];
       const query = 'UPDATE pages SET terms_of_service = ?, privacy_policy = ?, complaints = ?, returns = ?, shipping_and_payment = ?, about_us = ? WHERE id = 1';

       con.query(query, values, (err, res) => {
           console.log(err);
              if(res) {
                  response.send({
                      result: 1
                  });
              }
              else {
                  response.send({
                      result: 0
                  });
              }
       });
    });

    /* Get pages content */
    router.get("/content", (request, response) => {
       const query = 'SELECT * FROM pages';
       con.query(query, (err, res) => {
          response.send({
              result: res
          });
       });
    });
});

module.exports = router;
