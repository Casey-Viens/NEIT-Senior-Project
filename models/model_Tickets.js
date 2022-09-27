const dbConn = require('./db');

// Function that returns a ticket and related student information.
async function listTickets() {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Tickets`'
    )

    return dbResults[0];
}
/*  
// Caller that accepts promise results when ready.
listTickets().then(function(dbResults) {
    for (const element in dbResults) {
        console.log(dbResults[element])
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that returns a ticket by ID.
async function listTicketByID(ticketID) {
    const dbResults = await dbConn.promise().execute(
        'SELECT * FROM `Tickets` WHERE `ticketID` = ?',
        [ticketID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
listTicketByID(5).then(function(dbResults) {
    // Converting stored JSON object as a string back into JSON.
    // console.log(JSON.parse(dbResults[0].userSearchQuery))
    dbResults[0].userSearchQuery = JSON.parse(dbResults[0].userSearchQuery)
    // The dbResults's userSearchQuery property can be provided to listArtifactInfoMatchingSearchFormQuery as an argument to perform search (akin to top-navigation searching).
    console.log(dbResults[0])  

    
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Function that inserts a ticket.
async function insertTicket(userID, datePlaced, userQuery) {
    const dbResults = await dbConn.promise().execute(
        'INSERT INTO `Tickets` (`userID`, `datePlaced`, `userSearchQuery`) VALUES (?, ?, ?)',
        [userID, datePlaced, userQuery]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
queryObj = [
    {
        field: 'Artifacts.title',
        input: 'Pythagorean Theorem',
        condition: 'AND'
    }
]
insertTicket(2, '2022-07-22 17:25:50', queryObj).then(function(dbResults) {
    if (dbResults.affectedRows > 0) {
        console.log(`Successful insert.`)
    } else {
        console.log(`No record was inserted.`)
    }
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/



// Function that deletes a ticket.
async function deleteTicket(userID) {
    const dbResults = await dbConn.promise().execute(
        'DELETE FROM `Tickets` WHERE `ticketID` = ?',
        [userID]
    )

    return dbResults[0];
}
/*
// Caller that accepts promise results when ready.
deleteTicket(4).then(function(dbResults) {
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
    listTickets,
    listTicketByID,
    insertTicket,
    deleteTicket
}