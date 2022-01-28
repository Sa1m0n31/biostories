const db = require("./databaseConnection");
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const LocalStrategy = require("passport-local").Strategy;

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const sendInfoAboutLogin = (id) => {
    const query = 'INSERT INTO login_info VALUES (?, NOW()) ON CONFLICT(id) DO UPDATE SET login_time = NOW()';
    const values = [id];

    db.query(query, values);
}

const init = (passport) => {
    const userAuth = (username, password, done) => {
        const hash = crypto.createHash('md5').update(password).digest('hex');
        const query = 'SELECT id, email FROM users WHERE LOWER(email) = LOWER(?) AND password = ?';
        const values = [username, hash];

        db.query(query, values, (err, res) => {
            if(res) {
                const user = res[0];
                if(!user) {
                    return done(null, false, { message: 'Niepoprawna nazwa użytkownika lub hasło' });
                }
                else if(user.active === false) {
                    return done(null, false, { message: 'Zweryfikuj swój adres email aby się zalogować' });
                }
                else {
                    return done(null, user);
                }
            }
            else {
                return done(err, false, { message: "Coś poszło nie tak..." });
            }
        });
    }

    const adminAuth = (username, password, done) => {
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        const query = 'SELECT id FROM admins WHERE LOWER(username) = LOWER(?) AND password = ?';
        const values = [username, hash];

        db.query(query, values, (err, res) => {
           if(res) {
               const admin = res[0];
               if(!admin) {
                   return done(null, false, { message: 'Niepoprawna nazwa użytkownika lub hasło' });
               }
               else {
                   return done(null, admin);
               }
           }
           else {
               return done(err, false, { message: "Coś poszło nie tak..." });
           }
        });
    }

    passport.use('admin-local', new LocalStrategy(adminAuth));

    passport.use('user-local', new LocalStrategy(userAuth));

    passport.serializeUser((user, done) => {
        if(user) {
            console.log(user);
            if(user.email) done(null, user.email); // User
            else done(null, user.id); // Admin
        }
        else done(null, null);
    });

    passport.deserializeUser((id, done) => {
        let query, values;

        if(id) {
            /* Admin or user */
            query = 'SELECT id FROM admins WHERE id = ?';
            values = [id];

            db.query(query, values, (err, res) => {
                if(res) {
                    if(res.length) done(null, res[0].id);
                    else {
                        query = 'SELECT email FROM users WHERE email = ?';
                        db.query(query, values, (err, res) => {
                            if(res) {
                                if(res.length) done(null, res[0].email);
                            }
                            else done(null, null);
                        });
                    }
                }
                else {
                    query = 'SELECT email FROM users WHERE email = ?';
                    db.query(query, values, (err, res) => {
                        if(res) {
                            if(res.length) done(null, res[0].email);
                        }
                        else done(null, null);
                    });
                }
            });
        }
        else {
            done(null, null);
        }
    });
}

module.exports = init;
