const dbConn = require('./db');

// Function that returns all current users in the system.
async function listUsers() {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Users`'
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listUsers().then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns a user from the system by userID.
async function findUserByID(userID) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Users` WHERE `userID` = ?',
        [userID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
findUserByID(2).then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns a user from the system by isAdmin (authorization) status, where:
    // isAdmin == 1 OR True
    // isRegularUser == 0 OR False
async function findUserByAuthStatus(isAdmin) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Users` WHERE `isAdmin` = ?',
        [isAdmin]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
findUserByAuthStatus(1).then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns a user from the system by username.
async function findUserByName(username) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Users` WHERE `username` = ?',
        [username]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
findUserByName('testUser1').then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that adds a user into the system.
async function insertUser(username, userPassword, isAdmin) {
    const dbResults = await dbConn.promise().execute(
        'INSERT INTO `Users` (`username`, `userPassword`, `isAdmin`) VALUES (?, ?, ?)',
        [username, userPassword, isAdmin]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
insertUser('testUser2', 'testUser2', 0).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful insert.`)
    } else {
        console.log(`No record was inserted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that updates an existing user.
async function updateUser(userID, username, userPassword, isAdmin) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Users` SET `username` = ?, `userPassword` = ?, `isAdmin` = ? WHERE `userID` = ?',
        [username, userPassword, isAdmin, userID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
updateUser(4, 'testUser4', 'testUser4', 0).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that deletes a user from the system.
async function deleteUser(userID) {
    const dbResults = await dbConn.promise().execute(
        'DELETE FROM `Users` WHERE `userID` = ?',
        [userID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
deleteUser(4).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful deletion.`)
    } else {
        console.log(`No record was deleted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


module.exports = {
    findUserByID,
    findUserByName
}