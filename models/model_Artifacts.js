const dbConn = require('./db');
// Allows writing and reading to a file.
const fs = require('fs')

// const dbAPICallbacks = require('../app_server/controllers/resultSetBuilder');

// Function that returns all artifacts.
async function listAllArtifacts() {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Artifacts`'
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listAllArtifacts().then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns all artifacts that match the provided userID.
async function listArtifactByUserID(userID) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Artifacts` WHERE `userID` = ?',
        [userID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listArtifactByUserID(2).then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns all artifacts that match the provided title.
async function listArtifactByTitle(title) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Artifacts` WHERE `title` = ?',
        [title]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listArtifactByTitle('Pythagorean Theorem').then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns all artifacts that match the provided description.
async function listArtifactByDescr(descr) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Artifacts` WHERE `descr` = ?',
        [descr]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listArtifactByDescr('TestDesc').then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns all artifacts that match the provided author.
async function listArtifactByAuthor(author) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Artifacts` WHERE `author` = ?',
        [author]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listArtifactByAuthor('Khan Academy').then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns all artifacts that match the provided format type.
async function listArtifactByFormatType(formatType) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Artifacts` WHERE `formatType` = ?',
        [formatType]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listArtifactByFormatType('.PDF').then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns all artifacts that match the provided arguments.
async function listArtifactByArgs(userID, title, descr, author, formatType) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Artifacts` WHERE `userID` = ? AND `title` = ? AND `descr` = ? AND `author` = ? AND `formatType` = ?',
        [userID, title, descr, author, formatType]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listArtifactByArgs(1, "Pythagorean Theorem", "Image PNG Test", "Khan Academy", ".PNG").then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that inserts an artifact.
async function insertArtifact(userID, title, descr, author, formatType, location) {
    const dbResults = await dbConn.promise().execute(
        'INSERT INTO `Artifacts` (`userID`, `title`, `descr`, `author`, `formatType`, `location`) VALUES (?, ?, ?, ?, ?, ?)',
        [userID, title, descr, author, formatType, location]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
insertArtifact(5, "TestInsert", "TestDesc", "UnknownAuthor", "OTHER", "TempLocation2").then(function (dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful insert.`)
    } else {
        console.log(`No record was inserted.`)
    }
}).catch(function (err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that calls insertArtifact(), insertCategory(), insertTag(), insertSession(), etc.
function saveArtifact() {

}

// Function that updates an artifact.
async function updateArtifact(artifactID, userID, title, descr, author, formatType, location) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Artifacts` SET `userID` = ?, `title` = ?, `descr` = ?, `author` = ?, `formatType` = ?, `location` = ? WHERE `artifactID` = ?',
        [userID, title, descr, author, formatType, location, artifactID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
updateArtifact(13, 3, "TestTitle", "TestDesc3", "UnknownAuthor2", ".PNG", "NewTempLoc").then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that updates an artifact's title, author, and description fields.
async function updateArtifactV2(artifactID, title, descr, author) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Artifacts` SET `title` = ?, `descr` = ?, `author` = ? WHERE `artifactID` = ?',
        [title, descr, author, artifactID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
updateArtifactV2(40, "testTitleChanged1", "TestDescChange", "testAuthorChange").then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that deletes an artifact.
async function deleteArtifact(artifactID) {
    const dbResults = await dbConn.promise().execute(
        'DELETE FROM `Artifacts` WHERE `artifactID` = ?',
        [artifactID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
deleteArtifact(13).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful deletion.`)
    } else {
        console.log(`No record was deleted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


/*
// Generic util function that dumps database API call results into a temporary txt file because of issues with passing data between .js files (e.g. callback, promises, and async & wait logic).
function dumpDBAPICallResultToTxtCB(retValue) {  
    someVar = retValue
    // console.log(`Entered callback`)
    
    fs.writeFile('./dump.txt', JSON.stringify(someVar), err => {
        if (err) {
            console.log(err)
        }
        console.log("Successfully writen to file.")
    });

    return someVar;
}
*/

module.exports = {
    listArtifactByTitle,
    listArtifactByDescr,
    updateArtifactV2,
    insertArtifact,
    deleteArtifact
}


