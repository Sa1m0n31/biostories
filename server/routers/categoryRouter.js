const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

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

con.connect(err => {
    /* ADD CATEGORY */
    router.post("/add", (request, response) => {
        let { name, parent, priority, hidden } = request.body;

        const values = [parent, name, convertToURL(name), priority, hidden];
        const query = 'INSERT INTO categories VALUES (NULL, ?, ?, ?, ?, ?)';

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

    /* REMOVE CATEGORY */
    router.post("/delete", (request, response) => {
       const { id } = request.body;
       const values = [id];
       const query = 'DELETE FROM categories WHERE id = ?';
       con.query(query, values, (err, res) => {
           let result = 0;
           if(err) {
               result = -1;
               if(err.errno === 1451) result = 0;
           }
           if(res) result = 1;
           response.send({
               result
           });
       });
    });

    /* GET CATEGORY BY ID */
    router.post("/get-category-by-id", (request, response) => {
        const { id } = request.body;
        const values = [id];
        const query = 'SELECT * FROM product_categories pc JOIN categories c ON pc.category_id = c.id WHERE c.id = ?';
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
        });
    });

    /* GET ALL CATEGORIES */
    router.get("/get-all", (request, response) => {
        con.query('SELECT c1.name as parent_name, c2.id, c2.name as name, c2.parent_id, c2.permalink, c2.hidden, c2.priority FROM categories c1 RIGHT OUTER JOIN categories c2 ON c1.id = c2.parent_id', (err, res) => {
            response.send({
               result: res
           });
        });
    });

    /* GET CATEGORY BY NAME */
    router.post("/get-category-by-name", (request, response) => {
       const { name } = request.body;
       const values = [name];
       const query = 'SELECT * FROM categories WHERE name = ?';
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

    /* GET CATEGORY BY SLUG */
    router.post("/get-category-by-slug", (request, response) => {
        const { slug, parent } = request.body;
        let values;
        let query;
        if(parent) {
            values = [slug, parent];
            query = 'SELECT c1.name, c1.id, c1.permalink FROM categories c1 JOIN categories c2 ON c1.parent_id = c2.id WHERE c1.permalink = ? AND c2.permalink = ?';
        }
        else {
            values = [slug];
            query = 'SELECT * FROM categories WHERE permalink = ?';
        }
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

    /* GET CATEGORY DETAILS */
    router.post("/category-details", (request, response) => {
       const { id } = request.body;
       const query = 'SELECT * FROM categories WHERE id = ?';
       const values = [id];
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
       });
    });

    /* UPDATE CATEGORY */
    router.post("/update", (request, response) => {
        let { id, name, parent, priority, hidden } = request.body;

        const values = [name, parent, convertToURL(name), priority, hidden, id];
        const query = 'UPDATE categories SET name = ?, parent_id = ?, permalink = ?, priority = ?, hidden = ? WHERE id = ?';

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

    /* GET ALL PARENT CATEGORIES */
    router.get("/get-all-parent-categories", (request, response) => {
       const query = 'SELECT * FROM categories WHERE parent_id IS NULL';
       con.query(query, (err, res) => {
          if(res) {
              response.send({
                  result: res
              })
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
