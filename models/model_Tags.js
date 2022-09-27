const dbConn = require('./db');

// Function that lists all tags
async function listAllTags() {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Tags`'
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listAllTags().then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/

// Function that inserts a tag.
async function insertTag(tagLabel) {
    const dbResults = await dbConn.promise().execute(
        'INSERT INTO `Tags` (`tagLabel`) VALUES (?)',
        [tagLabel]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
insertTag('d/dx(sin(x)) = cos(x)').then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful insert.`)
    } else {
        console.log(`No record was inserted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that updates a tag.
async function updateTag(tagID, tagLabel) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Tags` SET `tagLabel` = ? WHERE `tagID` = ?',
        [tagLabel, tagID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
updateTag(6, '30-60-90 Triangles').then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that deletes a tag.
async function deleteTag(tagID) {
    const dbResults = await dbConn.promise().execute(
        'DELETE FROM `Tags` WHERE `tagID` = ?',
        [tagID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
deleteTag(6).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful deletion.`)
    } else {
        console.log(`No record was deleted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns the most viewed tags.
function mostViewedTags() {
    
}


module.exports = {
    listAllTags,
    insertTag,
    updateTag,
    deleteTag
}
