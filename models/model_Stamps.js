const dbConn = require('./db');

// Function that returns all stamps.
async function listAllStamps() {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Stamps`'
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listAllStamps().then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns all the stamps associated to this artifact (0, 1, or multiple).
async function listStampsByID(artifactID) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Stamps` WHERE `artifactID` = ?',
        [artifactID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listStampsByID(1).then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that adds a stamp to an artifact.
// Note: Only one of the following arguments should be added at a time: aTimestamp, pageNumber, or sectionPercentage.
async function insertStamp(artifactID, aTimestamp, pageNumber, sectionPercentage, shortName, views, thumbsUpCount, thumbsDownCount, isFlagged) {
    const dbResults = await dbConn.promise().execute(
        'INSERT INTO `Stamps` (`artifactID`, `aTimestamp`, `pageNumber`, `sectionPercentage`, `shortName`, `views`, `thumbsUpCount`, `thumbsDownCount`, `isFlagged`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [artifactID, aTimestamp, pageNumber, sectionPercentage, shortName, views, thumbsUpCount, thumbsDownCount, isFlagged]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
insertStamp(4, '01:58:42', null, null, 'timeStampTitleSample', 5, 1, 0, 0).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful insert.`)
    } else {
        console.log(`No record was inserted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that updates a stamp.
async function updateStamp(stampID, artifactID, aTimestamp, pageNumber, sectionPercentage, shortName, views, thumbsUpCount, thumbsDownCount, isFlagged) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Stamps` SET `artifactID` = ?, `aTimestamp` = ?, `pageNumber` = ?, `sectionPercentage` = ?, `shortName` = ?, `views` = ?, `thumbsUpCount` = ?, `thumbsDownCount` = ?, `isFlagged` = ? WHERE `stampID` = ?',
        [artifactID, aTimestamp, pageNumber, sectionPercentage, shortName, views, thumbsUpCount, thumbsDownCount, isFlagged, stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
updateStamp(8, 4, '02:11:53', null, null, 'timeStampTitleSample2', 20, 9, 2, 0).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that updates a stamp's aTimestamp/pageNumber/sectionPercentage and shortName fields.
async function updateStampV2(stampID, artifactID, aTimestamp, pageNumber, sectionPercentage, shortName) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Stamps` SET `artifactID` = ?, `aTimestamp` = ?, `pageNumber` = ?, `sectionPercentage` = ?, `shortName` = ? WHERE `stampID` = ?',
        [artifactID, aTimestamp, pageNumber, sectionPercentage, shortName, stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
updateStampV2(26, 4, '02:11:53', null, null, 'timeStampTitleSample2').then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that increments a stamp's views.
async function incrementViews(stampID) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Stamps` SET `views` = `views` + 1 WHERE `stampID` = ?',
        [stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
incrementViews(14).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that increments a stamp's thumbsUpCount.
async function incrementThumbsUpCount(stampID) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Stamps` SET `thumbsUpCount` = `thumbsUpCount` + 1 WHERE `stampID` = ?',
        [stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
incrementThumbsUpCount(14).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that decrements a stamp's thumbsUpCount.
async function decrementThumbsUpCount(stampID) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Stamps` SET `thumbsUpCount` = `thumbsUpCount` - 1 WHERE `stampID` = ?',
        [stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
decrementThumbsUpCount(14).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that increments a stamp's thumbsDownCount.
async function incrementThumbsDownCount(stampID) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Stamps` SET `thumbsDownCount` = `thumbsDownCount` + 1 WHERE `stampID` = ?',
        [stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
incrementThumbsDownCount(14).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that decrements a stamp's thumbsDownCount.
async function decrementThumbsDownCount(stampID) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Stamps` SET `thumbsDownCount` = `thumbsDownCount` - 1 WHERE `stampID` = ?',
        [stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
decrementThumbsDownCount(14).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that toggles a stamp's isFlagged to true.
async function setIsFlaggedToTrue(stampID) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Stamps` SET `isFlagged` = 1 WHERE `stampID` = ?',
        [stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
setIsFlaggedToTrue(14).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that toggles a stamp's isFlagged to false.
async function setIsFlaggedToFalse(stampID) {
    const dbResults = await dbConn.promise().execute(
        'UPDATE `Stamps` SET `isFlagged` = 0 WHERE `stampID` = ?',
        [stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
setIsFlaggedToFalse(14).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful update.`)
    } else {
        console.log(`No record was updated.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that deletes a stamp.
async function deleteStamp(stampID) {
    const dbResults = await dbConn.promise().execute(
        'DELETE FROM `Stamps` WHERE `stampID` = ?',
        [stampID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
deleteStamp(8).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful deletion.`)
    } else {
        console.log(`No record was deleted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns all stamps that are flagged (1 or TRUE).
async function listFlaggedStamps() {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Stamps` WHERE `isFlagged` = 1'
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listFlaggedStamps().then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that calls updateStamp() to reset a stamp's isFlagged value (to 0 or false).
function resetFlag() {

}

module.exports = {
    insertStamp,
    updateStampV2,
    incrementViews,
    incrementThumbsUpCount,
    decrementThumbsUpCount,
    incrementThumbsDownCount,
    decrementThumbsDownCount,
    setIsFlaggedToTrue,
    setIsFlaggedToFalse,
    deleteStamp
}