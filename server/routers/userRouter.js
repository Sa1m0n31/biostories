const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const crypto = require("crypto");
const multer  = require('multer')
const upload = multer({ dest: 'media/fields' })

con.connect((err) => {
    /* GET LIST OF USERS */
    router.get("/get-all-users", (request, response) => {
        con.query(`SELECT * FROM users`, (err, res) => {
            response.send({
                result: res
            });
        })
    });

    /* GET LIST OF ADMINS */
    router.get("/get-all-admins", (request, response) => {
        con.query(`SELECT * FROM admins`, (err, res) => {
            response.send({
                result: res
            });
        })
    });

    /* GET USER DATA */
    router.post("/get-user", (request, response) => {
       const userId = request.body.id;
       const values = [userId];
       const query = 'SELECT * FROM users WHERE id = ?';

       con.query(query, values, (err, res) => {
           if(err) {
               console.log(err);
               response.send({
                   result: -1
               });
           }
           else {
               console.log(res);
               response.send({
                   result: res[0]
               });
           }
       })
    });

    /* UPDATE USER DATA */
    router.post("/update-user-data", (request, response) => {
       const { firstName, lastName, phoneNumber } = request.body;
       const email = request.user;
       const values = [firstName, lastName, phoneNumber, email];
       const query = 'UPDATE users SET first_name = ?, last_name = ?, phone_number = ? WHERE email = ?';
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

    router.post("/update-user-address", (request, response) => {
        const { postalCode, city, street, building, flat } = request.body;
        const email = request.user;
        const values = [postalCode, city, street, building, flat, email];
        const query = 'UPDATE users SET postal_code = ?, city = ?, street = ?, building = ?, flat = ? WHERE email = ?';
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

    /* DELETE ADMIN */
    router.post("/delete-admin", (request, response) => {
       const adminId = request.body.id;
       const values = [adminId];
       const query = 'DELETE FROM admins WHERE id = ?';

       con.query(query, values, (err, res) => {
           let result;
           if(err) result = 0;
           else result = 1;
           response.send({
               result
           });
       });
    });

    /* CHANGE ADMIN PASSWORD */
    router.post("/change-admin-password", (request, response) => {
        const { username, oldPassword, newPassword } = request.body;

        /* Check if old password is correct */
        const hash = crypto.createHash('md5').update(oldPassword).digest('hex');
        const query = 'SELECT id FROM admins WHERE username = ? AND password = ?';
        const values = [username, hash];
        con.query(query, values, (err, res) => {
           if(err) {
               response.send({
                   result: -1
               });
           }

           if(res[0]) {
               /* If correct - change it */
               const newHash = crypto.createHash('md5').update(newPassword).digest('hex');
               const query = 'UPDATE admins SET password = ? WHERE id = ?';
               const values = [newHash, res[0].id];
               con.query(query, values, (err, res) => {
                  response.send({
                      result: 1
                  });
               });
           }
           else {
               response.send({
                   result: 0
               });
           }
        });
    });

    /* CHANGE ADMIN PASSWORD */
    router.post("/change-user-password", (request, response) => {
        const { email, oldPassword, newPassword } = request.body;

        console.log(oldPassword);
        console.log(email);
        /* Check if old password is correct */
        const hash = crypto.createHash('md5').update(oldPassword).digest('hex');
        const query = 'SELECT id FROM users WHERE email = ? AND password = ?';
        const values = [email, hash];
        con.query(query, values, (err, res) => {
            if(err) {
                response.send({
                    result: -1
                });
            }

            if(res[0]) {
                /* If correct - change it */
                const newHash = crypto.createHash('md5').update(newPassword).digest('hex');
                const query = 'UPDATE users SET password = ? WHERE id = ?';
                const values = [newHash, res[0].id];
                con.query(query, values, (err, res) => {
                    response.send({
                        result: 1
                    });
                });
            }
            else {
                response.send({
                    result: 0
                });
            }
        });
    });

    router.get('/get-user-data', (request, response) => {
        const email = request.user;
        if(email) {
            const query = 'SELECT * FROM users WHERE email = ?';
            const values = [email];
            con.query(query, values, (err, res) => {
                if(res) {
                    response.send({
                        result: res[0]
                    });
                }
                else {
                    response.send({
                        result: 0
                    });
                }
            })
        }
        else {
            response.send({
                result: 0
            });
        }
    });

    /* GET USER ORDERS */
    router.post("/get-user-orders", (request, response) => {
        const email = request.body.user;
        const values = [email];
        console.log(email);
        const query = 'SELECT o.id as order_id, o.order_price, o.order_status FROM orders o JOIN sells s ON o.id = s.order_id JOIN users u ON o.user = u.id WHERE u.email = ? GROUP BY o.id';
        con.query(query, values, (err, res) => {
            console.log(err);
            if(res) {
                response.send({
                    result: res
                });
            }
            else {
                response.send({
                    result: 0
                });
            }
        });
    });

    router.post('/update-custom-fields', upload.fields([
        { name: 'img1', maxCount: 1 },
        { name: 'img2', maxCount: 1 },
        { name: 'img3', maxCount: 1 },
        { name: 'img4', maxCount: 1 },
        { name: 'img5', maxCount: 1 },
        { name: 'img6', maxCount: 1 },
        { name: 'img7', maxCount: 1 },
        { name: 'img8', maxCount: 1 }
    ]), (request, response) => {
        const files = request.files;
        const { article1, article2, article3 } =  request.body;

        console.log(article2);

        const queryImg1 = 'UPDATE custom_fields SET custom_value = ? WHERE custom_key = "image1"';
        const queryImg2 = 'UPDATE custom_fields SET custom_value = ? WHERE custom_key = "image2"';
        const queryImg3 = 'UPDATE custom_fields SET custom_value = ? WHERE custom_key = "image3"';
        const queryImg4 = 'UPDATE custom_fields SET custom_value = ? WHERE custom_key = "image4"';
        const queryImg5 = 'UPDATE custom_fields SET custom_value = ? WHERE custom_key = "image5"';
        const queryImg6 = 'UPDATE custom_fields SET custom_value = ? WHERE custom_key = "image6"';
        const queryImg7 = 'UPDATE custom_fields SET custom_value = ? WHERE custom_key = "image7"';
        const queryImg8 = 'UPDATE custom_fields SET custom_value = ? WHERE custom_key = "image8"';

        const query1 = 'UPDATE custom_fields SET custom_value = ? WHERE custom_key = "article1"';
        const query2 = 'UPDATE custom_fields SET custom_value = ? WHERE custom_key = "article2"';
        const query3 = 'UPDATE custom_fields SET custom_value = ? WHERE custom_key = "article3"';

        if(files.img1) con.query(queryImg1, [files.img1[0].filename]);
        if(files.img2) con.query(queryImg2, [files.img2[0].filename]);
        if(files.img3) con.query(queryImg3, [files.img3[0].filename]);
        if(files.img4) con.query(queryImg4, [files.img4[0].filename]);
        if(files.img5) con.query(queryImg5, [files.img5[0].filename]);
        if(files.img6) con.query(queryImg6, [files.img6[0].filename]);
        if(files.img7) con.query(queryImg7, [files.img7[0].filename]);
        if(files.img8) con.query(queryImg8, [files.img8[0].filename]);
        if(article1) con.query(query1, [article1]);
        if(article2) con.query(query2, [article2]);
        if(article3) con.query(query3, [article3]);

        response.send({
            result: 1
        });
    });

    router.get('/get-custom-fields', (request, response) => {
       const query = 'SELECT * FROM custom_fields';

        con.query(query, (err, res) => {
            if(res) {
                response.send({
                    result: res
                });
            }
            else {
                response.send({
                    result: 0
                });
            }
        });
    });
});

module.exports = router;
