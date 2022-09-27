// Accessing MySQL database
const dbConn = require('../models/db');
var dbUsers = require('../models/model_Users.js');
// Passport is a middleware responsible for authenticating requests.
// Documentation: https://www.passportjs.org/concepts/authentication/
// Developing passport-local strategy.
var LocalStrategy = require('passport-local').Strategy;
// Documentation: https://www.npmjs.com/package/bcryptjs
// var bcrypt = require('bcrypt')
var sha1 = require('sha1')
/* 
    Configuring password authentication (or verification) strategy.

    The `LocalStrategy` authenticates users by verifying a username and password.
    The strategy parses the username and password from the request and calls the
    `verifyUser` function.

    The `verifyUser` function queries the database for the user record and verifies
    the password by hashing the password supplied by the user and comparing it to
    the hashed password stored in the database.  If the comparison succeeds, the
    user is authenticated.

    The arguments passed to the `initializePassportLocal` function are from app.js
*/
function initializePassportLocal(passport) {

    const verifyUser = async function (username, password, done) {
        // console.log('Entered verifyUser()')
        // Arguments originated from UI field entries.    
        // console.log(`UI username field input: ${username}`);
        // console.log(`UI password field input: ${password}`);

        // Accessing database to look for provided data (from front-end).
        // Caller that accepts promise results when ready.
        dbUsers.findUserByName(username).then(async function (dbResults) {
            // for (const element in dbResults) {
            //     console.log(dbResults[element])
            // }

            try {
                // No username returned from database or incorrect username provided.
                if (dbResults === null || dbResults.length == 0) {
                    //console.log("No user found in database with that username")
                    return done(null, false, { message: 'Invalid login' })
                    // return done(null, false, { message: 'No user found in database with that username' })
                    // return done(null, false, req.flash('loginMessage', 'No user found in database with that username' ))
                }


                // If user is found within database, comparing passwords.                
                // if (await bcrypt.compare(password, dbResults[0].userPassword)) {  <-- Old & not working implementation because there is no register page.
                // if (password === dbResults[0].userPassword) {  // <-- Works for credentials that are not encrypted
                
                if (sha1(password) == dbResults[0].userPassword) {  //<-- To be used in production.
                    // User is returned, and is authenticated.
                    //console.log("Entered true (authenticated user).");
                    // console.log('Casey Console Log of user from db:', dbResults[0])
                    var user = {
                        userID: dbResults[0].userID,
                        username: dbResults[0].username,
                        userPassword: dbResults[0].userPassword,
                        isAdmin: (dbResults[0].isAdmin == 0 ? false : true)
                    }
                    // console.log('Casey Console Log of user object:', user)
                    return done(null, user)
                } else {
                    // User is rejected from entering the system.
                    //console.log("Entered false (user rejected from entering system).");
                    return done(null, false, { message: 'Incorrect Password' })
                    // return done(null, false, req.flash('loginMessage', 'Incorrect password.' ))
                }
            } catch (e) {
                //console.log('Casey hitting db query catch')
                return done(e)
            }
        }).catch(function (err) {
            console.log(`Promise rejection error --> ${err}`)
        })
    }

    // Uses 'local' strategy by default.
    passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        //passReqToCallback: true // Allows the entire request to be passed to the callback (verifyUser()).
    }, verifyUser))  // Passing data from UI form to callback function.

    // verifyUser(username, password)))  // Passing data from UI form to callback function.

    // Alternatively, the callback can be defined as: verifyUser(req, user.username, user.userPassword), and the callback would receive a req as a parameter)


    /* 
        Configuring session management.
    
        When a login session is established, information about the user will be
        stored in the session via the `serializeUser`function, providing user data.
    
        As the user interacts with the app, subsequent requests will be authenticated
        by verifying the session.  The same user information that was serialized at
        session initialization will be restored when the session is authenticated by
        the `deserializeUser` function.

        In other words, this is the passport session setup required for persistent login sessions, allowing passport the ability to serialize and unserialize users in/out of the session.
    
    */

    passport.serializeUser(function (user, done) {
        // Storing userID and username within session as an object.
        //console.log(`User is serialized. --> ${user.userID}`)
        //console.log(`User is serialized. --> ${user.isAdmin}`)
        //done(null, { userID: user.userID, username: user.username });
        done(null, user.userID);
    })

    passport.deserializeUser(function (userID, done) {
        //console.log(`User is deserialized. --> ${userID}`)
        // Returning user by loading user object from database to session.
        // db.findUserByID(userID, function (err, user) {
        //     done(err, user)
        // })
        dbUsers.findUserByID(userID).then(function (dbUser) {
            var user = {
                userID: dbUser[0].userID,
                username: dbUser[0].username,
                userPassword: dbUser[0].userPassword,
                isAdmin: (dbUser[0].isAdmin == 0 ? false : true)
            }
            return done(null, user)
        }).catch(function (err) {
            return done(`Promise rejection error --> ${err}`, null)
        })
    })

}

module.exports = initializePassportLocal;