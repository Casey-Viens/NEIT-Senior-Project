const dbConn = require('./db');
// Allows writing and reading to a file.
const fs = require('fs');


// ---- File contains refactored Asynchronous Code With Async/Await (i.e. waits until the promise returns a result) ----

// Function that returns all artifact authors.
async function listAllArtifactAuthors() {
    // Note: Alternatively, DISTINCT could be used (e.g. SELECT DISTINCT author...)
    const dbResults = await dbConn.promise().execute(
        'SELECT author FROM `Artifacts`'
    )   
    
    // Returning only authors.
    authorsResultArr = []
    for (const element in dbResults[0]) {
        // Capturing unique author values only.
        if (!authorsResultArr.includes(`${dbResults[0][element].author}`)) {
            authorsResultArr.push(dbResults[0][element].author)
        }        
    }
    return authorsResultArr
}
// Caller that accepts promise results when ready.
// listAllArtifactAuthors().then(function(dbResults) {
//     for (const element in dbResults) {
//         console.log(dbResults[element])
//     }
// }).catch(function(err) {
//     console.log(`Promise rejection error --> ${err}`)
// })



// Function that returns all artifact titles.
async function listAllArtifactTitles() {
    const dbResults = await dbConn.promise().execute(
        'SELECT title FROM `Artifacts`'
    )   
    
    // Returning only titles.
    titlesResultArr = []
    for (const element in dbResults[0]) {
        // Capturing unique title values only.
        if (!titlesResultArr.includes(`${dbResults[0][element].title}`)) {
            titlesResultArr.push(dbResults[0][element].title)
        }        
    }
    return titlesResultArr
}
// Caller that accepts promise results when ready.
// listAllArtifactTitles().then(function(dbResults) {
//     for (const element in dbResults) {
//         console.log(dbResults[element])
//     }
// }).catch(function(err) {
//     console.log(`Promise rejection error --> ${err}`)
// })



// Function that returns all artifact format types.
async function listAllArtifactFormatTypes() {
    const dbResults = await dbConn.promise().execute(
        'SELECT formatType FROM `Artifacts`'
    )   
    
    // Returning only artifact format types.
    formatTypesResultArr = []
    for (const element in dbResults[0]) {
        // Capturing unique artifact format types.
        if (!formatTypesResultArr.includes(`${dbResults[0][element].formatType}`)) {
            formatTypesResultArr.push(dbResults[0][element].formatType)
        }        
    }
    return formatTypesResultArr
}
// Caller that accepts promise results when ready.
// listAllArtifactFormatTypes().then(function(dbResults) {
//     for (const element in dbResults) {
//         console.log(dbResults[element])
//     }
// }).catch(function(err) {
//     console.log(`Promise rejection error --> ${err}`)
// })


// Function that returns all categories.
async function listAllCategories() {
    const dbResults = await dbConn.promise().execute(
        'SELECT catLabel FROM `Categories`'
    )   
    
    // Returning only categories.
    categoriesResultArr = []
    for (const element in dbResults[0]) {
        // Capturing unique category values only.
        if (!categoriesResultArr.includes(`${dbResults[0][element].catLabel}`)) {
            categoriesResultArr.push(dbResults[0][element].catLabel)
        }        
    }
    return categoriesResultArr
}
// Caller that accepts promise results when ready.
// listAllCategories().then(function(dbResults) {
//     for (const element in dbResults) {
//         console.log(dbResults[element])
//     }
// }).catch(function(err) {
//     console.log(`Promise rejection error --> ${err}`)
// })


// Function that returns all categories with ID for adminIndexer page.
async function listAllCategoriesWithID() {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Categories`'
    )   
    
    return dbResults[0]
}
// Caller that accepts promise results when ready.
// listAllCategoriesWithID().then(function(dbResults) {
//     console.log(dbResults)    
// }).catch(function(err) {
//     console.log(`Promise rejection error --> ${err}`)
// })


// Function that returns all tags.
async function listAllTags() {
    const dbResults = await dbConn.promise().execute(
        'SELECT tagLabel FROM `Tags`'
    )   
    
    // Returning only tags.
    tagsResultArr = []
    for (const element in dbResults[0]) {
        // Capturing unique tags values only.
        if (!tagsResultArr.includes(`${dbResults[0][element].tagLabel}`)) {
            tagsResultArr.push(dbResults[0][element].tagLabel)
        }        
    }
    return tagsResultArr
}
// Caller that accepts promise results when ready.
// listAllTags().then(function(dbResults) {
//     for (const element in dbResults) {
//         console.log(dbResults[element])
//     }
// }).catch(function(err) {
//     console.log(`Promise rejection error --> ${err}`)
// })


// Function that returns all tags with ID for adminIndexer page.
async function listAllTagsWithID() {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Tags`'
    )   
    
    return dbResults[0]
}
// Caller that accepts promise results when ready.
// listAllTagsWithID().then(function(dbResults) {
//     console.log(dbResults)    
// }).catch(function(err) {
//     console.log(`Promise rejection error --> ${err}`)
// })




// Function that returns all artifacts that match the provided title and description search string.
async function listArtifactByTitleAndDescr(searchString) {
    searchString = `%${searchString}%`
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Artifacts` WHERE `title` LIKE ? OR `descr` LIKE ?',
        [searchString, searchString]
    )   

    return dbResults[0]
}
/*
// Caller that accepts promise results when ready.
listArtifactByTitleAndDescr(`Pythagorean Theorem`).then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Unused test function that returns all artifacts with associated stamps first, then then non-stamped artifacts second that match the provided title and description search string.
async function listArtifactWithStampsByTitleAndDescr(searchString) {
    searchString = `%${searchString}%`
    const dbResults = await dbConn.promise().execute(
        'SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged FROM `Artifacts` LEFT JOIN `Stamps` ON Artifacts.artifactID = Stamps.artifactID WHERE `title` LIKE ? OR `descr` LIKE ? ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;',
        [searchString, searchString]
    )   

    return dbResults[0]
}
// Caller that accepts promise results when ready.
/*
listArtifactWithStampsByTitleAndDescr(`Pythagorean Theorem`).then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns all artifacts and related data (e.g. stamps, categories, tags, etc.) based on user search query entered in search form.
/*
    Example of query object passed as an argument to function:
    query = [
            row: {
                field: 'stampTable.title',
                input: char,
                condition: AND
            },
            row2: {
                field: 'tagTable.title',
                input: char,
                condition: AND
            }
    ]

    (Reminder: application is forcing admins to stamp all artifacts, and are forced to add at least 1 category and tag; they cannot circumvent the design of the system).

    Example of object to be returned to pages.js in preparation for UI display:
    queryExactMatchResults = [
        result: {
            stampID: int,
            formatType: enum,
            artifactTitle: char,
            shortName: char,
            author: char,
            views: int,
            description: char,
            thumbnail: ?tba?,
            categories: [
                category: {
                    isMatched: bool, // Changes UI color
                    catLabel: char,
                    tags: [
                        tag: {
                            isMatched: bool,
                            tagLabel: char
                        }
                    ]
                }
            ]
        },
        result2: {}
    ] 
*/
// Example input #1: title matching `Pythagorean Theorem` AND artifact type matching `.MP4` (video).
/*
queryObj = [
    {
        field: 'Artifacts.title',
        input: 'Pythagorean Theorem',
        condition: 'AND'
    },
    {
        field: 'Artifacts.formatType',
        input: '.MP4',
        condition: 'AND'
    }
]
*/

// Function that returns a list of artifacts and associated stamps.
async function listArtifactInfoMatchingSearchFormQuery(queryObj) {

    /*
    Dynamic SQL creation outline:
        Select *queryResults* From *queryReslts appropriate tables* WHERE query.row.field == query.row.input AND query.row2.field == query.row2.input

        - Use named placeholders to match queryObj object attributes.

        ORDER BY VIEW CTR
    */

    //dynamicSQLString = `SELECT * FROM Artifacts WHERE ${queryObj[0].field} LIKE '${queryObj[0].input}' ${queryObj[0].condition} ${queryObj[1].field} LIKE '${queryObj[1].input}';`
    //dynamicSQLString = `SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged FROM Artifacts LEFT JOIN Stamps ON Artifacts.artifactID = Stamps.artifactID WHERE ${queryObj[0].field} LIKE '${queryObj[0].input}' ${queryObj[0].condition} ${queryObj[1].field} LIKE '${queryObj[1].input}' ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;`

    /* ----------------------Part1 building stamps start---------------------- */
    // var dynamicSQLString = `SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged FROM Artifacts LEFT JOIN Stamps ON Artifacts.artifactID = Stamps.artifactID WHERE `

    
    var dynamicSQLString = `SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged, Categories.catID, Categories.catLabel, Tags.tagID, Tags.tagLabel FROM Artifacts LEFT JOIN Stamps ON Artifacts.artifactID = Stamps.artifactID LEFT JOIN Stamps_Categories_Tags_Bridge ON Stamps.stampID = Stamps_Categories_Tags_Bridge.stampID LEFT JOIN Categories ON Stamps_Categories_Tags_Bridge.catID = Categories.catID LEFT JOIN Tags ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID WHERE `
    

    for (const queryObjIndex in queryObj) {
        // Excluding the last logical condition (e.g. AND, OR) for the last query object. 
        if (queryObj.length - 1 != queryObjIndex) {
            if (queryObj[queryObjIndex].input == 'Video') {
                dynamicSQLString += `(Artifacts.formatType LIKE '.MP4' OR Artifacts.formatType LIKE 'Link') ${queryObj[queryObjIndex].condition} `
                // WHERE `title` LIKE '%Pythagorean Theorem%' AND (Artifacts.formatType LIKE '.MP4' OR Artifacts.formatType LIKE 'Link')
            } else{
                dynamicSQLString += `${queryObj[queryObjIndex].field} LIKE '%${queryObj[queryObjIndex].input}%' ${queryObj[queryObjIndex].condition} `
            }
        } else {
            // Last query object.
            if (queryObj[queryObjIndex].input == 'Video') {
                dynamicSQLString += `(Artifacts.formatType LIKE '.MP4' OR Artifacts.formatType LIKE 'Link')`
                // WHERE `title` LIKE '%Pythagorean Theorem%' AND (Artifacts.formatType LIKE '.MP4' OR Artifacts.formatType LIKE 'Link')
            } else {
                dynamicSQLString += `${queryObj[queryObjIndex].field} LIKE '%${queryObj[queryObjIndex].input}%'`
            }
        }        
    }

    // dynamicSQLString += ` GROUP BY Stamps.stampID ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;`
    dynamicSQLString += ` ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;`

    // Dynamic DB API call that returns a list of artifacts and associated stamps.
    var dbListOfArtifactsAndAssociatedStamps = await dbConn.promise().execute(
        dynamicSQLString
    )
    /* ----------------------Part1 building stamps ends---------------------- */

    /* ----------------------Part2 attaching categories to stamps start----------------------*/

    // If stamp ID already exists, do not append duplicate stamp IDs.
    if (dbListOfArtifactsAndAssociatedStamps[0].length > 0) {
        
        // Array for used stampIDs
        // Pushing first element inside for the stampIDIndex loop to work.
        var usedStampIDs = []
        usedStampIDs.push(dbListOfArtifactsAndAssociatedStamps[0][0].stampID) 
        //console.log('UsedStampIDs list', usedStampIDs) 
        var dbResultsUniqueStampID = []
        dbResultsUniqueStampID.push(dbListOfArtifactsAndAssociatedStamps[0][0])
        //console.log('dbResultsUniqueStampID list', dbResultsUniqueStampID) 
        // Looping through dbresults
        for (const dbResultIndex in dbListOfArtifactsAndAssociatedStamps[0]) {
            //console.log('dbresults test: ', dbListOfArtifactsAndAssociatedStamps[0][dbResultIndex])
            // If usedStampIDs array does not match dbresults stampID.
            if(!usedStampIDs.includes(dbListOfArtifactsAndAssociatedStamps[0][dbResultIndex].stampID)){
                // Push id into stampID array and push dbresults index into dbresults copy.
                usedStampIDs.push(dbListOfArtifactsAndAssociatedStamps[0][dbResultIndex].stampID)
                dbResultsUniqueStampID.push(dbListOfArtifactsAndAssociatedStamps[0][dbResultIndex])
                
                
            }
            
            
            // Else do nothing
            
            /*
            // Looping through stampID array
            for (const stampIDIndex in usedStampIDs) {
                // If usedStampIDs array does not match dbresults stampID.
                console.log('usedStampIDs ID',usedStampIDs[stampIDIndex], 'dbResultsID', dbListOfArtifactsAndAssociatedStamps[0][dbResultIndex].stampID)
                if (usedStampIDs[stampIDIndex] != dbListOfArtifactsAndAssociatedStamps[0][dbResultIndex].stampID) {
                    console.log('entered if')
                    // push id into stampID array and push dbresults index into dbresults copy
                    usedStampIDs.push(dbListOfArtifactsAndAssociatedStamps[0][dbResultIndex].stampID)
                    dbResultsUniqueStampID.push(dbListOfArtifactsAndAssociatedStamps[0][dbResultIndex])
                }
                
                // Else do nothing
            }
            */
        }

        dbListOfArtifactsAndAssociatedStamps[0] = dbResultsUniqueStampID
        // console.log(dbListOfArtifactsAndAssociatedStamps)
        
    }

    // Resetting dynamicSQLString to be reused.
    dynamicSQLString = ``
    const dbListOfStampAndAssociatedCategories = null
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) {
        // Retrieving stampID of the selected stamp.     
        dynamicSQLString = `SELECT stampID, catID, catLabel FROM (SELECT * FROM (SELECT Stamps.stampID, Stamps_Categories_Bridge.catID AS CatIDFromBridge FROM Stamps INNER JOIN Stamps_Categories_Bridge ON Stamps.stampID = Stamps_Categories_Bridge.stampID WHERE Stamps.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID}) AS St_Cat_BridgeAssociations INNER JOIN Categories ON St_Cat_BridgeAssociations.CatIDFromBridge = Categories.catID) AS St_Cat_Bridge_CategoriesAssociations;`

        // Dynamic DB API call that returns all associated categories of a stamp (after previous promise is resolved).
        const dbListOfStampAndAssociatedCategories = await dbConn.promise().execute(
            dynamicSQLString
        )
        
        // Building a result set that ultimately provides a list of artifacts and associated dependencies to be rendered on the UI.
    
        // For each stamp object, adding a category property that may consist of a list of category objects (no tags yet).         
        dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'] = []
        for (const categoryIndex in dbListOfStampAndAssociatedCategories[0]) {
            // Pushing category to associated stamp if stampIDs match.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID == dbListOfStampAndAssociatedCategories[0][categoryIndex].stampID) {
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'].push(dbListOfStampAndAssociatedCategories[0][categoryIndex])
            }
        }        
        /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) start----------------------*/
        // Resetting dynamicSQLString to be reused.
        dynamicSQLString = ``
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Retrieving tag of the selected stamp.     
            // ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}
            dynamicSQLString = `SELECT * FROM (SELECT Stamps_Categories_Tags_Bridge.stampID, Stamps_Categories_Tags_Bridge.catID, Stamps_Categories_Tags_Bridge.tagID, Tags.tagLabel FROM Stamps_Categories_Tags_Bridge INNER JOIN Tags ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID WHERE Stamps_Categories_Tags_Bridge.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID} AND Stamps_Categories_Tags_Bridge.catID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}) AS Stamp_Cat_TagBridgeAssociations;`

            
            // Dynamic DB API call that returns all associated tags associated to a stamp that is within a category (after previous promise is resolved).
            const dbListOfCategoryAndAssociatedTags = await dbConn.promise().execute(
                dynamicSQLString
            )
            
            // Updating result set to add tags to a category within a stamp.
            // For each category object, adding a tags property that may consist of a list of tag objects. 
            dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'] = []
            for (const tagIndex in dbListOfCategoryAndAssociatedTags[0]) {
                // Pushing tags to associated category if catIDs match.
                if (dbListOfStampAndAssociatedCategories[0][categoryIndex].catID == dbListOfCategoryAndAssociatedTags[0][tagIndex].catID) {
                    dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'].push(dbListOfCategoryAndAssociatedTags[0][tagIndex])
                }
            }                
        } /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) end----------------------*/
        
                
    } /* ----------------------Part2 attaching categories to stamps end----------------------*/
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags. 

    // Removing "stub" categories that contain no tags (because only tags associated to a stamp are returned).
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) { 
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Checking if each category object's tags property is an empty list.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].tags.length == 0) {
                // Removing the object from category list because no associations between the stamp and tags were made.
                // delete dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex]
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories.splice(categoryIndex, 1)  // Where arguments = (position to start deletion, amount of records to delete)
            }
        }
    }
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags (which were related via a three-way table). 
    

        /* ----------------------Old Part3 attaching tags to categories start----------------------*/
        /*
        // Resetting dynamicSQLString to be reused.
        dynamicSQLString = ``
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Retrieving stampID of the selected stamp.     
            dynamicSQLString = `SELECT catID, tagID, tagLabel FROM (SELECT * FROM (SELECT Categories.catID, Categories_Tags_Bridge.tagID AS TagIDFromBridge FROM Categories INNER JOIN Categories_Tags_Bridge ON Categories.catID = Categories_Tags_Bridge.catID WHERE Categories.catID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}) AS Cat_Tag_BridgeAssociations INNER JOIN Tags ON Cat_Tag_BridgeAssociations.TagIDFromBridge = Tags.tagID ) AS Cat_Tag_Bridge_TagsAssociations;`

            // Dynamic DB API call that returns all associated tags of a category (after previous promise is resolved).
            const dbListOfCategoryAndAssociatedTags = await dbConn.promise().execute(
                dynamicSQLString
            )
            
            // Updating result set to add tags to a category within a stamp.
            // For each category object, adding a tags property that may consist of a list of tag objects. 
            dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'] = []
            for (const tagIndex in dbListOfCategoryAndAssociatedTags[0]) {
                // Pushing tags to associated category if catIDs match.
                if (dbListOfStampAndAssociatedCategories[0][categoryIndex].catID == dbListOfCategoryAndAssociatedTags[0][tagIndex].catID) {
                    dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'].push(dbListOfCategoryAndAssociatedTags[0][tagIndex])
                }
            }        
        }
        //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags. 
        //console.log(dbListOfArtifactsAndAssociatedStamps[0][0].categories[0].tags)
        */
        /* ----------------------Old Part3 attaching tags to categories end----------------------*/

    /*
    // Static DB API call that returns a list of artifacts and associated stamps.
    const dbListOfArtifactsAndAssociatedStamps = await dbConn.promise().execute(
        'SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged FROM `Artifacts` LEFT JOIN `Stamps` ON Artifacts.artifactID = Stamps.artifactID WHERE `title` LIKE ? ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;',
        [queryObj[0].input]
    )

    // Static DB API call that returns all associated categories of a stamp (after previous promise is resolved).
    const dbListOfStampAndAssociatedCategories = await dbConn.promise().execute(
        `SELECT stampID, catID, catLabel FROM (SELECT * FROM (SELECT Stamps.stampID, Stamps_Categories_Bridge.catID AS CatIDFromBridge FROM Stamps INNER JOIN Stamps_Categories_Bridge ON Stamps.stampID = Stamps_Categories_Bridge.stampID WHERE Stamps.stampID = ?) AS St_Cat_BridgeAssociations INNER JOIN Categories ON St_Cat_BridgeAssociations.CatIDFromBridge = Categories.catID) AS St_Cat_Bridge_CategoriesAssociations`,
        [dbListOfArtifactsAndAssociatedStamps[0][3].stampID]
    )

    // Static DB API call that returns all associated tags of a category (after previous promise is resolved).
    const dbListOfCategoryAndAssociatedTags = await dbConn.promise().execute(
        `SELECT catID, tagID, tagLabel FROM (SELECT * FROM (SELECT Categories.catID, Categories_Tags_Bridge.tagID AS TagIDFromBridge FROM Categories INNER JOIN Categories_Tags_Bridge ON Categories.catID = Categories_Tags_Bridge.catID WHERE Categories.catID = 2 ) AS Cat_Tag_BridgeAssociations INNER JOIN Tags ON Cat_Tag_BridgeAssociations.TagIDFromBridge = Tags.tagID ) AS Cat_Tag_Bridge_TagsAssociations`,
        [dbListOfStampAndAssociatedCategories[0][0].catID]
    )
    */
    

    // Building a result set that ultimately provides a list of artifacts and associated dependencies to be rendered on the UI.

    /* Example of creating an object property that consists of a list of objects.
        dbListOfStampAndAssociatedCategories[0][0]['tags'] = [{}]
        dbListOfStampAndAssociatedCategories[0][0]['tags'].push(dbListOfCategoryAndAssociatedTags[0][0].catID)
        console.log(dbListOfStampAndAssociatedCategories[0])
    */
    
    // For each category object, adding a tags property that may consist of a list of tag objects.
    // for (const categoryIndex in dbListOfStampAndAssociatedCategories[0]) {        
    //     dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'] = []
    //     for (const tagIndex in dbListOfCategoryAndAssociatedTags[0]) {
    //         // Pushing tags to associated category if catIDs match.
    //         if (dbListOfStampAndAssociatedCategories[0][categoryIndex].catID == dbListOfCategoryAndAssociatedTags[0][tagIndex].catID) {
    //             dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'].push(dbListOfCategoryAndAssociatedTags[0][tagIndex])
    //         }
    //     }        
    // }
    /*
    console.log(dbListOfStampAndAssociatedCategories[0])
    console.log(dbListOfStampAndAssociatedCategories[0][0].tags[0])
    console.log(dbListOfStampAndAssociatedCategories[0][0].tags[1])
    */

    // For each stamp object, adding a category property that may consist of a list of category objects (that also may contain nested tags). 
    // for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) {
    //     dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'] = []
    //     for (const categoryIndex in dbListOfStampAndAssociatedCategories[0]) {
    //         // Pushing category to associated stamp if stampIDs match.
    //         if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID == dbListOfStampAndAssociatedCategories[0][categoryIndex].stampID) {
    //             dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'].push(dbListOfStampAndAssociatedCategories[0][categoryIndex])
    //         }
    //     }
    // }

    /*
    // Debug through one stamp's categories property list of category objects, then tags property of list of tag objects.
    console.log(dbListOfArtifactsAndAssociatedStamps[0][3].categories)
    console.log(dbListOfArtifactsAndAssociatedStamps[0][3].categories[0].tags)
    */

    return dbListOfArtifactsAndAssociatedStamps[0]
}
/*
// Caller that accepts promise results when ready.
listArtifactInfoMatchingSearchFormQuery(queryObj).then(function(dbListOfArtifactsAndAssociatedStamps) {   
    
    // console.log(dbListOfArtifactsAndAssociatedStamps)

    // Condensing dbListOfArtifactsAndAssociatedStamps list of objects to only minimal properties required.
    var queryExactMatchResults = []
    var queryExactMatchResultsTempObj = {}
    
    for (const element in dbListOfArtifactsAndAssociatedStamps) {
        queryExactMatchResultsTempObj['stampID'] = dbListOfArtifactsAndAssociatedStamps[element].stampID
        queryExactMatchResultsTempObj['formatType'] = dbListOfArtifactsAndAssociatedStamps[element].formatType
        queryExactMatchResultsTempObj['artifactTitle'] = dbListOfArtifactsAndAssociatedStamps[element].title
        queryExactMatchResultsTempObj['shortName'] = dbListOfArtifactsAndAssociatedStamps[element].shortName
        queryExactMatchResultsTempObj['author'] = dbListOfArtifactsAndAssociatedStamps[element].author
        queryExactMatchResultsTempObj['views'] = dbListOfArtifactsAndAssociatedStamps[element].views
        queryExactMatchResultsTempObj['description'] = dbListOfArtifactsAndAssociatedStamps[element].descr
        queryExactMatchResultsTempObj['thumbnail'] = null
        queryExactMatchResultsTempObj['categories'] = dbListOfArtifactsAndAssociatedStamps[element].categories
        
        // Appending temporary object to list.
        queryExactMatchResults.push(queryExactMatchResultsTempObj)
        // Resetting temporary object.
        queryExactMatchResultsTempObj = {}
    }
    
    //console.log(dbListOfArtifactsAndAssociatedStamps[0].stampID)
    // console.log(queryExactMatchResults)

}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/

// ----------- Backup --------------
// // Function that returns a list of artifacts and associated stamps.
// async function listArtifactInfoMatchingSearchFormQueryPart1(queryObj) {
//     /*
//     Dynamic SQL creation outline:
//         Select *queryResults* From *queryReslts appropriate tables* WHERE query.row.field == query.row.input AND query.row2.field == query.row2.input

//         - Use named placeholders to match queryObj object attributes.

//         ORDER BY VIEW CTR
//     */

//     // dynamicSQLString = `SELECT * FROM Artifacts WHERE ${queryObj[0].field} LIKE '${queryObj[0].input}' ${queryObj[0].condition} ${queryObj[1].field} LIKE '${queryObj[1].input}';`
//     // console.log(dynamicSQLString, "<----")
//     // Equivalent SQL string: SELECT * FROM Artifacts WHERE Artifacts.title LIKE 'Pythagorean Theorem' AND 'Artifacts.formatType' LIKE '.MP4';
//     // const dbResults = await dbConn.promise().execute(
//     //     dynamicSQLString,
//     //     [queryObj]
//     // )   

//     const dbListOfArtifactsAndAssociatedStamps = await dbConn.promise().execute(
//         'SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged FROM `Artifacts` LEFT JOIN `Stamps` ON Artifacts.artifactID = Stamps.artifactID WHERE `title` LIKE ? ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;',
//         [queryObj[0].input]
//     )

//     queryExactMatchResults = dbListOfArtifactsAndAssociatedStamps[0]
//     // console.log(queryExactMatchResults)

//     return dbListOfArtifactsAndAssociatedStamps[0]
// }
// // Caller that accepts promise results when ready.
// listArtifactInfoMatchingSearchFormQueryPart1(queryObj).then(function(dbListOfArtifactsAndAssociatedStamps) {
//     // for (const element in dbResults) {
//     //     console.log(dbResults[element])
//     // }
//     listArtifactInfoMatchingSearchFormQueryPart2(queryObj, dbListOfArtifactsAndAssociatedStamps)
// }).catch(function(err) {
//     console.log(`Promise rejection error --> ${err}`)
// })


// // Function that returns all associated categories of a stamp.
// async function listArtifactInfoMatchingSearchFormQueryPart2(queryObj, dbListOfArtifactsAndAssociatedStamps) {
  
//     const stampID = 3;

//     const dbListOfStampAndAssociatedCategories = await dbConn.promise().execute(
//         `SELECT stampID, catID, catLabel FROM (SELECT * FROM (SELECT Stamps.stampID, Stamps_Categories_Bridge.catID AS CatIDFromBridge FROM Stamps INNER JOIN Stamps_Categories_Bridge ON Stamps.stampID = Stamps_Categories_Bridge.stampID WHERE Stamps.stampID = ?) AS St_Cat_BridgeAssociations INNER JOIN Categories ON St_Cat_BridgeAssociations.CatIDFromBridge = Categories.catID) AS St_Cat_Bridge_CategoriesAssociations`,
//         [stampID]
//     )

//     return dbListOfStampAndAssociatedCategories[0]
// }
// // Caller that accepts promise results when ready.
// listArtifactInfoMatchingSearchFormQueryPart2(queryObj).then(function(dbListOfStampAndAssociatedCategories) {
//     // for (const element in dbResults) {
//     //     console.log(dbResults[element])
//     // }
//     // console.log(dbListOfStampAndAssociatedCategories)
//     listArtifactInfoMatchingSearchFormQueryPart3(queryObj, dbListOfStampAndAssociatedCategories)

// }).catch(function(err) {
//     console.log(`Promise rejection error --> ${err}`)
// })


// // Function that returns all associated tags of a category.
// async function listArtifactInfoMatchingSearchFormQueryPart3(queryObj, dbListOfStampAndAssociatedCategories) {
  
//     const catID = 2;

//     const dbListOfCategoryAndAssociatedTags = await dbConn.promise().execute(
//         `SELECT catID, tagID, tagLabel FROM (SELECT * FROM (SELECT Categories.catID, Categories_Tags_Bridge.tagID AS TagIDFromBridge FROM Categories INNER JOIN Categories_Tags_Bridge ON Categories.catID = Categories_Tags_Bridge.catID WHERE Categories.catID = 2 ) AS Cat_Tag_BridgeAssociations INNER JOIN Tags ON Cat_Tag_BridgeAssociations.TagIDFromBridge = Tags.tagID ) AS Cat_Tag_Bridge_TagsAssociations`,
//         [catID]
//     )

//     console.log(dbListOfCategoryAndAssociatedTags, "<-------")

//     return dbListOfCategoryAndAssociatedTags[0]
// }
// // Caller that accepts promise results when ready.
// listArtifactInfoMatchingSearchFormQueryPart3(queryObj).then(function(dbListOfCategoryAndAssociatedTags) {
//     // for (const element in dbResults) {
//     //     console.log(dbResults[element])
//     // }
//     console.log("Entered promise acceptance scope")
// }).catch(function(err) {
//     console.log(`Promise rejection error --> ${err}`)
// })

// ----------- Backup End --------------



// Example input #1: title matching `Pythagorean Theorem` AND artifact type matching `.MP4` (video).
/*
queryObj = [
    {
        field: 'Artifacts.title',
        input: 'Pythagorean Theorem',
        condition: 'AND'
    },
    {
        field: 'Artifacts.title',
        input: 'Test Input',
        condition: 'AND'
    },
    {
        field: 'Artifacts.formatType',
        input: '.MP4',
        condition: 'AND'
    }
]
*/
// Function that returns a list of correlated artifacts and associated stamps based on user search query (correlated search phase 2).
async function listCorrelatedArtifactInfoMatchingSearchFormQuery(queryObj) {

    // Deep copy of queryObj to prevent the original one from being altered by the split.
    var queryObjDeepCopy = JSON.parse(JSON.stringify(queryObj))
    
    // Splitting every queryObj object's input property by white spaces in an attempt to find related results (e.g. "Pythagorean" OR "Theorem").
    for (const queryObjIndex in queryObjDeepCopy) {
        queryObjDeepCopy[queryObjIndex].input = queryObjDeepCopy[queryObjIndex].input.split(" ")
        // console.log(queryObjDeepCopy[queryObjIndex].input)
    }

    // console.log(queryObjDeepCopy, '<-1----')


    /* ----------------------Part1 building stamps start---------------------- */
    // var dynamicSQLString = `SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged FROM Artifacts LEFT JOIN Stamps ON Artifacts.artifactID = Stamps.artifactID WHERE `

    var dynamicSQLString = `SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged, Categories.catID, Categories.catLabel, Tags.tagID, Tags.tagLabel FROM Artifacts LEFT JOIN Stamps ON Artifacts.artifactID = Stamps.artifactID LEFT JOIN Stamps_Categories_Tags_Bridge ON Stamps.stampID = Stamps_Categories_Tags_Bridge.stampID LEFT JOIN Categories ON Stamps_Categories_Tags_Bridge.catID = Categories.catID LEFT JOIN Tags ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID WHERE `

    for (const queryObjIndex in queryObjDeepCopy) {

        for (const queryObjInputListIndex in queryObjDeepCopy[queryObjIndex].input) {
            // console.log(`queryObjInputListIndex: ${queryObjInputListIndex}`)
            // Excluding the last logical condition (e.g. OR) for the last query object input element. 
            if (queryObjDeepCopy[queryObjIndex].input.length - 1 != queryObjInputListIndex) {
                dynamicSQLString += `${queryObjDeepCopy[queryObjIndex].field} LIKE '%${queryObjDeepCopy[queryObjIndex].input[queryObjInputListIndex]}%' OR `
            } else {
                // Last query object input element.
                // Not the last query object.
                if (queryObjDeepCopy.length - 1 != queryObjIndex) {
                    dynamicSQLString += `${queryObjDeepCopy[queryObjIndex].field} LIKE '%${queryObjDeepCopy[queryObjIndex].input[queryObjInputListIndex]}%' AND `
                } else {
                    dynamicSQLString += `${queryObjDeepCopy[queryObjIndex].field} LIKE '%${queryObjDeepCopy[queryObjIndex].input[queryObjInputListIndex]}%'`
                }
                
            }                 
        }   
    }        

    dynamicSQLString += ` GROUP BY Stamps.stampID ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;`
    // dynamicSQLString += ` ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;`

    // console.log(`${dynamicSQLString} <--------------`)

    // Dynamic DB API call that returns a list of artifacts and associated stamps.
    const dbListOfArtifactsAndAssociatedStamps = await dbConn.promise().execute(
        dynamicSQLString
    )
    /* ----------------------Part1 building stamps ends---------------------- */

    /* ----------------------Part2 attaching categories to stamps start----------------------*/

    // Resetting dynamicSQLString to be reused.
    dynamicSQLString = ``
    const dbListOfStampAndAssociatedCategories = null
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) {
        // Retrieving stampID of the selected stamp.     
        dynamicSQLString = `SELECT stampID, catID, catLabel FROM (SELECT * FROM (SELECT Stamps.stampID, Stamps_Categories_Bridge.catID AS CatIDFromBridge FROM Stamps INNER JOIN Stamps_Categories_Bridge ON Stamps.stampID = Stamps_Categories_Bridge.stampID WHERE Stamps.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID}) AS St_Cat_BridgeAssociations INNER JOIN Categories ON St_Cat_BridgeAssociations.CatIDFromBridge = Categories.catID) AS St_Cat_Bridge_CategoriesAssociations;`

        // Dynamic DB API call that returns all associated categories of a stamp (after previous promise is resolved).
        const dbListOfStampAndAssociatedCategories = await dbConn.promise().execute(
            dynamicSQLString
        )
        
        // Building a result set that ultimately provides a list of artifacts and associated dependencies to be rendered on the UI.
    
        // For each stamp object, adding a category property that may consist of a list of category objects (no tags yet).         
        dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'] = []
        for (const categoryIndex in dbListOfStampAndAssociatedCategories[0]) {
            // Pushing category to associated stamp if stampIDs match.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID == dbListOfStampAndAssociatedCategories[0][categoryIndex].stampID) {
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'].push(dbListOfStampAndAssociatedCategories[0][categoryIndex])
            }
        }        
        /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) start----------------------*/
        // Resetting dynamicSQLString to be reused.
        dynamicSQLString = ``
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Retrieving tag of the selected stamp.     
            // ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}
            dynamicSQLString = `SELECT * FROM (SELECT Stamps_Categories_Tags_Bridge.stampID, Stamps_Categories_Tags_Bridge.catID, Stamps_Categories_Tags_Bridge.tagID, Tags.tagLabel FROM Stamps_Categories_Tags_Bridge INNER JOIN Tags ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID WHERE Stamps_Categories_Tags_Bridge.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID} AND Stamps_Categories_Tags_Bridge.catID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}) AS Stamp_Cat_TagBridgeAssociations;`

            
            // Dynamic DB API call that returns all associated tags associated to a stamp that is within a category (after previous promise is resolved).
            const dbListOfCategoryAndAssociatedTags = await dbConn.promise().execute(
                dynamicSQLString
            )
            
            // Updating result set to add tags to a category within a stamp.
            // For each category object, adding a tags property that may consist of a list of tag objects. 
            dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'] = []
            for (const tagIndex in dbListOfCategoryAndAssociatedTags[0]) {
                // Pushing tags to associated category if catIDs match.
                if (dbListOfStampAndAssociatedCategories[0][categoryIndex].catID == dbListOfCategoryAndAssociatedTags[0][tagIndex].catID) {
                    dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'].push(dbListOfCategoryAndAssociatedTags[0][tagIndex])
                }
            }                
        } /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) end----------------------*/
        

                
    } /* ----------------------Part2 attaching categories to stamps end----------------------*/
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags. 

    // Removing "stub" categories that contain no tags (because only tags associated to a stamp are returned).
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) { 
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Checking if each category object's tags property is an empty list.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].tags.length == 0) {
                // Removing the object from category list because no associations between the stamp and tags were made.
                // delete dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex]
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories.splice(categoryIndex, 1)  // Where arguments = (position to start deletion, amount of records to delete)
            }
        }
    }
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags (which were related via a three-way table). 
    

    return dbListOfArtifactsAndAssociatedStamps[0]
}
/*
// Caller that accepts promise results when ready.
listCorrelatedArtifactInfoMatchingSearchFormQuery(queryObj).then(function(dbListOfCorrelatedArtifactsAndAssociatedStamps) {   
    
    console.log(dbListOfCorrelatedArtifactsAndAssociatedStamps)

    // Condensing dbListOfCorrelatedArtifactsAndAssociatedStamps list of objects to only minimal properties required.
    var queryCorrelatedMatchResults = []
    var queryCorrelatedMatchResultsTempObj = {}
    
    for (const element in dbListOfCorrelatedArtifactsAndAssociatedStamps) {
        queryCorrelatedMatchResultsTempObj['stampID'] = dbListOfCorrelatedArtifactsAndAssociatedStamps[element].stampID
        queryCorrelatedMatchResultsTempObj['formatType'] = dbListOfCorrelatedArtifactsAndAssociatedStamps[element].formatType
        queryCorrelatedMatchResultsTempObj['artifactTitle'] = dbListOfCorrelatedArtifactsAndAssociatedStamps[element].title
        queryCorrelatedMatchResultsTempObj['shortName'] = dbListOfCorrelatedArtifactsAndAssociatedStamps[element].shortName
        queryCorrelatedMatchResultsTempObj['author'] = dbListOfCorrelatedArtifactsAndAssociatedStamps[element].author
        queryCorrelatedMatchResultsTempObj['views'] = dbListOfCorrelatedArtifactsAndAssociatedStamps[element].views
        queryCorrelatedMatchResultsTempObj['description'] = dbListOfCorrelatedArtifactsAndAssociatedStamps[element].descr
        queryCorrelatedMatchResultsTempObj['thumbnail'] = null
        queryCorrelatedMatchResultsTempObj['categories'] = dbListOfCorrelatedArtifactsAndAssociatedStamps[element].categories
        
        // Appending temporary object to list.
        queryCorrelatedMatchResults.push(queryCorrelatedMatchResultsTempObj)
        // Resetting temporary object.
        queryCorrelatedMatchResultsTempObj = {}
    }
    
    //console.log(dbListOfCorrelatedArtifactsAndAssociatedStamps[0].stampID)
    // console.log(queryCorrelatedMatchResults)

}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns most viewed stamps and associated categories and tags.
async function listMostViewedStamps() {
    /* ----------------------Part1 building stamps start---------------------- */

    const dbListOfArtifactsAndAssociatedStamps = await dbConn.promise().execute(
        `SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged FROM Artifacts LEFT JOIN Stamps ON Artifacts.artifactID = Stamps.artifactID ORDER BY Stamps.views DESC, Stamps.thumbsUpCount DESC;`
    )

    /* ----------------------Part1 building stamps ends---------------------- */

    /* ----------------------Part2 attaching categories to stamps start----------------------*/

    // Resetting / initializing dynamicSQLString to be reused.
    dynamicSQLString = ``
    const dbListOfStampAndAssociatedCategories = null
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) {
        // Retrieving stampID of the selected stamp.     
        dynamicSQLString = `SELECT stampID, catID, catLabel FROM (SELECT * FROM (SELECT Stamps.stampID, Stamps_Categories_Bridge.catID AS CatIDFromBridge FROM Stamps INNER JOIN Stamps_Categories_Bridge ON Stamps.stampID = Stamps_Categories_Bridge.stampID WHERE Stamps.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID}) AS St_Cat_BridgeAssociations INNER JOIN Categories ON St_Cat_BridgeAssociations.CatIDFromBridge = Categories.catID) AS St_Cat_Bridge_CategoriesAssociations;`

        // Dynamic DB API call that returns all associated categories of a stamp (after previous promise is resolved).
        const dbListOfStampAndAssociatedCategories = await dbConn.promise().execute(
            dynamicSQLString
        )
        
        // Building a result set that ultimately provides a list of artifacts and associated dependencies to be rendered on the UI.
    
        // For each stamp object, adding a category property that may consist of a list of category objects (no tags yet).         
        dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'] = []
        for (const categoryIndex in dbListOfStampAndAssociatedCategories[0]) {
            // Pushing category to associated stamp if stampIDs match.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID == dbListOfStampAndAssociatedCategories[0][categoryIndex].stampID) {
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'].push(dbListOfStampAndAssociatedCategories[0][categoryIndex])
            }
        }        
        /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) start----------------------*/
        // Resetting dynamicSQLString to be reused.
        dynamicSQLString = ``
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Retrieving tag of the selected stamp.     
            // ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}
            dynamicSQLString = `SELECT * FROM (SELECT Stamps_Categories_Tags_Bridge.stampID, Stamps_Categories_Tags_Bridge.catID, Stamps_Categories_Tags_Bridge.tagID, Tags.tagLabel FROM Stamps_Categories_Tags_Bridge INNER JOIN Tags ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID WHERE Stamps_Categories_Tags_Bridge.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID} AND Stamps_Categories_Tags_Bridge.catID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}) AS Stamp_Cat_TagBridgeAssociations;`

            
            // Dynamic DB API call that returns all associated tags associated to a stamp that is within a category (after previous promise is resolved).
            const dbListOfCategoryAndAssociatedTags = await dbConn.promise().execute(
                dynamicSQLString
            )
            
            // Updating result set to add tags to a category within a stamp.
            // For each category object, adding a tags property that may consist of a list of tag objects. 
            dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'] = []
            for (const tagIndex in dbListOfCategoryAndAssociatedTags[0]) {
                // Pushing tags to associated category if catIDs match.
                if (dbListOfStampAndAssociatedCategories[0][categoryIndex].catID == dbListOfCategoryAndAssociatedTags[0][tagIndex].catID) {
                    dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'].push(dbListOfCategoryAndAssociatedTags[0][tagIndex])
                }
            }                
        } /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) end----------------------*/
        

                
    } /* ----------------------Part2 attaching categories to stamps end----------------------*/
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags. 

    // Removing "stub" categories that contain no tags (because only tags associated to a stamp are returned).
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) { 
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Checking if each category object's tags property is an empty list.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].tags.length == 0) {
                // Removing the object from category list because no associations between the stamp and tags were made.
                // delete dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex]
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories.splice(categoryIndex, 1)  // Where arguments = (position to start deletion, amount of records to delete)
            }
        }
    }
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags (which were related via a three-way table).

    return dbListOfArtifactsAndAssociatedStamps[0]
}
/*
// Caller that accepts promise results when ready.
listMostViewedStamps().then(function(dbResults) {   
    
    // Condensing dbListOfArtifactsAndAssociatedStamps list of objects to only minimal properties required.
    var resultSet = []
    var resultSetTempObj = {}
    
    for (const element in dbResults) {
        resultSetTempObj['stampID'] = dbResults[element].stampID
        resultSetTempObj['formatType'] = dbResults[element].formatType
        resultSetTempObj['artifactTitle'] = dbResults[element].title
        resultSetTempObj['shortName'] = dbResults[element].shortName
        resultSetTempObj['author'] = dbResults[element].author
        resultSetTempObj['views'] = dbResults[element].views
        resultSetTempObj['description'] = dbResults[element].descr
        resultSetTempObj['thumbnail'] = null
        resultSetTempObj['categories'] = dbResults[element].categories
        
        // Appending temporary object to list.
        resultSet.push(resultSetTempObj)
        // Resetting temporary object.
        resultSetTempObj = {}

        // Returning top 5 viewed stamps only.
        if(element == 4) {
            break;
        }
    }    
    console.log(resultSet)    

}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns most liked stamps and associated categories and tags.
async function listMostLikedStamps() {
    /* ----------------------Part1 building stamps start---------------------- */

    const dbListOfArtifactsAndAssociatedStamps = await dbConn.promise().execute(
        `SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged FROM Artifacts LEFT JOIN Stamps ON Artifacts.artifactID = Stamps.artifactID ORDER BY Stamps.thumbsUpCount DESC, Stamps.views DESC;`
    )

    /* ----------------------Part1 building stamps ends---------------------- */

    /* ----------------------Part2 attaching categories to stamps start----------------------*/

    // Resetting / initializing dynamicSQLString to be reused.
    dynamicSQLString = ``
    const dbListOfStampAndAssociatedCategories = null
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) {
        // Retrieving stampID of the selected stamp.     
        dynamicSQLString = `SELECT stampID, catID, catLabel FROM (SELECT * FROM (SELECT Stamps.stampID, Stamps_Categories_Bridge.catID AS CatIDFromBridge FROM Stamps INNER JOIN Stamps_Categories_Bridge ON Stamps.stampID = Stamps_Categories_Bridge.stampID WHERE Stamps.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID}) AS St_Cat_BridgeAssociations INNER JOIN Categories ON St_Cat_BridgeAssociations.CatIDFromBridge = Categories.catID) AS St_Cat_Bridge_CategoriesAssociations;`

        // Dynamic DB API call that returns all associated categories of a stamp (after previous promise is resolved).
        const dbListOfStampAndAssociatedCategories = await dbConn.promise().execute(
            dynamicSQLString
        )
        
        // Building a result set that ultimately provides a list of artifacts and associated dependencies to be rendered on the UI.
    
        // For each stamp object, adding a category property that may consist of a list of category objects (no tags yet).         
        dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'] = []
        for (const categoryIndex in dbListOfStampAndAssociatedCategories[0]) {
            // Pushing category to associated stamp if stampIDs match.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID == dbListOfStampAndAssociatedCategories[0][categoryIndex].stampID) {
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'].push(dbListOfStampAndAssociatedCategories[0][categoryIndex])
            }
        }        
        /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) start----------------------*/
        // Resetting dynamicSQLString to be reused.
        dynamicSQLString = ``
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Retrieving tag of the selected stamp.     
            // ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}
            dynamicSQLString = `SELECT * FROM (SELECT Stamps_Categories_Tags_Bridge.stampID, Stamps_Categories_Tags_Bridge.catID, Stamps_Categories_Tags_Bridge.tagID, Tags.tagLabel FROM Stamps_Categories_Tags_Bridge INNER JOIN Tags ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID WHERE Stamps_Categories_Tags_Bridge.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID} AND Stamps_Categories_Tags_Bridge.catID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}) AS Stamp_Cat_TagBridgeAssociations;`

            
            // Dynamic DB API call that returns all associated tags associated to a stamp that is within a category (after previous promise is resolved).
            const dbListOfCategoryAndAssociatedTags = await dbConn.promise().execute(
                dynamicSQLString
            )
            
            // Updating result set to add tags to a category within a stamp.
            // For each category object, adding a tags property that may consist of a list of tag objects. 
            dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'] = []
            for (const tagIndex in dbListOfCategoryAndAssociatedTags[0]) {
                // Pushing tags to associated category if catIDs match.
                if (dbListOfStampAndAssociatedCategories[0][categoryIndex].catID == dbListOfCategoryAndAssociatedTags[0][tagIndex].catID) {
                    dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'].push(dbListOfCategoryAndAssociatedTags[0][tagIndex])
                }
            }                
        } /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) end----------------------*/
        

                
    } /* ----------------------Part2 attaching categories to stamps end----------------------*/
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags. 

    // Removing "stub" categories that contain no tags (because only tags associated to a stamp are returned).
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) { 
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Checking if each category object's tags property is an empty list.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].tags.length == 0) {
                // Removing the object from category list because no associations between the stamp and tags were made.
                // delete dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex]
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories.splice(categoryIndex, 1)  // Where arguments = (position to start deletion, amount of records to delete)
            }
        }
    }
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags (which were related via a three-way table).

    return dbListOfArtifactsAndAssociatedStamps[0]
}
/*
// Caller that accepts promise results when ready.
listMostLikedStamps().then(function(dbResults) {   
    
    // Condensing dbListOfArtifactsAndAssociatedStamps list of objects to only minimal properties required.
    var resultSet = []
    var resultSetTempObj = {}
    
    for (const element in dbResults) {
        resultSetTempObj['stampID'] = dbResults[element].stampID
        resultSetTempObj['formatType'] = dbResults[element].formatType
        resultSetTempObj['artifactTitle'] = dbResults[element].title
        resultSetTempObj['shortName'] = dbResults[element].shortName
        resultSetTempObj['author'] = dbResults[element].author
        resultSetTempObj['views'] = dbResults[element].views
        resultSetTempObj['description'] = dbResults[element].descr
        resultSetTempObj['thumbsUpCount'] = dbResults[element].thumbsUpCount
        resultSetTempObj['thumbsDownCount'] = dbResults[element].thumbsDownCount
        resultSetTempObj['thumbnail'] = null
        resultSetTempObj['categories'] = dbResults[element].categories
        
        // Appending temporary object to list.
        resultSet.push(resultSetTempObj)
        // Resetting temporary object.
        resultSetTempObj = {}

        // Returning top 5 liked stamps only.
        if(element == 4) {
            break;
        }
    }    
    console.log(resultSet)    

}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns an artifact by artifact ID and associated stamp, categories, and tag data.
// const artifactID = 1
async function listArtifactDetailsByArtifactID(artifactID) {

    /* ----------------------Part1 building stamps start---------------------- */

    const dbListOfArtifactsAndAssociatedStamps = await dbConn.promise().execute(
        `SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged FROM Artifacts LEFT JOIN Stamps ON Artifacts.artifactID = Stamps.artifactID WHERE Artifacts.artifactID = ? ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;`,
        [artifactID]
    )
    /* ----------------------Part1 building stamps ends---------------------- */

    /* ----------------------Part2 attaching categories to stamps start----------------------*/

    // Resetting dynamicSQLString to be reused.
    dynamicSQLString = ``
    const dbListOfStampAndAssociatedCategories = null
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) {
        // Retrieving stampID of the selected stamp.     
        dynamicSQLString = `SELECT stampID, catID, catLabel FROM (SELECT * FROM (SELECT Stamps.stampID, Stamps_Categories_Bridge.catID AS CatIDFromBridge FROM Stamps INNER JOIN Stamps_Categories_Bridge ON Stamps.stampID = Stamps_Categories_Bridge.stampID WHERE Stamps.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID}) AS St_Cat_BridgeAssociations INNER JOIN Categories ON St_Cat_BridgeAssociations.CatIDFromBridge = Categories.catID) AS St_Cat_Bridge_CategoriesAssociations;`

        // Dynamic DB API call that returns all associated categories of a stamp (after previous promise is resolved).
        const dbListOfStampAndAssociatedCategories = await dbConn.promise().execute(
            dynamicSQLString
        )
        
        // Building a result set that ultimately provides a list of artifacts and associated dependencies to be rendered on the UI.
    
        // For each stamp object, adding a category property that may consist of a list of category objects (no tags yet).         
        dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'] = []
        for (const categoryIndex in dbListOfStampAndAssociatedCategories[0]) {
            // Pushing category to associated stamp if stampIDs match.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID == dbListOfStampAndAssociatedCategories[0][categoryIndex].stampID) {
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'].push(dbListOfStampAndAssociatedCategories[0][categoryIndex])
            }
        }        

        /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) start----------------------*/
        // Resetting dynamicSQLString to be reused.
        dynamicSQLString = ``
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Retrieving tag of the selected stamp.     
            // ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}
            dynamicSQLString = `SELECT * FROM (SELECT Stamps_Categories_Tags_Bridge.stampID, Stamps_Categories_Tags_Bridge.catID, Stamps_Categories_Tags_Bridge.tagID, Tags.tagLabel FROM Stamps_Categories_Tags_Bridge INNER JOIN Tags ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID WHERE Stamps_Categories_Tags_Bridge.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID} AND Stamps_Categories_Tags_Bridge.catID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}) AS Stamp_Cat_TagBridgeAssociations;`

            // Dynamic DB API call that returns all associated tags associated to a stamp that is within a category (after previous promise is resolved).
            const dbListOfCategoryAndAssociatedTags = await dbConn.promise().execute(
                dynamicSQLString
            )

            
            // Updating result set to add tags to a category within a stamp.
            // For each category object, adding a tags property that may consist of a list of tag objects. 
            dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'] = []
            for (const tagIndex in dbListOfCategoryAndAssociatedTags[0]) {
                // Pushing tags to associated category if catIDs match.
                if (dbListOfStampAndAssociatedCategories[0][categoryIndex].catID == dbListOfCategoryAndAssociatedTags[0][tagIndex].catID) {
                    dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'].push(dbListOfCategoryAndAssociatedTags[0][tagIndex])
                }
            }                
        } /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) end----------------------*/
                
    } /* ----------------------Part2 attaching categories to stamps end----------------------*/
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags. 

    // Removing "stub" categories that contain no tags (because only tags associated to a stamp are returned).
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) { 
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Checking if each category object's tags property is an empty list.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].tags.length == 0) {
                // Removing the object from category list because no associations between the stamp and tags were made.
                // delete dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex]
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories.splice(categoryIndex, 1)  // Where arguments = (position to start deletion, amount of records to delete)
            }
        }
    }
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags (which were related via a three-way table). 

    return dbListOfArtifactsAndAssociatedStamps[0]
    
}
/*
// Caller that accepts promise results when ready.
listArtifactDetailsByArtifactID(artifactID).then(function(dbArtifactResult) {   
    
    // Checking if records exist for the provided artifactID argument.
    if (dbArtifactResult.length != 0) {        
        // console.log(dbArtifactResult)

        // Condensing dbArtifactResult list of objects to only minimal properties required.
        
        // Artifact information is the same throughout all records.
        var artifactResultObj = {
            'artifactID' : dbArtifactResult[0].artifactID,
            'location' : dbArtifactResult[0].location,
            'formatType' : dbArtifactResult[0].formatType,
            'artifactTitle' : dbArtifactResult[0].title,
            'author' : dbArtifactResult[0].author,
            'description' : dbArtifactResult[0].descr,
            'stamps' : []
        }
        var stampResultTempObj = {}

        // Determing appropriate stamp type for artifact.
        function resolveStampType() {
            artifactStampType = null
            if (dbArtifactResult[0].aTimestamp != null) {
                artifactStampType = dbArtifactResult[0].aTimestamp
            } else if (dbArtifactResult[0].pageNumber != null) {
                artifactStampType = dbArtifactResult[0].pageNumber
            } else if (dbArtifactResult[0].sectionPercentage != null) {
                artifactStampType = dbArtifactResult[0].sectionPercentage
            } else {
                artifactStampType = `Unknown stamp type for artifact.`
            }

            return artifactStampType
        }
        
        for (const element in dbArtifactResult) {      
            stampResultTempObj['stampID'] = dbArtifactResult[element].stampID
            stampResultTempObj['timestamp/pageNumber/section'] = resolveStampType()        
            stampResultTempObj['stampTitle'] = dbArtifactResult[element].shortName        
            stampResultTempObj['categories'] = dbArtifactResult[element].categories

            // Pushing temporary stamp object to the stamps property of artifactResultObj.
            artifactResultObj.stamps.push(stampResultTempObj)

            // Resetting temporary object.
            stampResultTempObj = {}

        }    

        console.log(artifactResultObj)

    } else {
        console.log(`No records match the artifactID of ${artifactID}`)
    }

}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns an artifact by stamp ID and associated stamp, categories, and tag data.
const stampID = 3
async function listArtifactDetailsByStampID(stampID) {

    /* ----------------------Part1 building stamps start---------------------- */

    const dbListOfArtifactsAndAssociatedStamps = await dbConn.promise().execute(
        `SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged FROM Artifacts LEFT JOIN Stamps ON Artifacts.artifactID = Stamps.artifactID WHERE Stamps.stampID = ? ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;`,
        [stampID]
    )

    /* ----------------------Part1 building stamps ends---------------------- */

    /* ----------------------Part2 attaching categories to stamps start----------------------*/

    // Resetting dynamicSQLString to be reused.
    dynamicSQLString = ``
    const dbListOfStampAndAssociatedCategories = null
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) {
        // Retrieving stampID of the selected stamp.     
        dynamicSQLString = `SELECT stampID, catID, catLabel FROM (SELECT * FROM (SELECT Stamps.stampID, Stamps_Categories_Bridge.catID AS CatIDFromBridge FROM Stamps INNER JOIN Stamps_Categories_Bridge ON Stamps.stampID = Stamps_Categories_Bridge.stampID WHERE Stamps.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID}) AS St_Cat_BridgeAssociations INNER JOIN Categories ON St_Cat_BridgeAssociations.CatIDFromBridge = Categories.catID) AS St_Cat_Bridge_CategoriesAssociations;`

        // Dynamic DB API call that returns all associated categories of a stamp (after previous promise is resolved).
        const dbListOfStampAndAssociatedCategories = await dbConn.promise().execute(
            dynamicSQLString
        )
        
        // Building a result set that ultimately provides a list of artifacts and associated dependencies to be rendered on the UI.
    
        // For each stamp object, adding a category property that may consist of a list of category objects (no tags yet).         
        dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'] = []
        for (const categoryIndex in dbListOfStampAndAssociatedCategories[0]) {
            // Pushing category to associated stamp if stampIDs match.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID == dbListOfStampAndAssociatedCategories[0][categoryIndex].stampID) {
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'].push(dbListOfStampAndAssociatedCategories[0][categoryIndex])
            }
        }        

        /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) start----------------------*/
        // Resetting dynamicSQLString to be reused.
        dynamicSQLString = ``
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Retrieving tag of the selected stamp.     
            // ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}
            dynamicSQLString = `SELECT * FROM (SELECT Stamps_Categories_Tags_Bridge.stampID, Stamps_Categories_Tags_Bridge.catID, Stamps_Categories_Tags_Bridge.tagID, Tags.tagLabel FROM Stamps_Categories_Tags_Bridge INNER JOIN Tags ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID WHERE Stamps_Categories_Tags_Bridge.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID} AND Stamps_Categories_Tags_Bridge.catID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}) AS Stamp_Cat_TagBridgeAssociations;`

            // Dynamic DB API call that returns all associated tags associated to a stamp that is within a category (after previous promise is resolved).
            const dbListOfCategoryAndAssociatedTags = await dbConn.promise().execute(
                dynamicSQLString
            )

            
            // Updating result set to add tags to a category within a stamp.
            // For each category object, adding a tags property that may consist of a list of tag objects. 
            dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'] = []
            for (const tagIndex in dbListOfCategoryAndAssociatedTags[0]) {
                // Pushing tags to associated category if catIDs match.
                if (dbListOfStampAndAssociatedCategories[0][categoryIndex].catID == dbListOfCategoryAndAssociatedTags[0][tagIndex].catID) {
                    dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'].push(dbListOfCategoryAndAssociatedTags[0][tagIndex])
                }
            }                
        } /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) end----------------------*/
                
    } /* ----------------------Part2 attaching categories to stamps end----------------------*/
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags. 

    // Removing "stub" categories that contain no tags (because only tags associated to a stamp are returned).
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) { 
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Checking if each category object's tags property is an empty list.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].tags.length == 0) {
                // Removing the object from category list because no associations between the stamp and tags were made.
                // delete dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex]
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories.splice(categoryIndex, 1)  // Where arguments = (position to start deletion, amount of records to delete)
            }
        }
    }
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags (which were related via a three-way table). 

    return dbListOfArtifactsAndAssociatedStamps[0]
    
}
/*
// Caller that accepts promise results when ready.
listArtifactDetailsByStampID(stampID).then(function(dbArtifactResult) {   
    
    // Checking if records exist for the provided artifactID argument.
    if (dbArtifactResult.length != 0) {        
        // console.log(dbArtifactResult)

        // Condensing dbArtifactResult list of objects to only minimal properties required.
        
        // Artifact information is the same throughout all records.
        var artifactResultObj = {
            'artifactID' : dbArtifactResult[0].artifactID,
            'location' : dbArtifactResult[0].location,
            'formatType' : dbArtifactResult[0].formatType,
            'artifactTitle' : dbArtifactResult[0].title,
            'author' : dbArtifactResult[0].author,
            'description' : dbArtifactResult[0].descr,
            'stamps' : []
        }
        var stampResultTempObj = {}

        // Determing appropriate stamp type for artifact.
        function resolveStampType() {
            artifactStampType = null
            
            if (dbArtifactResult[0].aTimestamp != null) {
                artifactStampType = dbArtifactResult[0].aTimestamp
            } else if (dbArtifactResult[0].pageNumber != null) {
                artifactStampType = dbArtifactResult[0].pageNumber
            } else if (dbArtifactResult[0].sectionPercentage != null) {
                artifactStampType = dbArtifactResult[0].sectionPercentage
            } else {
                artifactStampType = `Unknown stamp type for artifact.`
            }

            return artifactStampType
        }
        
        for (const element in dbArtifactResult) {      
            stampResultTempObj['stampID'] = dbArtifactResult[element].stampID
            stampResultTempObj['timestamp/pageNumber/section'] = resolveStampType()        
            stampResultTempObj['stampTitle'] = dbArtifactResult[element].shortName        
            stampResultTempObj['categories'] = dbArtifactResult[element].categories

            // Pushing temporary stamp object to the stamps property of artifactResultObj.
            artifactResultObj.stamps.push(stampResultTempObj)

            // Resetting temporary object.
            stampResultTempObj = {}

        }    

        console.log(artifactResultObj)

    } else {
        console.log(`No records match the stampID of ${stampID}`)
    }

}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns a list of stamps (including artifacts and associated categories and tags) where isFlagged = 1 (or true).
async function listFlaggedStamps() {

    /* ----------------------Part1 building stamps start---------------------- */

    const dbListOfArtifactsAndAssociatedStamps = await dbConn.promise().execute(
        `SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged FROM Artifacts LEFT JOIN Stamps ON Artifacts.artifactID = Stamps.artifactID WHERE isFlagged = 1 ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;`
    )
    /* ----------------------Part1 building stamps ends---------------------- */

    /* ----------------------Part2 attaching categories to stamps start----------------------*/

    // Resetting dynamicSQLString to be reused.
    dynamicSQLString = ``
    const dbListOfStampAndAssociatedCategories = null
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) {
        // Retrieving stampID of the selected stamp.     
        dynamicSQLString = `SELECT stampID, catID, catLabel FROM (SELECT * FROM (SELECT Stamps.stampID, Stamps_Categories_Bridge.catID AS CatIDFromBridge FROM Stamps INNER JOIN Stamps_Categories_Bridge ON Stamps.stampID = Stamps_Categories_Bridge.stampID WHERE Stamps.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID}) AS St_Cat_BridgeAssociations INNER JOIN Categories ON St_Cat_BridgeAssociations.CatIDFromBridge = Categories.catID) AS St_Cat_Bridge_CategoriesAssociations;`

        // Dynamic DB API call that returns all associated categories of a stamp (after previous promise is resolved).
        const dbListOfStampAndAssociatedCategories = await dbConn.promise().execute(
            dynamicSQLString
        )
        
        // Building a result set that ultimately provides a list of artifacts and associated dependencies to be rendered on the UI.
    
        // For each stamp object, adding a category property that may consist of a list of category objects (no tags yet).         
        dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'] = []
        for (const categoryIndex in dbListOfStampAndAssociatedCategories[0]) {
            // Pushing category to associated stamp if stampIDs match.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID == dbListOfStampAndAssociatedCategories[0][categoryIndex].stampID) {
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'].push(dbListOfStampAndAssociatedCategories[0][categoryIndex])
            }
        }        

        /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) start----------------------*/
        // Resetting dynamicSQLString to be reused.
        dynamicSQLString = ``
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Retrieving tag of the selected stamp.     
            // ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}
            dynamicSQLString = `SELECT * FROM (SELECT Stamps_Categories_Tags_Bridge.stampID, Stamps_Categories_Tags_Bridge.catID, Stamps_Categories_Tags_Bridge.tagID, Tags.tagLabel FROM Stamps_Categories_Tags_Bridge INNER JOIN Tags ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID WHERE Stamps_Categories_Tags_Bridge.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID} AND Stamps_Categories_Tags_Bridge.catID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}) AS Stamp_Cat_TagBridgeAssociations;`

            // Dynamic DB API call that returns all associated tags associated to a stamp that is within a category (after previous promise is resolved).
            const dbListOfCategoryAndAssociatedTags = await dbConn.promise().execute(
                dynamicSQLString
            )

            
            // Updating result set to add tags to a category within a stamp.
            // For each category object, adding a tags property that may consist of a list of tag objects. 
            dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'] = []
            for (const tagIndex in dbListOfCategoryAndAssociatedTags[0]) {
                // Pushing tags to associated category if catIDs match.
                if (dbListOfStampAndAssociatedCategories[0][categoryIndex].catID == dbListOfCategoryAndAssociatedTags[0][tagIndex].catID) {
                    dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'].push(dbListOfCategoryAndAssociatedTags[0][tagIndex])
                }
            }                
        } /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) end----------------------*/
                
    } /* ----------------------Part2 attaching categories to stamps end----------------------*/
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags. 

    // Removing "stub" categories that contain no tags (because only tags associated to a stamp are returned).
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) { 
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Checking if each category object's tags property is an empty list.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].tags.length == 0) {
                // Removing the object from category list because no associations between the stamp and tags were made.
                // delete dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex]
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories.splice(categoryIndex, 1)  // Where arguments = (position to start deletion, amount of records to delete)
            }
        }
    }
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags (which were related via a three-way table). 

    return dbListOfArtifactsAndAssociatedStamps[0]
    
}
/*
// Caller that accepts promise results when ready.
listFlaggedStamps().then(function(dbResult) {   
    
    // console.log(dbResult)

    
    var dbStampResult = []

        if (dbResult.length != 0) {
            // console.log(dbListOfArtifactsAndAssociatedStamps)

            // Condensing dbListOfArtifactsAndAssociatedStamps list of objects to only minimal properties required.
            var tempObj = {}

            for (const element in dbResult) {
                tempObj['stampID'] = dbResult[element].stampID
                tempObj['formatType'] = dbResult[element].formatType
                tempObj['location'] = dbResult[element].location
                tempObj['artifactTitle'] = dbResult[element].title
                tempObj['shortName'] = dbResult[element].shortName
                tempObj['author'] = dbResult[element].author
                tempObj['views'] = dbResult[element].views
                tempObj['description'] = dbResult[element].descr
                tempObj['thumbnail'] = null
                tempObj['isFlagged'] = dbResult[element].isFlagged
                tempObj['categories'] = dbResult[element].categories

                // Appending temporary object to list.
                dbStampResult.push(tempObj)
                // Resetting temporary object.
                tempObj = {}
            }


            console.log("--------------Entered middleware-------------")
            // console.log(dbStampResult)

    } else {
        console.log(`No records match the artifactID of ${artifactID}`)
    }
    

}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/

// Function that returns a stamp and associated categories and tag data by stampID and userID (retrieved by session).
// const stampID = 7
// const userID = 2  // Session table userID
async function listStampByID(stampID, userID) {

    /* ----------------------Part1 building stamps start---------------------- */

    const dbListOfArtifactsAndAssociatedStamps = await dbConn.promise().execute(
        `SELECT Artifacts.artifactID, Artifacts.userID, Artifacts.title, Artifacts.descr, Artifacts.author, Artifacts.formatType, Artifacts.location, 
        Stamps.stampID, Stamps.aTimestamp, Stamps.pageNumber, Stamps.sectionPercentage, Stamps.shortName, Stamps.views, Stamps.thumbsUpCount, Stamps.thumbsDownCount, Stamps.isFlagged,
        Sessions.stampID AS SessionsStampID, Sessions.lastAccessedDate, Sessions.duration, Sessions.hasThumbUp, Sessions.hasThumbDown FROM Artifacts LEFT JOIN Stamps ON Artifacts.artifactID = Stamps.artifactID LEFT JOIN Sessions ON Stamps.stampID = Sessions.stampID WHERE Sessions.stampID = ? AND Sessions.userID = ? ORDER BY Stamps.stampID DESC, Artifacts.artifactID ASC;`,
        [stampID, userID]
    )
    /* ----------------------Part1 building stamps ends---------------------- */

    /* ----------------------Part2 attaching categories to stamps start----------------------*/

    // Resetting dynamicSQLString to be reused.
    dynamicSQLString = ``
    const dbListOfStampAndAssociatedCategories = null
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) {
        // Retrieving stampID of the selected stamp.     
        dynamicSQLString = `SELECT stampID, catID, catLabel FROM (SELECT * FROM (SELECT Stamps.stampID, Stamps_Categories_Bridge.catID AS CatIDFromBridge FROM Stamps INNER JOIN Stamps_Categories_Bridge ON Stamps.stampID = Stamps_Categories_Bridge.stampID WHERE Stamps.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID}) AS St_Cat_BridgeAssociations INNER JOIN Categories ON St_Cat_BridgeAssociations.CatIDFromBridge = Categories.catID) AS St_Cat_Bridge_CategoriesAssociations;`

        // Dynamic DB API call that returns all associated categories of a stamp (after previous promise is resolved).
        const dbListOfStampAndAssociatedCategories = await dbConn.promise().execute(
            dynamicSQLString
        )
        
        // Building a result set that ultimately provides a list of artifacts and associated dependencies to be rendered on the UI.
    
        // For each stamp object, adding a category property that may consist of a list of category objects (no tags yet).         
        dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'] = []
        for (const categoryIndex in dbListOfStampAndAssociatedCategories[0]) {
            // Pushing category to associated stamp if stampIDs match.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID == dbListOfStampAndAssociatedCategories[0][categoryIndex].stampID) {
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex]['categories'].push(dbListOfStampAndAssociatedCategories[0][categoryIndex])
            }
        }        

        /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) start----------------------*/
        // Resetting dynamicSQLString to be reused.
        dynamicSQLString = ``
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Retrieving tag of the selected stamp.     
            // ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}
            dynamicSQLString = `SELECT * FROM (SELECT Stamps_Categories_Tags_Bridge.stampID, Stamps_Categories_Tags_Bridge.catID, Stamps_Categories_Tags_Bridge.tagID, Tags.tagLabel FROM Stamps_Categories_Tags_Bridge INNER JOIN Tags ON Stamps_Categories_Tags_Bridge.tagID = Tags.tagID WHERE Stamps_Categories_Tags_Bridge.stampID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].stampID} AND Stamps_Categories_Tags_Bridge.catID = ${dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].catID}) AS Stamp_Cat_TagBridgeAssociations;`

            // Dynamic DB API call that returns all associated tags associated to a stamp that is within a category (after previous promise is resolved).
            const dbListOfCategoryAndAssociatedTags = await dbConn.promise().execute(
                dynamicSQLString
            )

            
            // Updating result set to add tags to a category within a stamp.
            // For each category object, adding a tags property that may consist of a list of tag objects. 
            dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'] = []
            for (const tagIndex in dbListOfCategoryAndAssociatedTags[0]) {
                // Pushing tags to associated category if catIDs match.
                if (dbListOfStampAndAssociatedCategories[0][categoryIndex].catID == dbListOfCategoryAndAssociatedTags[0][tagIndex].catID) {
                    dbListOfStampAndAssociatedCategories[0][categoryIndex]['tags'].push(dbListOfCategoryAndAssociatedTags[0][tagIndex])
                }
            }                
        } /* ----------------------Part3 attaching tags to associated stamps which is within a category (via three way bridge table) end----------------------*/
                
    } /* ----------------------Part2 attaching categories to stamps end----------------------*/
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags. 

    // Removing "stub" categories that contain no tags (because only tags associated to a stamp are returned).
    for (const stampIndex in dbListOfArtifactsAndAssociatedStamps[0]) { 
        for (const categoryIndex in dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories) {
            // Checking if each category object's tags property is an empty list.
            if (dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex].tags.length == 0) {
                // Removing the object from category list because no associations between the stamp and tags were made.
                // delete dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories[categoryIndex]
                dbListOfArtifactsAndAssociatedStamps[0][stampIndex].categories.splice(categoryIndex, 1)  // Where arguments = (position to start deletion, amount of records to delete)
            }
        }
    }
    //console.log(dbListOfArtifactsAndAssociatedStamps[0])  // At this point, all of the stamps have associated categories, with nested tags (which were related via a three-way table). 

    return dbListOfArtifactsAndAssociatedStamps[0]
    
}
/*
// Caller that accepts promise results when ready.
listStampByID(stampID, userID).then(function(dbResult) {   

    if (dbResult.length != 0) {
        console.log(dbResult)
    } else {
        console.log(`No records match the stampID of ${stampID} for the userID of ${userID}.`)
    }
    
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/




module.exports = {
    listAllArtifactAuthors, 
    listAllArtifactTitles, 
    listAllArtifactFormatTypes, 
    listAllCategories,
    listAllCategoriesWithID, 
    listAllTags,
    listAllTagsWithID,
    listArtifactInfoMatchingSearchFormQuery,
    listCorrelatedArtifactInfoMatchingSearchFormQuery,
    listMostViewedStamps,
    listMostLikedStamps,
    listArtifactDetailsByArtifactID,
    listArtifactDetailsByStampID,
    listFlaggedStamps,
    listStampByID,
    listArtifactWithStampsByTitleAndDescr // To be removed
}