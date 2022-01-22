const express = require("express");
const crypto = require("crypto");
const passport = require("passport");
const got = require("got");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
require('../passport')(passport);
const con = require("../databaseConnection");
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

con.connect(function(err) {
    /* ADD USER */
    router.post("/add-user", (request, response) => {
       const { firstName, lastName, email, phoneNumber, password, postalCode, city, street, building, flat, newsletter } = request.body;

       let hash = null;
       if(password) hash = crypto.createHash('md5').update(password).digest('hex');

       const values = [firstName, lastName, email, hash, city, street, building, flat ? flat : null, postalCode, phoneNumber];
       const query = 'INSERT INTO users VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
       con.query(query, values, (err, res) => {
           console.log(err);
          if(err) {
              if(err.errno === 1062) {
                  /* User already exists */

                  /* Check if account exists */
                  const values = [email, email];
                  const query = 'SELECT id, (SELECT id FROM users WHERE email = ? AND password IS NOT NULL) as userId FROM users WHERE email = ?';
                  con.query(query, values, (err, res) => {
                      if(res) {
                          if(res[0].userId) {
                            /* Account exists */
                            response.send({
                                result: -1
                            });
                          }
                          else {
                              /* It's not an account, but send back already existed data - UPDATE */
                              const userId = res[0].id;
                              const values = [firstName, lastName, city, street, building, flat, postalCode, phoneNumber, email];
                              const query = 'UPDATE users SET first_name = ?, last_name = ?, city = ?, street = ?, building = ?, flat = ?, postal_code = ?, phone_number = ? WHERE email = ?';
                              con.query(query, values, (err, res) => {
                                  if(newsletter) {
                                      got.post("https://hideisland.pl/newsletter/add", {
                                          json: {
                                              email: email
                                          },
                                          responseType: 'json',
                                      })
                                          .then(res => {
                                              response.send({
                                                  result: 1,
                                                  userId
                                              });
                                          });
                                  }
                                  else {
                                      response.send({
                                          result: 1,
                                          userId
                                      });
                                  }
                              });
                          }
                      }
                      else {
                        response.send({
                            result: 0
                        });
                      }
                  });
              }
              else {
                  response.send({
                      result: 0
                  });
              }
          }
          else {
              const userId = res.insertId;
              /* Add user to newsletter */
              if(newsletter) {
                  got.post("https://hideisland.pl/newsletter/add", {
                      json: {
                          email: email
                      },
                      responseType: 'json',
                  })
                      .then(res => {
                         response.send({
                             result: 1,
                             userId
                         });
                      });
              }
              else {
                  response.send({
                      result: 1,
                      userId
                  });
              }
          }
       });
    });

   /* REGISTER USER */
   router.post("/register-user", (request, response) => {
       const username = request.body.username;
       const email = request.body.email;
       const password = request.body.password;
       const hash = crypto.createHash('md5').update(password).digest('hex');

       const values = [email, username, hash];
       const query = 'INSERT INTO users VALUES (NULL, NULL, NULL, ?, ?, ?, NULL, NULL, NULL, NULL, NULL, NULL)'

       con.query(query, values, (err, res) => {
          if(err) {
              /* Error - user not registered */
              let error;
              if(err.errno === 1062) error = 0;
              else error = -1;
              response.send({
                  result: error
              });
          }
          else {
              /* Success - user registered */
              response.send({
                  result: 1
              });
          }
       });

   });

   /* REGISTER ADMIN */
   router.post("/register-admin", (request, response) => {
       const username = request.body.username;
       const email = request.body.email;
       const password = request.body.password;
       const hash = crypto.createHash('md5').update(password).digest('hex');

       const values = [username, hash, email];
       const query = 'INSERT INTO admins VALUES (NULL, ?, ?, ?)';

       con.query(query, values, (err, res) => {
           if(err) {
               /* Error - user not registered */
               let error;
               if(err.errno === 1062) error = 0;
               else error = -1;
               response.send({
                   result: error
               });
           }
           else {
               /* Success - user registered */
               response.send({
                   result: 1
               });
           }
       });
   });

    router.get("/auth", (request, response) => {
        if(request.user) {
            if(isNumeric(request.user.toString())) {
                /* Admin */
                response.send({result: 2});
            }
            else {
                /* User */
                response.send({result: 1});
            }
        }
        else response.send({ result: 0 });
    });

   /* LOGIN USER */
    router.post("/login-user",
        passport.authenticate('user-local', { session: true, failureFlash: true, failureRedirect: '/auth/failure' }),
            (request, response) => {
                response.send({
                    result: 1
                });
            }
    );

    router.get('/failure', (request, response) => {
        const errorMsg = request.flash().error[0];
        response.send({
            result: 0,
            msg: errorMsg
        });
    });

    /* LOGIN ADMIN */
    router.post("/admin",
        passport.authenticate('admin-local', { session: true }),
        (request, response) => {
            response.send({
                result: 1
            });
        });
});

module.exports = router;
