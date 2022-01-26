const express = require("express");
const router = express.Router();
const got = require("got");
const con = require("../databaseConnection");
const path = require("path");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')
const upload = multer({ dest: 'media/products' })

const util = require('util')

con.connect(err => {
   /* ADD CROSS-SELLS */
   const addCrossSells = (product1, product2) => {
      const values = [product1, product2];
      const query = 'INSERT INTO cross-sells VALUES (NULL, product1, product2)';
      con.query(query, values);
   }

   /* GET NEW ID */
   router.get("/last-product", (request, response) => {
      const query = 'SELECT id FROM products ORDER BY date DESC LIMIT 1';
      con.query(query, (err, res) => {
         if(res[0]) {
            response.send({
               result: res[0].id
            });
         }
         else {
            response.send({
               result: 0
            });
         }
      })
   });

   const addGallery = (gallery, id) => {
      gallery.forEach((item) => {
         const imageId = uuidv4();
         const values = [imageId, item.filename, id];
         const query = 'INSERT INTO images VALUES (?, ?, ?)';
         con.query(query, values);
      });
   }

   const addIcons = (icons, id) => {
      icons.forEach((item) => {
         const imageId = uuidv4();
         const values = [imageId, item.filename, id];
         const query = 'INSERT INTO icons VALUES (?, ?, ?)';
         con.query(query, values);
      });
   }

   const addCategories = (cat, id) => {
      cat.forEach((item) => {
         const values = [id, item.id];
         const query = 'INSERT INTO product_categories VALUES (NULL, ?, ?)';
         con.query(query, values);
      })
   }

   const addAttribute = (attr, val, id) => {
      const attributeId = uuidv4();
      const values = [attributeId, id, attr];
      const query = 'INSERT INTO products_attributes VALUES (?, ?, ?)';
      con.query(query, values, (err, res) => {
         addAttributeValues(val, attributeId);
      });
   }

   const addAttributeValues = (val, attributeId) => {
      val.forEach((item) => {
         const values = [attributeId, item];
         const query = 'INSERT INTO attributes_values VALUES (?, ?, 0)';
         con.query(query, values);
      });
   }

   /* ADD PRODUCT */
   router.post("/add-product", upload.fields([
      { name: 'gallery', maxCount: 10 },
      { name: 'icons', maxCount: 10 },
      { name: 'img', maxCount: 1 },
      { name: 'img2', maxCount: 1 },
      { name: 'img3', maxCount: 1 },
      { name: 'img4', maxCount: 1 },
      { name: 'img5', maxCount: 1 }
   ]), (request, response) => {
      const { title, subtitle, price, stock, attribute, attributeValues, categories,
            description, secondDescription, thirdDescription, fourthDescription, recommendation, top, hidden
      } = request.body;
      const files = request.files;
      const id = uuidv4();
      let img1 = null, img2 = null, img3 = null, img4 = null, img5 = null;
      if(files.img) img1 = files.img[0].filename;
      if(files.img2) img2 = files.img2[0].filename;
      if(files.img3) img3 = files.img3[0].filename;
      if(files.img4) img4 = files.img4[0].filename;
      if(files.img5) img5 = files.img5[0].filename;

      const values = [id, title, subtitle, price, stock, description, secondDescription, thirdDescription, fourthDescription,
         img1, img2, img3, img4, img5, recommendation ? 1 : 0, top ? 1 : 0, hidden ? 1 : 0
      ]
      const query = 'INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)';
      con.query(query, values, (err, res) => {
         if(res) {
            if(files.gallery) {
               addGallery(files.gallery, id);
            }
            if(files.icons) {
               addIcons(files.icons, id);
            }
            if(categories) {
               addCategories(JSON.parse(categories), id);
            }
            if(attribute) {
               addAttribute(attribute, attributeValues.split(','), id);
            }
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

   const updateImages = (images, id) => {

   }

   /* UPDATE PRODUCT */
   router.post("/update-product", upload.fields([{ name: 'gallery1', maxCount: 1 }, { name: 'gallery2', maxCount: 1 },
      { name: 'gallery3', maxCount: 1 },
      { name: 'gallery4', maxCount: 1 },
      { name: 'gallery5', maxCount: 1 }]), (request, response) => {
      let filenames = [];
      let categories = [];

      const images = request.files;

      /* Prepare */
      let { id, name, price, shortDescription, recommendation, hidden } = request.body;
      hidden = hidden === "hidden";
      recommendation = recommendation === "true";
      filenames.reverse();

      /* Get categories */
      Object.entries(request.body).forEach(item => {
         if(item[0].split("-")[0] === 'category') {
            if(item[1] === 'true') {
               categories.push(parseInt(item[0].split("-")[1]));
            }
         }
      });

      if(!categories.length) categories.push(0);

      /* 1 - ADD PRODUCT TO PRODUCTS TABLE */
      const values = [name, price, shortDescription, recommendation, hidden, id];
      const query = 'UPDATE products SET name = ?, price = ?, description = ?, recommendation = ?, hidden = ? WHERE id = ?';
      con.query(query, values, (err, res) => {
         if(res) {
            /* 2 - ADD CATEGORIES */
            categories.forEach((item, index, array) => {
               const valuesDelete = [id];
               const queryDelete = 'DELETE FROM product_categories WHERE product_id = ?';
               con.query(queryDelete, valuesDelete, (err, res) => {
                  if(item) {
                     console.log("category: " + item);
                     /* THERE ARE CATEGORIES */
                     const values = [id, item];
                     const query = 'INSERT INTO product_categories VALUES (NULL, ?, ?)';
                     con.query(query, values);
                     if(index === array.length-1) {
                        /* 3 - ADD IMAGES TO IMAGES TABLE */
                        updateImages(images, id);
                        response.redirect("https://hideisland.pl/panel/dodaj-produkt?add=1");
                     }
                  }
                  else {
                     /* THERE IS NO ANY CATEGORY */
                     /* 3rd - ADD IMAGES TO IMAGES TABLE */
                     updateImages(images, id);
                     response.redirect("https://hideisland.pl/panel/dodaj-produkt?add=1");
                  }
               });
            });
         }
         else {
            response.redirect("https://hideisland.pl/panel/dodaj-produkt?add=0");
         }
      });
   });

   /* GET RECCOMMENDATIONS */
   router.get('/get-recommendations', (request, response) => {
      const query = 'SELECT * FROM products p JOIN images i ON p.main_image = i.id WHERE recommendation = 1 LIMIT 3';
      console.log("recoms");
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
      })
   });

   /* GET MEN RECOMMENDATIONS */
   router.get("/get-men-recommendations", (request, response) => {
         const query = 'SELECT p.name, i.file_path, p.price FROM products p JOIN images i ON p.main_image = i.id JOIN product_categories pc ON pc.product_id = p.id JOIN categories c ON c.id = pc.category_id WHERE recommendation = 1 AND LOWER(c.name) != "damskie" AND c.parent_id IS NULL LIMIT 3;'
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

   /* GET Women RECOMMENDATIONS */
   router.get("/get-women-recommendations", (request, response) => {
      const query = 'SELECT p.name, i.file_path, p.price FROM products p JOIN images i ON p.main_image = i.id JOIN product_categories pc ON pc.product_id = p.id JOIN categories c ON c.id = pc.category_id WHERE recommendation = 1 AND LOWER(c.name) != "męskie" AND c.parent_id IS NULL LIMIT 3;'
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

   /* REMOVE PRODUCT */
   router.post("/delete", (request, response) => {
      const { id } = request.body;
      const values = [id];

      const query = 'DELETE FROM products WHERE id = ?';
      con.query(query, values, (err, res) => {
         console.log(err);
         let result = 0;
         if(res) result = 1;
         response.send({
            result
         });
      });
   });

   /* REMOVE CURRENT CROSS-SELLS */
   const deleteCrossSellsForProduct = (productId) => {
      const values = [productId];
      const query = 'DELETE FROM cross-sells WHERE product1 = ?';
      con.query(query, values);
   }

   /* GET ALL PRODUCTS */
   router.get("/get-all-products", (request, response) => {
      const query = 'SELECT p.id, p.name, p.subtitle, p.main_image, p.second_image, p.price, p.stock, p.date, COALESCE(c.name, "Brak") as category_name, p.hidden FROM products p ' +
      'LEFT OUTER JOIN product_categories pc ON pc.product_id = p.id ' +
          'LEFT OUTER JOIN categories c ON c.id = pc.category_id ' +
      'GROUP BY p.id ORDER BY p.date DESC';

      con.query(query, (err, res) => {
         if(res) {
            response.send({
               result: res
            });
         }
         else {
            response.send({
               result: null
            });
         }
      });
   });

   /* GET SINGLE PRODUCT BY ID */
   router.post("/get-product-by-id", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT name FROM products p WHERE id = ?';
      con.query(query, values, (err, res) => {
         if(res[0]) {
            response.send({
               result: res[0].name
            });
         }
         else {
            response.send({
               result: 0
            });
         }
      })
   });

   /* GET SINGLE PRODUCT BY NAME */
   router.post("/get-product-by-name", (request, response) => {
      const { name } = request.body;
      const values = [name];
      /* Query uses custom MySQL function - SPLIT_STR */
      const query = 'SELECT p.id as id, p.name, p.price, ' +
          'p.description, p.date, i.file_path as file_path, ' +
          's.size_1_name, s.size_2_name, s.size_3_name, s.size_4_name, s.size_5_name, ' +
          's.size_1_stock, s.size_2_stock, s.size_3_stock, s.size_4_stock, s.size_5_stock ' +
          'FROM products p LEFT OUTER JOIN images i ON i.id = p.main_image ' +
          'LEFT OUTER JOIN products_stock s ON p.stock_id = s.id ' +
          'WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(SPLIT_STR(p.name, "/", 1)), "ł", "l"), "ę", "e"), "ą", "a"), "ć", "c"), "ń", "n"), "ó", "o"), "ś", "s"), "ź", "z"), "ż", "z") = ?';
      con.query(query, values, (err, res) => {
         console.log(res);
         console.log(err);
         response.send({
            result: res
         });
      });
   });

   /* GET IMAGE BY ID */
   router.post("/get-image", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT file_path FROM images WHERE id = ?';
      con.query(query, values, (err, res) => {
         if(res[0]) {
            response.send({
               result: res[0]
            });
         }
         else {
            response.send({
               result: 0
            });
         }
      });
   });

   /* GET PRODUCT CATEGORIES */
   router.post("/get-product-categories", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT * FROM product_categories WHERE product_id = ?';
      con.query(query, values, (err, res) => {
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

   /* GET SINGLE PRODUCT DETAILS (CLIENT) */
   router.post("/single-product", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT p.id as id, p.name, p.price, ' +
          'p.description, p.date, p.recommendation, p.hidden, ' +
          'i.file_path as file_path, s.size_1_name, s.size_1_stock, s.size_2_name, s.size_2_stock, s.size_3_name, s.size_3_stock, s.size_4_name, s.size_4_stock, s.size_5_name, s.size_5_stock ' +
          'FROM products p ' +
          'LEFT OUTER JOIN images i ON i.id = p.main_image ' +
          'LEFT OUTER JOIN products_stock s ON s.id = p.stock_id ' +
          'WHERE p.id = ?';
      con.query(query, values, (err, res) => {
         if(res) {
            response.send({
               result: res
            });
         }
         else {
            response.send({
               result: null
            });
         }
      });
   });

   /* GET PRODUCT DETAILS */
   router.post("/product-data", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT * FROM products WHERE id = ?';
      con.query(query, values, (err, res) => {
         if(res) {
            response.send({
               result: res
            });
         }
         else {
            response.send({
               result: null
            });
         }
      });
   });

   /* GET PRODUCTS BY CATEGORY */
   router.post("/get-products-by-category", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT *, i.file_path as image FROM products p JOIN images i ON p.main_image = i.id JOIN product_categories pc ON pc.product_id = p.id WHERE pc.category_id = ?';
      con.query(query, values, (err, res) => {
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

   /* Get product gallery */
   router.post("/get-gallery", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT * FROM images WHERE product_id = ? ORDER BY (priority IS NOT NULL), priority ASC';
      con.query(query, values, (err, res) => {
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

   /* GET PRODUCTS BY CATEGORIES LIST */
   router.post("/get-products-by-categories", (request, response) => {

   });

   router.get("/get-product-sizes", (request, response) => {
      const id = request.query.id;

      console.log(id);

      const query = 'SELECT ps.size_1_name, ps.size_1_stock, ps.size_2_name, ps.size_2_stock, ps.size_3_name, ps.size_3_stock, ps.size_4_name, ps.size_4_stock, ps.size_5_name, ps.size_5_stock FROM products_stock ps JOIN products p ON ps.id = p.stock_id WHERE p.id = ?';
      const values = [id];
      con.query(query, values, (err, res) => {
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
