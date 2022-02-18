const express = require("express");
const router = express.Router();
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const con = require("../databaseConnection");
const multer  = require('multer');
const upload = multer({ dest: 'media/videos' });

router.get("/get", (request, response) => {
    const { url } = request.query;
    response.set({'Content-Type': 'video/mp4'});
    response.sendFile(path.join(__dirname, '../', url));
});

router.post("/upload", upload.single('file'), (request, response) => {
    const { key } = request.body;

    console.log('KEY');
    console.log(key);

    let progress = 0;
    let fileSize = request.headers['content-length'] ? parseInt(request.headers['content-length']) : 0;
    request.on('data', (chunk) => {
        progress += chunk.length;
        response.write((`${Math.floor((progress * 100) / fileSize)} `));
        if(progress === fileSize) {
            console.log('Finished', progress, fileSize)
        }
    });

    const query = `UPDATE custom_fields SET custom_value = ? WHERE custom_key = ?`;
    const values = [request.file.filename, key];

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

router.delete("/delete", (request, response) => {
    const { userId, play } = request.body;

    /* Get video category id */
    const query = 'SELECT id FROM video_categories WHERE name = $1';
    const values = [play];

    con.query(query, values, (err, res) => {
        const query = 'DELETE FROM videos WHERE user_id = $1 AND video_category = $2';
        const values = [userId, res.rows[0].id];

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
});

module.exports = router;
