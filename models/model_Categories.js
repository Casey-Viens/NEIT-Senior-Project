const dbConn = require('./db');

// Function that lists all categories.
async function listAllCategories() {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Categories`'
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listAllCategories().then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/

// Function that lists all tags within a category by categoryID.
async function listAllCatTagsByCatID(catID) {
    const dbResults = await dbConn.promise().execute(
        'SELECT catID, catLabel, tagID, tagLabel FROM (SELECT * FROM (SELECT Categories.catID, Categories.catLabel, Categories_Tags_Bridge.tagID AS TagIDFromBridge FROM Categories INNER JOIN Categories_Tags_Bridge ON Categories.catID = Categories_Tags_Bridge.catID WHERE Categories.catID = ?) AS Cat_Tag_BridgeAssociations INNER JOIN Tags ON Cat_Tag_BridgeAssociations.TagIDFromBridge = Tags.tagID) AS Cat_Tag_Bridge_TagsAssociations',
        [catID]
    )
    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listAllCatTagsByCatID(26).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        for (const element in dbResults) {
            console.log(dbResults[element])
        }
    } else {
        console.log("No record was returned.")
    }

}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/



// Function that inserts a category.
async function insertCategory(catLabel) {
    const dbResults = await dbConn.promise().execute(
        'INSERT INTO `Categories` (`catLabel`) VALUES (?)',
        [catLabel]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
insertCategory('Calculus2').then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful insert.`)
    } else {
        console.log(`No record was inserted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that updates a category.
async function updateCategory(catID, catLabel) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Categories` SET `catLabel` = ? WHERE `catID` = ?',
        [catLabel, catID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
updateCategory(10, 'CalculusTest').then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that deletes a category.
async function deleteCategory(catID) {
    const dbResults = await dbConn.promise().execute(
        'DELETE FROM `Categories` WHERE `catID` = ?',
        [catID]
    )

    return dbResults[0]   
}
/*
// Caller that accepts promise results when ready.
deleteCategory(10).then(function(dbResults) {
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
    listAllCategories,
    listAllCatTagsByCatID,
    insertCategory,
    updateCategory,
    deleteCategory
}
