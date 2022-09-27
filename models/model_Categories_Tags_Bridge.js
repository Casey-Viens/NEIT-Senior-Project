const dbConn = require('./db');

// Function that returns 0, 1, 2, or more categories and tags connections by categoryID.
async function listCatTagConnection(catID) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Categories_Tags_Bridge` WHERE `catID` = ?',
        [catID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listCatTagConnection(2).then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns 0, 1, 2, or more categories and tags connections by categoryID and tagID.
async function listCatTagConnectionByIDs(catID, tagID) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Categories_Tags_Bridge` WHERE `catID` = ? AND `tagID` = ?',
        [catID, tagID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listCatTagConnectionByIDs(20, 3).then(function (dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function (err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that creates a connection between an existing category and tag.
async function addCatTagConnection(catID, tagID) {
    const dbResults = await dbConn.promise().execute(
        'INSERT INTO `Categories_Tags_Bridge` (`catID`, `tagID`) VALUES (?, ?)',
        [catID, tagID]
    )

    return dbResults[0];
}

/*
// Caller that accepts promise results when ready.
addCatTagConnection(20, 3).then(function (dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful insert.`)
    } else {
        console.log(`No record was inserted.`)
    }
}).catch(function (err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that deletes a connection between an existing category and tag.
async function deleteCatTagConnection(catID, tagID) {
    const dbResults = await dbConn.promise().execute(
        'DELETE FROM `Categories_Tags_Bridge` WHERE `catID` = ? AND `tagID` = ?',
        [catID, tagID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
deleteCatTagConnection(5, 1).then(function(dbResults) {
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
    listCatTagConnection,
    listCatTagConnectionByIDs,
    addCatTagConnection,
    deleteCatTagConnection
}
