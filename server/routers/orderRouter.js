const express = require("express");
const router = express.Router();
const got = require("got");
const con = require("../databaseConnection");
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

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

const sendStatus3Email = (id, email, fullName, response = null) => {
    /* status = ZREALIZOWANE */
    let mailOptions = {
        from: {
            name: 'BIO STORIES',
            address: process.env.MAIL
        },
        to: email,
        subject: `Zmiana statusu zamówienia #${id.substring(0, 6)}: zamówienie zrealizowane`,
        html: `<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;700;1,300&display=swap" rel="stylesheet">
</head>
<body>
<main style="width: 100%;">
    <table style="display: block; padding: 20px; max-width: 100%; width: 800px; background: #250C37; margin-top: -5px; color: #fff; font-weight: 300; font-family: 'Open Sans', sans-serif;">
        <thead>
            <tr>
               <th style="font-weight: 300; display: block; margin-top: 20px; text-align: left;">
                   Dzień dobry, ${fullName}
               </th>
            </tr>
            <tr>
                <th style="font-weight: 700; display: block; margin: 30px 0; text-align: left">
                    Twoje zamówienie #${id.substring(0,6)} zostało zrealizowane!
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    Paczka jest gotowa do wysyłki i oczekuje na kuriera!
                    Informacje o etapach dostarczenia przesyłki dostaniesz bezpośrednio od przewoźnika na adres mailowy podany przy zamówieniu.
                </td>
            </tr>
        </tbody>
        <tfoot style="display: block; border-top: 2px solid #fff; margin: 20px auto;">
            <tr>
                <td style="display: block; margin-top: 20px;">
                    Pozdrawiamy
                </td>
            </tr>
            <tr>
                <td>
                    Zespół BIO STORIES
                </td>
            </tr>
            <tr>
                <td>
                    <a style="color: #fff; display: block; margin-top: 20px; text-decoration: none;" href="https://biostories.pl">
                        biostories.pl
                    </a>
                </td>
            </tr>
            <tr>
                <td>
                    <a style="color: #fff; text-decoration: none;" href="mailto:biuro@biostories.pl">
                        biuro@biostories.pl
                    </a>
                </td>
            </tr>
        </tfoot>
    </table>
</main>
</body>`
    }

    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            if(response) {
                response.send({
                    result: 0
                })
            }
        }
        else{
            if(response) {
                response.send({
                    result: 1
                })
            }
        }
    });
}

const sendStatus2Email = (id, email, fullName, response = null) => {
    /* status = PRZYJĘTE DO REALIZACJI */
    let mailOptions = {
        from: {
            name: 'BIO STORIES',
            address: process.env.MAIL
        },
        to: email,
        subject: `Zmiana statusu zamówienia #${id.substring(0,6)}`,
        html: `<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;700;1,300&display=swap" rel="stylesheet">
</head>
<body>
<main style="width: 100%;">
    <table style="display: block; padding: 20px; max-width: 100%; width: 800px; background: #250C37; margin-top: -5px; color: #fff; font-weight: 300; font-family: 'Open Sans', sans-serif;">
        <thead>
            <tr>
               <th style="font-weight: 300; display: block; margin-top: 20px; text-align: left;">
                   Dzień dobry, ${fullName}
               </th>
            </tr>
            <tr>
                <th style="font-weight: 700; display: block; margin: 30px 0; text-align: left">
                    Twoje zamówienie #${id} zmieniło status na <b>przyjęte do realizacji</b>!
                </th>
            </tr>
        </thead>
        <tbody style="display: block; width: 100%;">
            <tr>
                <td>
                    W przypadku pytań lub wątpliwości prosimy o kontakt pod adresem e-mail: <a href="mailto:biuro@biostories.pl" style="color: #fff; text-decoration: none;">biuro@biostories.pl</a>.
                </td>
            </tr>
            <tr style="display: block; width: 100%;">
                <td style="display: block; margin-top: 20px; font-weight: 700; font-size: 17px; width: 100%; text-align: center;">
                    O następnych etapach realizacji zamówienia poinformujemy Cię w kolejnym mailu.
                </td>
            </tr>
        </tbody>
        <tfoot style="display: block; border-top: 2px solid #fff; margin: 20px auto;">
            <tr>
                <td style="display: block; margin-top: 20px;">
                    Pozdrawiamy
                </td>
            </tr>
            <tr>
                <td>
                    Zespół Biostories
                </td>
            </tr>
            <tr>
                <td>
                    <a style="color: #fff; display: block; margin-top: 20px; text-decoration: none;" href="https://biostories.pl">
                        biostries.pl
                    </a>
                </td>
            </tr>
            <tr>
                <td>
                    <a style="color: #fff; text-decoration: none;" href="mailto:biuro@biostories.pl">
                        biuro@biostories.pl
                    </a>
                </td>
            </tr>
        </tfoot>
    </table>
</main>
</body>`
    }

    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            if(response) {
                response.send({
                    result: 0
                })
            }
        }
        else{
            if(response) {
                response.send({
                    result: 1
                })
            }
        }
    });
}

const sendStatus1Email = (orderInfo, response = null) => {
    let sells = ``;
    let sum = 0, price = 0;
    for(let i=0; i<orderInfo.length; i++) {
        if(orderInfo[i].attribute_price) price = orderInfo[i].attribute_price;
        else price = orderInfo[i].price;
        sells += `<span>
            <tr style="padding-top: 10px;">
            <td style="padding: 30px 0 20px; white-space: nowrap;">
                <img style="width: 100px; margin: 0;" src="https://biostories.skylo-test3.pl/image?url=/media/products/${orderInfo[i].main_image}" alt={${orderInfo[i].name}} />
            </td>
            <td style="white-space: nowrap; font-size: 21px; font-weight: 300; display: block; margin-left: -80%; margin-top: 30px;">
                ${orderInfo[i].name}
            </td>
                <td></td>
                <td></td>
        </tr>
        <tr>
            <td style="white-space: nowrap; font-weight: 700; font-size: 15px; text-align: center; display: inline-block; width: 15%; margin-top: 15px;">
                <span style="display: block; text-align: center; font-size: 13px; font-weight: 300; padding-bottom: 8px;">
                    #${i+1}
                </span>
            </td>
             <td style="font-weight: 700; white-space: nowrap; font-size: 15px; text-align: center; width: 15%;">
                <span style="display: block; text-align: center; font-size: 13px; font-weight: 300; padding-bottom: 8px;">
                    Ilość
                </span>
                <span style="font-weight: 400;">
                    ${orderInfo[i].quantity}
                </span>
            </td>
             <td style="font-weight: 700; font-size: 15px; white-space: nowrap; text-align: center;  width: 15%;">
                <span style="display: block; text-align: center; font-size: 13px; font-weight: 300; padding-bottom: 8px;">
                    Cena
                </span>
                <span style="font-weight: 400;">
                    ${price} PLN
                </span>
            </td>
             <td style="font-weight: 700; font-size: 15px; white-space: nowrap; text-align: center;  width: 15%;">
                <span style="display: block; text-align: center; font-size: 13px; font-weight: 300; padding-bottom: 8px;">
                    Wartość
                </span>
                <span style="font-weight: 400;">
                    ${price * orderInfo[i].quantity} PLN
                </span>
            </td>
        </tr>
        </span>`;

        sum += parseInt(orderInfo[i].quantity) * parseFloat(price);
    }

    let discount = sum + parseFloat(orderInfo[0].shipping_method_price) - parseFloat(orderInfo[0].order_price);
    const address = orderInfo[0].building.toString() + (orderInfo[0].flat ? "/" + orderInfo[0].flat : "");
    // const vat = orderInfo[0].company_name ? `${orderInfo[0].company_name}<br/>${orderInfo[0].nip}` : "Nie dotyczy";
    const inPost = orderInfo[0].shipping_method === 'Paczkomaty InPost' ? `${orderInfo[0].inpost_address}<br/>${orderInfo[0].inpost_postal_code} ${orderInfo[0].inpost_city}` : "Nie dotyczy";

    /* status = ZŁOŻONE */
    let mailOptions = {
    from: {
        name: 'BIO STORIES',
        address: process.env.MAIL
    },
    to: orderInfo[0].email,
    subject: 'Witaj, Dziękujemy za złożenie zamówienia w sklepie BIO STORIES',
    // attachments: [
    //     {
    //         filename: 'formularz-zwrotu-towaru-hideisland.pdf',
    //         path: __dirname + '/formularz-zwrotu-towaru-hideisland.pdf'
    //     }
    // ],
    html: `<head>
    <meta charSet="UTF-8">
    <title>Title</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;700;1,300&display=swap"
          rel="stylesheet">
</head>
<body>
<main style="width: 100%;">
    <table
            style="display: block; padding: 20px; max-width: 100%; width: 800px; background: #250C37; margin-top: -5px; color: #fff; font-weight: 300; font-family: 'Open Sans', sans-serif;">
        <thead style="display: block;">
        <tr style="display: block;">
            <th style="font-weight: 300; font-size: 21px; display: block; margin-top: 20px; text-align: center;">
                Dziękujemy za zamówienie w sklepie BIO STORIES
            </th>
        </tr>
        <tr style="display: block;">
            <th style="font-weight: 300; display: block; font-size: 21px; text-align: center;">
                Poniżej znajdują się szczegóły Twojego zamówienia.
            </th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td style="display: block; margin-top: 25px; font-weight: 700;">
                Kupione przedmioty:
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        ${sells}
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr style="display: block; margin-top: 15px;">
            <td style="font-size: 14px; width: 150px; white-space: nowrap;">
                Wartość produktów:
            </td>
            <td style="font-size: 14px; white-space: nowrap;">
                ${sum.toFixed(2)} PLN
            </td>
        </tr>
        <tr style="display: block; margin-top: 5px;">
            <td style="font-size: 14px; width: 150px; white-space: nowrap;">
                Rabat - kod rabatowy:
            </td>
            <td style="font-size: 14px; white-space: nowrap;">
                ${(discount * -1).toFixed(2)} PLN
            </td>
        </tr>
        <tr style="display: block; margin-top: 5px;">
            <td style="font-size: 14px; width: 150px; white-space: nowrap;">
                Koszt dostawy:
            </td>
            <td style="font-size: 14px; white-space: nowrap;">
                ${orderInfo[0].shipping_method_price} PLN
            </td>
        </tr>
        <tr style="display: block; margin-top: 5px; border-bottom: 3px solid #fff; padding-bottom: 15px;">
            <td style="font-weight: 700; font-size: 15px; width: 150px; white-space: nowrap;">
                Razem
            </td>
            <td style="font-weight: 700; font-size: 15px; white-space: nowrap;">
                ${orderInfo[0].order_price} PLN
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr>
            <td colSpan="5" style="font-size: 14px;">
                Drogi kliencie, realizacja Twojego zamówienia #${orderInfo[0].id.substring(0,6)} rozpocznie się po zaksięgowaniu płatności na
                naszym koncie. W następnych mailach będziemy Cię informować o kolejnych etapach zamówienia.
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr>
            <td style="font-size: 14px; font-weight: 700;">
                Odstąpienie od umowy
            </td>
        </tr>
        <tr>
            <td colSpan="5" style="font-size: 14px;">
                Czas odstąpienia od umowy to 14 dni. Nie musisz podawać przyczyny i ponosić kosztów za odstąpienie od
                umowy poza kosztem przesyłki. Wystarczy, że w w/w terminie wyślesz stosowne oświadczenie o odstąpieniu
                np. wypełniając formularz, który znajduje się w treści tego maila jako załącznik oraz, który jest
                dostępny na naszej stronie internetowej w zakładce "Reklamacje i zwroty", a następnie odeślesz go nam
                wraz z produktem. Pragniemy zaznaczyć, iż bezpośredni koszt zwrotu produktu leży po Twojej stronie.
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr>
            <td colSpan="5" style="text-align: center; font-size: 14px; font-weight: 700;">
                Zwroty i reklamacje prosimy wysyłać na adres:
            </td>
        </tr>
        <tr>
            <td colSpan="5" style="text-align: center; font-size: 14px;">
                ul. Pocztowa 4
            </td>
        </tr>
        <tr>
            <td colSpan="5" style="text-align: center; font-size: 14px;">
                59-100 Polkowice
            </td>
        </tr>
        </tbody>
        <tfoot style="display: block; border-top: 2px solid #fff; margin: 20px auto;">
        <tr>
            <td style="display: block; margin-top: 20px;">
                Pozdrawiamy
            </td>
        </tr>
        <tr>
            <td>
                Zespół BIO STORIES
            </td>
        </tr>
        <tr>
            <td>
                <a style="color: #fff; display: block; margin-top: 20px; text-decoration: none;"
                   href="https://biostories.pl">
                    biostories.pl
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a style="color: #fff; text-decoration: none;" href="mailto:biuro@biostories.pl">
                    biuro@biostories.pl
                </a>
            </td>
        </tr>
        </tfoot>
    </table>
</main>
</body>
`
    }

    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            if(response) {
                response.send({
                    result: 0
                })
            }
        }
        else{
            if(response) {
                response.send({
                    result: 1
                })
            }
        }
    });
}

con.connect(err => {
    router.post("/send-order-info", (request, response) => {
        const { orderId } = request.body;

        const query = `SELECT o.id, av.price as attribute_price, av.value, av.stock, o.order_price, o.discount, o.payment_status, o.order_status, o.first_name, o.last_name, o.email, o.phone_number, o.city, o.street, o.building, o.flat, o.postal_code, o.city, o.date, o.order_status, pm.name as payment, sm.name as shipping, sm.price as shipping_method_price, o.company_name, o.nip, s.attribute_name, s.attribute_value, s.quantity, p.price, p.name, p.main_image, o.inpost_id, o.inpost_address, o.inpost_postal_code, o.inpost_city FROM orders o
JOIN sells s ON o.id = s.order_id
LEFT OUTER JOIN products p ON p.id = s.product_id
LEFT OUTER JOIN products_attributes pa ON p.id = pa.product
LEFT OUTER JOIN attributes_values av ON av.value = s.attribute_value AND av.attribute = pa.id
JOIN shipping_methods sm ON o.shipping_method = sm.id
JOIN payment_methods pm ON o.payment_method = pm.id 
WHERE o.id = ?`;
        const values = [orderId];

        con.query(query, values, (err, res) => {
           if(res) {
               sendStatus1Email(res, response);
           }
           else {
               response.send({
                   result: 0
               });
           }
        });
    });

    /* GET ALL ORDERS */
    router.get("/get-orders", (request, response) => {
        const query = 'SELECT id, first_name, last_name, email, date, payment_status, order_status, order_price FROM orders';
        con.query(query, (err, res) => {
            if (res) {
                response.send({
                    result: res
                });
            } else {
                response.send({
                    result: []
                });
            }
        });
    });

    const decrementStock = (productId, attributeName, attributeValue, quantity) => {
        let query = '', values = [];
        if(attributeName) {
            query = 'UPDATE attributes_values av JOIN products_attributes pa ON pa.id = av.attribute SET av.stock = av.stock - ? WHERE av.value = ? AND pa.name = ?'
            values = [quantity, attributeValue, attributeName];
        }
        else {
            query = 'UPDATE products SET stock = stock - ? WHERE id = ?'
            values = [quantity, productId];
        }
        con.query(query, values, (err, res) => {
            console.log(err);
            console.log(res);
        });
    }

    /* ADD SELL */
    router.post("/add-sell", (request, response) => {
        let {productId, orderId, quantity, attributeName, attributeValue, paymentMethod} = request.body;

        const sellId = uuidv4();
        const values = [sellId, orderId, productId, quantity, attributeName, attributeValue];
        const query = 'INSERT INTO sells VALUES (?, ?, ?, ?, ?, ?)';

        console.log(attributeName);
        if(attributeName) decrementStock(productId, attributeName, attributeValue, quantity);
        else decrementStock(productId, null, null, quantity);

        con.query(query, values, (err, res) => {
            if (res) {
                response.send({
                    result: sellId
                });
            } else {
                response.send({
                    result: null
                });
            }
        });
    });

    /* ADD ORDER */
    router.post("/add", (request, response) => {
        let {paymentMethod, shippingMethod, firstName, lastName, email, phoneNumber, city, street, building, flat, postalCode, sessionId, user, companyName, nip, amount, inPostName, inPostAddress, inPostCode, inPostCity, discount} = request.body;
        if(flat === "") flat = null;

        let paymentStatus = "nieopłacone";
        if(paymentMethod === 3) {
            paymentStatus = "za pobraniem";
        }
        else if(paymentMethod === 2) {
            paymentStatus = 'przelew tradycyjny';
        }

        const orderId = uuidv4();
        let values = [orderId, paymentMethod, shippingMethod, firstName,
            lastName, email, phoneNumber, city, street, building,
            flat, postalCode, user, paymentStatus, sessionId, companyName, nip, amount,
            inPostName, inPostAddress, inPostCode, inPostCity, discount];
        const query = 'INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "złożone", CURRENT_TIMESTAMP, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        values = values.map((item) => {
            if (item === "") return null;
            else return item;
        });

        con.query(query, values, (err, res) => {
            let result = 0;
            if (res) {
                result = orderId
            }
            response.send({
                result
            });
        });
    });

    /* CHANGE PAYMENT STATUS */
    router.post("/change-payment-status", (request, response) => {
        const {id, status} = request.body;
        const values = [status, id];
        const query = 'UPDATE orders SET payment_status = ? WHERE id = ?';
        con.query(query, values, (err, res) => {
            let result = 0;
            if (res) result = 1;
            response.send({
                result
            });
        });
    });

    /* CHANGE ORDER STATUS */
    router.post("/change-order-status", (request, response) => {
        const {id, orderStatus } = request.body;

        console.log(id + '!!!!!!!!!!!!!!!');

        /* Change order status in database */
        const query = 'UPDATE orders SET order_status = ? WHERE id = ?';
        const values = [orderStatus, id];
        con.query(query, values, (err, res) => {
            if(res) {
                /* Get order info */
                const query = 'SELECT * FROM orders o WHERE o.id = ?';
                const values = [id];

                con.query(query, values, (err, res) => {
                   if(res) {
                       const firstName = res[0].first_name;
                       const lastName = res[0].last_name;
                       const email = res[0].email;
                       const fullName = firstName + " " + lastName;
                       /* Send email based on order status */
                       if(orderStatus === "przyjęte do realizacji") {
                           sendStatus2Email(id, email, fullName, response);
                       }
                       else if(orderStatus === "zrealizowane") {
                           sendStatus3Email(id, email, fullName, response);
                       }
                       else {
                           response.send({
                               result: 1
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
        });
    });

    /* REMOVE ORDER */
    router.post("/delete", (request, response) => {
        const {id} = request.body;
        const values = [id];
        const query = 'DELETE FROM orders WHERE id = ?';
        con.query(query, values, (err, res) => {
            let result = 0;
            if (res) result = 1;
            response.send({
                result
            });
        });
    });

    /* GET ORDER DETAILS */
    router.post("/get-order", (request, response) => {
        const {id} = request.body;
        const values = [id];
        const query = `SELECT o.id, av.price as attribute_price, av.value, av.stock, o.order_price, o.discount, o.payment_status, o.order_status, o.first_name, o.last_name, o.email, o.phone_number, o.city, o.street, o.building, o.flat, o.postal_code, o.city, o.date, o.order_status, pm.name as payment, sm.name as shipping, o.company_name, o.nip, s.attribute_name, s.attribute_value, s.quantity, p.price, p.name, p.main_image, o.inpost_id, o.inpost_address, o.inpost_postal_code, inpost_city FROM orders o
JOIN sells s ON o.id = s.order_id
LEFT OUTER JOIN products p ON p.id = s.product_id
LEFT OUTER JOIN products_attributes pa ON p.id = pa.product
LEFT OUTER JOIN attributes_values av ON av.value = s.attribute_value AND av.attribute = pa.id
JOIN shipping_methods sm ON o.shipping_method = sm.id
JOIN payment_methods pm ON o.payment_method = pm.id 
WHERE o.id = ?`
        con.query(query, values, (err, res) => {
            console.log(res);
            console.log(err);
            if(res) {
                response.send({
                    result: res
                });
            } else {
                response.send({
                    result: null
                });
            }
        });
    });

    router.post("/pay-order", (request, response) => {
        const { pay, id } = request.body;

        console.log(pay);
        console.log(id);

        let query;
        const values = [id];
        if(parseInt(pay) === 1) {
            query = `UPDATE orders SET payment_status = 'opłacone' WHERE id = ?`;
        }
        else {
            query = `UPDATE orders SET payment_status = 'nieopłacone' WHERE id = ?`;
        }
        con.query(query, values, (err, res) => {
            console.log(err);
            console.log(res);
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
});

module.exports = router;
