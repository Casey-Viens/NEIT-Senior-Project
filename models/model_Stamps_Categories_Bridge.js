const dbConn = require('./db');

// Function that returns 0, 1, 2, or more stamps and categories connections by stampID.
async function listStampCatConnection(stampID) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Stamps_Categories_Bridge` WHERE `stampID` = ?', 
        [stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listStampCatConnection(3).then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that creates a connection between an existing stamp and category.
async function addStampCatConnection(stampID, categoryID) {
    const dbResults = await dbConn.promise().execute(
        'INSERT INTO `Stamps_Categories_Bridge` (`stampID`, `catID`) VALUES (?, ?)',
        [stampID, categoryID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
addStampCatConnection(7, 2).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful insert.`)
    } else {
        console.log(`No record was inserted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that deletes a connection between an existing stamp and category.
async function deleteStampCatConnection(stampID, catID) {
    const dbResults = await dbConn.promise().execute(
        'DELETE FROM `Stamps_Categories_Bridge` WHERE `stampID` = ? AND `catID` = ?',
        [stampID, catID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
deleteStampCatConnection(7, 2).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful deletion.`)
    } else {
        console.log(`No record was deleted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that deletes all stamp & category connections for a stamp by stampID.
async function deleteStampCatConnectionV2(stampID) {
    const dbResults = await dbConn.promise().execute(
        'DELETE FROM `Stamps_Categories_Bridge` WHERE `stampID` = ?',
        [stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
deleteStampCatConnectionV2(26).then(function(dbResults) {
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
    addStampCatConnection,
    deleteStampCatConnection,
    deleteStampCatConnectionV2
}
