const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

con.connect(err => {
    /* Nodemailer */
    let transporter = nodemailer.createTransport(smtpTransport ({
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASSWORD
        },
        host: process.env.HOST,
        secureConnection: true,
        port: 465,
        tls: {
            rejectUnauthorized: false
        },
    }));

    /* ADD NOTIFICATION */
    router.post("/add", (request, response) => {
       const { productId, email } = request.body;

       const values = [productId, email];
       const query = 'INSERT INTO notifications VALUES (NULL, ?, ?)';
       con.query(query, values, (err, res) => {
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

    const convertToURL = (str) => {
        if(str) return str.toLowerCase()
            .replace(/ /g, "-")
            .replace(/ą/g, "a")
            .replace(/ć/g, "c")
            .replace(/ę/g, "e")
            .replace(/ł/g, "l")
            .replace(/ń/g, "n")
            .replace(/ó/g, "o")
            .replace(/ś/g, "s")
            .replace(/ź/g, "z")
            .replace(/ż/g, "z")
        else return "";
    }

    const sendStatus1Email = (email) => {
        /* status = ZŁOŻONE */
    }

    const sendStatus2Email = (email) => {
        /* status = PRZYJĘTE DO REALIZACJI */
    }

    const sendMail = (email, productName) => {
        const productURL = convertToURL(productName);

        let mailOptions = {
            from: process.env.MAIL,
            to: email,
            subject: 'Produkt, którego szukałeś, jest już dostępny w naszym sklepie!',
            html: `<main>
                <section style="background: #fff; padding: 30px; max-width: 900px; box-sizing: border-box;">
                    <h1 class="notification__header" style="margin: 0 0 20px; font-weight: 900; font-size: 1.5rem; color: #000;">
                        Twój ulubiony produkt już na Ciebie czeka!
                    </h1>

                    <a style="display: inline-block; background: #361D48; border-radius: 40px; height: 40px; line-height: 40px; text-decoration: none;font-size: 15px; font-weight: 700; color: #fff; padding: 5px 20px; margin: 20px 0;" 
                        href="${process.env.API_URL}/produkt/${productURL}">
                        Kliknij tutaj, aby przejść do sklepu
                    </a>
                    
                    <p style="color: #000; margin-top: 30px; margin-bottom: 0;">
                        Pozdrawiamy,
                    </p>
                    <p style="color: #000; margin-top: 0;">
                        Zespół BIO STORIES
                    </p>
                </section>
            </main>`
        }

        transporter.sendMail(mailOptions, function(error, info){
            if(error) {
                console.log(error);
            }else{
                console.log("success");
            }
        });
    }

    /* CHECK NOTIFICATIONS AFTER PRODUCT STOCK MODIFICATION */
    router.post("/check-notifications", (request, response) => {
       const { productId } = request.body;

       /* 1. Check if product has more than 0 stock */
       const query1 = 'SELECT av.stock FROM attributes_values av JOIN products_attributes pa ON av.attribute = pa.id JOIN products p ON p.id = pa.product WHERE p.id = ?';
       const values1 = [productId];
       con.query(query1, values1, (err, res) => {
            if(res) {
                if(res[0]) {
                    const values2 = [productId];
                    const query2 = 'SELECT n.email, p.name FROM notifications n JOIN products p ON n.product_id = p.id WHERE product_id = ?';

                    con.query(query2, values2, (err, res) => {
                       if(res) {
                           if(res.length) {
                               res.forEach((item, index, array) => {
                                   sendMail(item.email, item.name);

                                   if(index === array.length-1) {
                                       /* Remove all notifications rows */
                                       const values3 = [productId];
                                       const query3 = 'DELETE FROM notifications WHERE product_id = ?';
                                       con.query(query3, values3, (err, res) => {
                                           response.send({
                                               result: 1
                                           });
                                       });
                                   }
                               });
                           }
                           else {
                               response.send({
                                   result: 1
                               });
                           }
                       }
                       else {
                           response.send({
                               result: 1
                           });
                       }
                    });
                }
                else {
                    const query = 'SELECT stock FROM products WHERE id = ?';
                    const values = [productId];

                    con.query(query, values, (err, res) => {
                        if(res) {
                            if(res[0]) {
                                const values2 = [productId];
                                const query2 = 'SELECT n.email, p.name FROM notifications n JOIN products p ON n.product_id = p.id WHERE product_id = ?';

                                con.query(query2, values2, (err, res) => {
                                    console.log(res);
                                    console.log(err);
                                    if(res) {
                                        if(res.length) {
                                            res.forEach((item, index, array) => {
                                                sendMail(item.email, item.name);

                                                if(index === array.length-1) {
                                                    /* Remove all notifications rows */
                                                    const values3 = [productId];
                                                    const query3 = 'DELETE FROM notifications WHERE product_id = ?';
                                                    con.query(query3, values3, (err, res) => {
                                                        response.send({
                                                            result: 1
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                        else {
                                            response.send({
                                                result: 1
                                            });
                                        }
                                    }
                                    else {
                                        response.send({
                                            result: 1
                                        });
                                    }
                                });
                            }
                            else {
                                response.send({
                                    result: 1
                                });
                            }
                        }
                        else {
                            response.send({
                                result: 1
                            });
                        }
                    });

                }
            }
            else {
                response.send({
                    result: 1
                });
            }
       });
    });
});

module.exports = router;
