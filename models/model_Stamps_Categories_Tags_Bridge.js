/* Backend API built for three-way bridge table "Stamps_Categories_Tags_Bridge", particularly to allow stamps to be indexed with specific tags instead of cumulatively associating all tags under a category. */

const dbConn = require('./db');

// Function that returns 0, 1, 2, or more stamp, category, and tag connections (three-way table) by stampID.
async function listStampCatTagConnection(stampID) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Stamps_Categories_Tags_Bridge` WHERE `stampID` = ?', 
        [stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listStampCatTagConnection(3).then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that creates a connection between an existing stamp, category, and tag.
async function addStampCatTagConnection(stampID, catID, tagID) {
    const dbResults = await dbConn.promise().execute(
        'INSERT INTO `Stamps_Categories_Tags_Bridge` (`stampID`, `catID`, `tagID`) VALUES (?, ?, ?)',
        [stampID, catID, tagID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
addStampCatTagConnection(5, 2, 3).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful insert.`)
    } else {
        console.log(`No record was inserted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that deletes a connection between an existing stamp, category, and tag.
async function deleteStampCatTagConnection(stampID, catID, tagID) {
    const dbResults = await dbConn.promise().execute(
        'DELETE FROM `Stamps_Categories_Tags_Bridge` WHERE `stampID` = ? AND `catID` = ? AND `tagID` = ?',
        [stampID, catID, tagID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
deleteStampCatTagConnection(5, 2, 3).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful deletion.`)
    } else {
        console.log(`No record was deleted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that deletes all connections for a provided stampID.
async function deleteStampCatTagConnectionByStampID(stampID) {
    const dbResults = await dbConn.promise().execute(
        'DELETE FROM `Stamps_Categories_Tags_Bridge` WHERE `stampID` = ?',
        [stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
deleteStampCatTagConnectionByStampID(26).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful deletion.`)
    } else {
        console.log(`No record was deleted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that deletes all connections for a provided categoryID and tagID.
async function deleteStampCatTagConnectionByCatIDAndTagID(catID, tagID) {
    const dbResults = await dbConn.promise().execute(
        'DELETE FROM `Stamps_Categories_Tags_Bridge` WHERE `catID` = ? AND `tagID` = ?',
        [catID, tagID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
deleteStampCatTagConnectionByCatIDAndTagID(20, 11).then(function(dbResults) {
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
    addStampCatTagConnection,
    deleteStampCatTagConnection,
    deleteStampCatTagConnectionByStampID,
    deleteStampCatTagConnectionByCatIDAndTagID
}