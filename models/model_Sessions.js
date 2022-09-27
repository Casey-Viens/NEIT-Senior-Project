const dbConn = require('./db');

const dateTimeUtil = require('../utils/getDateTimeUtil.js')

// Function that lists all sessions by all users.
async function listSessions() {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Sessions`'
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listSessions().then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that lists all sessions by userID.
async function listSessionsByID(userID) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Sessions` WHERE `userID` = ?',
        [userID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listSessionsByID(1).then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/

// Function that lists all sessions by userID and stampID.
async function listSessionsByIDs(userID, stampID) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Sessions` WHERE `userID` = ? AND `stampID` = ?',
        [userID, stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listSessionsByIDs(1, 7).then(function (dbResults) {
    console.log("Entered listSessionsByIDs function")
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function (err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that adds a user session.
async function insertSession(userID, stampID, lastAccessedDate, duration, hasThumbUp, hasThumbDown) {
    const dbResults = await dbConn.promise().execute(
        'INSERT INTO `Sessions` (`userID`, `stampID`, `lastAccessedDate`, `duration`, `hasThumbUp`, `hasThumbDown`) VALUES (?, ?, ?, ?, ?, ?)',
        [userID, stampID, lastAccessedDate, duration, hasThumbUp, hasThumbDown]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
insertSession(1, 16, '2022-11-25 17:05:59', '5000', 0, 0).then(function (dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful insert.`)
    } else {
        console.log(`No record was inserted.`)
    }
}).catch(function (err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that adds a user session.
async function updateSession(lastAccessedDate, userID, stampID) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Sessions` SET `lastAccessedDate` = ?, `duration` = 0 WHERE userID = ? AND stampID = ?',
        [lastAccessedDate, userID, stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
updateSession(dateTimeUtil.getCurrentTimeStamp, 5, 11).then(function (dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function (err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/

// Function that updates a user session's hasThumbsUp column to true.
async function setHasThumbsUpToTrue(userID, stampID) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Sessions` SET `hasThumbUp` = 1 WHERE `userID` = ? AND `stampID` = ?',
        [userID, stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
setHasThumbsUpToTrue(5, 5).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that updates a user session's hasThumbsUp column to false.
async function setHasThumbsUpToFalse(userID, stampID) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Sessions` SET `hasThumbUp` = 0 WHERE `userID` = ? AND `stampID` = ?',
        [userID, stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
setHasThumbsUpToFalse(5, 5).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that updates a user session's hasThumbsDown column to true.
async function setHasThumbsDownToTrue(userID, stampID) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Sessions` SET `hasThumbDown` = 1 WHERE `userID` = ? AND `stampID` = ?',
        [userID, stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
setHasThumbsDownToTrue(5, 5).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that updates a user session's hasThumbsDown column to false.
async function setHasThumbsDownToFalse(userID, stampID) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Sessions` SET `hasThumbDown` = 0 WHERE `userID` = ? AND `stampID` = ?',
        [userID, stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
setHasThumbsDownToFalse(5, 5).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that deletes a user session.
async function deleteSession(userID, stampID) {
    const dbResults = await dbConn.promise().execute(
        'DELETE FROM `Sessions` WHERE `userID` = ? AND `stampID` = ?',
        [userID, stampID]
    )

    return dbResults[0];
}

/*
// Caller that accepts promise results when ready.
deleteSession(1, 8).then(function(dbResults) {
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
    listSessionsByID,
    listSessionsByIDs,
    insertSession,
    updateSession,
    setHasThumbsUpToTrue,
    setHasThumbsUpToFalse,
    setHasThumbsDownToTrue,
    setHasThumbsDownToFalse,

}

