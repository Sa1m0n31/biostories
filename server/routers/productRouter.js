const express = require("express");
const router = express.Router();
const got = require("got");
const con = require("../databaseConnection");
const path = require("path");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')
const upload = multer({ dest: 'media/products' })

con.connect(err => {
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
      val.map((item, index) => {
         return {
            name: item,
            priority: index
         }
      }).forEach((item) => {
         const values = [attributeId, item.name, item.priority];
         const query = 'INSERT INTO attributes_values VALUES (?, ?, 0, ?)';
         con.query(query, values);
      });
   }

   router.post('/upload-image', upload.single('image'), (request, response) => {
      const files = request.files;
      const key = request.body.key;
      const id = files.image.filename;

      const query = 'UPDATE custom_fields SET custom_value = ? WHERE custom_key = ?';
      const values = [id, key];

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

   const deleteCategories = (id) => {
      const query = 'DELETE FROM product_categories WHERE product_id = ?';
      const values = [id];
      con.query(query, values);
   }

   const deleteAttributes = (id) => {
      console.log('delete attribute with product-id = ' + id);
      const query = 'DELETE FROM products_attributes WHERE product = ?';
      const values = [id];
      con.query(query, values);
   }

   router.post("/update-product", upload.fields([
      { name: 'gallery', maxCount: 10 },
      { name: 'icons', maxCount: 10 },
      { name: 'img', maxCount: 1 },
      { name: 'img2', maxCount: 1 },
      { name: 'img3', maxCount: 1 },
      { name: 'img4', maxCount: 1 },
      { name: 'img5', maxCount: 1 }
   ]), (request, response) => {
      const { id, title, subtitle, price, stock, attribute, attributeValues, categories,
         description, secondDescription, thirdDescription, fourthDescription, recommendation, top, hidden
      } = request.body;
      const files = request.files;
      let img1 = null, img2 = null, img3 = null, img4 = null, img5 = null;
      if(files) {
         if(files.img) img1 = files.img[0].filename;
         if(files.img2) img2 = files.img2[0].filename;
         if(files.img3) img3 = files.img3[0].filename;
         if(files.img4) img4 = files.img4[0].filename;
         if(files.img5) img5 = files.img5[0].filename;
      }

      const values = [title, subtitle, price, stock, description, secondDescription, thirdDescription, fourthDescription,
         img1, img2, img3, img4, img5, recommendation === 'true' ? 1 : 0, top === 'true' ? 1 : 0, hidden === 'true' ? 1 : 0, id
      ]
      const query = 'UPDATE products SET name = ?, subtitle = ?, price = ?, stock = ?, description = ?, second_description = ?, third_description = ?, fourth_description = ?, main_image = COALESCE(?, main_image), ' +
          'second_image = COALESCE(?, second_image), third_image = COALESCE(?, third_image), fourth_image = COALESCE(?, fourth_image), fifth_image = COALESCE(?, fifth_image), recommendation = ?, top = ?, hidden = ? WHERE id = ?';
      con.query(query, values, async (err, res) => {
         console.log(res);
         console.log(err);
         if(res) {
            if(files.gallery) {
               addGallery(files.gallery, id);
            }
            if(files.icons) {
               addIcons(files.icons, id);
            }
            if(categories) {
               await deleteCategories(id);
               await addCategories(JSON.parse(categories), id);
            }
            console.log(attribute);
            console.log(attributeValues.split(','));
            if(attribute) {
               await deleteAttributes(id);
               await addAttribute(attribute, attributeValues.split(','), id);
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
      const query = 'SELECT p.id, p.name, p.subtitle, p.main_image, p.second_image, p.price, p.stock, p.date, ' +
          'COALESCE(c.name, "Brak") as category_name, p.hidden FROM products p ' +
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

   router.get('/get-default-attribute', (request, response) => {
      const { id } = request.query;

      const query = 'SELECT av.value, a.name FROM attributes_values av ' +
          'JOIN products_attributes a ON a.id = av.attribute ' +
          'WHERE a.product = ? GROUP BY av.value ORDER BY av.date ASC';
      const values = [id];
      con.query(query, values, (err, res) => {
         console.log(err);
         if(res) {
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
         }
         else {
            response.send({
               result: 0
            });
         }
      });
   });

   /* GET SINGLE PRODUCT BY NAME */
   router.post("/get-product-by-name", (request, response) => {
      const { name } = request.body;
      const values = [name];
      /* Query uses custom MySQL function - SPLIT_STR */
      const query = 'SELECT p.id as id, p.name, p.price, ' +
          'p.description, p.second_description, p.third_description, p.fourth_description, p.date, pc.category_id, ' +
          'p.main_image, p.second_image, p.third_image, p.fourth_image, p.fifth_image, pa.name as attribute_name, av.value as attribute_value ' +
          'FROM products p ' +
          'LEFT OUTER JOIN products_attributes pa ON p.id = pa.product ' +
          'LEFT OUTER JOIN attributes_values av ON pa.id = av.attribute ' +
          'LEFT OUTER JOIN product_categories pc ON pc.product_id = p.id ' +
          'WHERE REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(SPLIT_STR(p.name, "/", 1)), "ł", "l"), "ę", "e"), "ą", "a"), "ć", "c"), "ń", "n"), "ó", "o"), "ś", "s"), "ź", "z"), "ż", "z") = ? ' +
          'GROUP BY av.value ORDER BY av.date ASC';
      con.query(query, values, (err, res) => {
         response.send({
            result: res
         });
      });
   });

   router.get('/get-similar', (request, response) => {
      const { product } = request.query;

      const query = 'SELECT p.id, p.name, p.subtitle, p.main_image, p.second_image, p.price, p.stock, p.date, COALESCE(c.name, "Brak") as category_name, p.hidden FROM products p ' +
          'LEFT OUTER JOIN product_categories pc ON pc.product_id = p.id ' +
          'LEFT OUTER JOIN categories c ON c.id = pc.category_id ' +
          'WHERE pc.category_id IN (' +
          'SELECT category_id FROM product_categories WHERE product_id = ?' +
          ') ' +
          'GROUP BY p.id ORDER BY p.date DESC LIMIT 4';
      const values = [product];

      con.query(query, values, (err, res) => {
         console.log(err);
         console.log(res);
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

   router.get('/get-new', (request, response) => {
      const query = 'SELECT p.id, p.name, p.subtitle, p.main_image, p.second_image, p.price, p.stock, p.date, COALESCE(c.name, "Brak") as category_name, p.hidden FROM products p ' +
          'LEFT OUTER JOIN product_categories pc ON pc.product_id = p.id ' +
          'LEFT OUTER JOIN categories c ON c.id = pc.category_id ' +
          'GROUP BY p.id ORDER BY p.date DESC LIMIT 4';

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

   router.get('/get-top-products', (request, response) => {
      const query = 'SELECT p.id, p.name, p.subtitle, p.main_image, p.second_image, p.price, p.stock, p.date, COALESCE(c.name, "Brak") as category_name, p.hidden FROM products p ' +
          'LEFT OUTER JOIN product_categories pc ON pc.product_id = p.id ' +
          'LEFT OUTER JOIN categories c ON c.id = pc.category_id ' +
          'WHERE p.top = 1 GROUP BY p.id ORDER BY p.date DESC LIMIT 4';

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

   router.get('/get-popular', (request, response) => {
      const query = 'SELECT p.id, p.name, p.subtitle, p.main_image, p.second_image, p.price, p.stock, p.date, COALESCE(c.name, "Brak") as category_name, p.hidden FROM products p ' +
          'LEFT OUTER JOIN product_categories pc ON pc.product_id = p.id ' +
          'LEFT OUTER JOIN categories c ON c.id = pc.category_id ' +
          'LEFT OUTER JOIN sells s ON s.product_id = p.id ' +
          'LEFT OUTER JOIN orders o ON o.id = s.order_id ' +
          'GROUP BY p.id ORDER BY o.date DESC LIMIT 4';

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
      console.log('productId: ' + id);
      const query = 'SELECT * FROM product_categories WHERE product_id = ?';
      con.query(query, values, (err, res) => {
         console.log(res);
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
      const query = 'SELECT p.id as id, p.name, p.subtitle, p.stock, p.price, p.recommendation, p.top, p.hidden, ' +
          'p.description, p.second_description, p.third_description, p.fourth_description, p.date, ' +
          'p.main_image, p.second_image, p.third_image, p.fourth_image, p.fifth_image, pa.name as attribute_name, av.value as attribute_value ' +
          'FROM products p ' +
          'LEFT OUTER JOIN products_attributes pa ON p.id = pa.product ' +
          'LEFT OUTER JOIN attributes_values av ON pa.id = av.attribute ' +
          'WHERE p.id = ? GROUP BY av.value ORDER BY av.date';
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
      const query = 'SELECT p.id, p.name, p.subtitle, p.main_image, p.second_image, p.price, p.stock, p.date, ' +
          'COALESCE(c.name, "Brak") as category_name, p.hidden FROM products p ' +
          'LEFT OUTER JOIN product_categories pc ON pc.product_id = p.id ' +
          'LEFT OUTER JOIN categories c ON c.id = pc.category_id ' +
          'WHERE pc.category_id = ? GROUP BY p.id ORDER BY p.date DESC';
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

   /* Get product gallery */
   router.post("/get-gallery", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT file_path FROM images WHERE product_id = ?';
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

   router.post("/get-icons", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT file_path FROM icons WHERE product_id = ?';
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
