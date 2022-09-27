const dbCombined = require('../../models/model_Combined.js')
const dbArtifacts = require('../../models/model_Artifacts.js')
const dbStamps = require('../../models/model_Stamps.js')
const dbCategories = require('../../models/model_Categories.js')
const dbTags = require('../../models/model_Tags.js')
const dbStampCatTagConn = require('../../models/model_Stamps_Categories_Tags_Bridge.js')
const dbTickets = require('../../models/model_Tickets.js')
const dbSessions = require('../../models/model_Sessions.js')



const dateTimeUtil = require('../../utils/getDateTimeUtil.js')


//Temp Landing/Routing Page
const loginPage = (req, res) => {
    // console.log("Entered login page")
    res.render('loginPage');
}

/*
const loginPagePOST = (req, res) => {
    console.log("Login Page POST occurred.")
    // Successful redirect (to admin page for now).
    //console.log(`req.user --> ${req.user}`)
    res.render('searchPage');
}
*/

const logoutPOST = (req, res) => {
    req.logOut(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect('/index')
    })

    // req.session.destroy(function(err) {
    //     return res.redirect("/login");
    // });
}

/*
Start top nav array solution
*/
//Initialize arrays for top nav autocomplete lists
var authorArray;
var categoryArray;
var typeArray;
var tagArray;
var titleArray;

// define function to set lists
// Should replace fake arrays with dbqueries of actual arrays
function setTopNavArrays() {

    //db query
    // Asynchronous calls.
    const promise1 = dbCombined.listAllArtifactAuthors()
    const promise2 = dbCombined.listAllArtifactTitles()
    const promise3 = dbCombined.listAllArtifactFormatTypes()
    const promise4 = dbCombined.listAllCategories()
    const promise5 = dbCombined.listAllTags()


    // Waiting for asynchronous results from all asynchronous calls.
    Promise.all([promise1, promise2, promise3, promise4, promise5]).then((dbResults) => {
        // console.log(dbResults)

        // authorArray = ['Khan Academy', 'Free Code Camp', 'Professor Smith', 'The Math Guy']
        // categoryArray = ['Calculus', 'Geometry', 'Trigonometry', 'Algebra', 'Statistics']
        // typeArray = ['video', 'document', 'image']
        // tagArray = ['Sin', 'Sine', 'Cos', 'Cosine', 'Tan', 'Tangent', 'Linear', 'Exponential']
        // titleArray = ['Intro to Trigonometry', 'Advanced Geometry', 'Intro to Statistics', 'Algebra in 30 Seconds']

        authorArray = dbResults[0]
        titleArray = dbResults[1]
        typeArray = ['Video', 'Document', 'Image', 'Link']
        categoryArray = dbResults[3]
        tagArray = dbResults[4]



    })


}

// Call function once on server start to update base arrays
setTopNavArrays()

// Route for top nav to retrieve autocomplete arrays
const topNavArrays = (req, res) => {
    setTopNavArrays()  // Added because in Heroku, the application does not restart.
    res.json({ topNavArrays: { author: authorArray, category: categoryArray, type: typeArray, tag: tagArray, title: titleArray } })
}
/*
End top nav array solution
*/

const toggleDarkMode = (req, res) => {
    //Cannot edit user in passport session, using cookies to set and update darkmode instead
    if (req.cookies.isDarkMode == null) {
        // console.log('Setting darkMode')
        res.cookie('isDarkMode', true)
    } else {
        // console.log('Toggleing Dark Mode, previously:', req.cookies.isDarkMode, 'Now: ', !(req.cookies.isDarkMode == 'true'))
        res.cookie('isDarkMode', !(req.cookies.isDarkMode == 'true'))
    }


    res.json({ success: true })
}


// Shared searchPage landing page between admin and student
const searchPage = (req, res) => {

    if (req.user) {
        //console.log('searchPage req.user.isAdmin', req.user.isAdmin)
    }


    const promise1 = dbCombined.listMostViewedStamps()


    // Waiting for asynchronous results from all asynchronous calls.
    Promise.all([promise1]).then((dbResults) => {
        // console.log(dbResults)

        // Condensing dbListOfArtifactsAndAssociatedStamps list of objects to only minimal properties required.
        var resultSet = []
        var resultSetTempObj = {}

        for (const element in dbResults[0]) {
            resultSetTempObj['stampID'] = dbResults[0][element].stampID
            resultSetTempObj['formatType'] = dbResults[0][element].formatType
            resultSetTempObj['location'] = dbResults[0][element].location
            resultSetTempObj['artifactTitle'] = dbResults[0][element].title
            resultSetTempObj['shortName'] = dbResults[0][element].shortName
            resultSetTempObj['author'] = dbResults[0][element].author
            resultSetTempObj['views'] = dbResults[0][element].views
            resultSetTempObj['description'] = dbResults[0][element].descr
            resultSetTempObj['thumbnail'] = null
            resultSetTempObj['categories'] = dbResults[0][element].categories

            // Appending temporary object to list.
            resultSet.push(resultSetTempObj)
            // Resetting temporary object.
            resultSetTempObj = {}

            // Returning top 5 viewed stamps only.
            if (element == 4) {
                break;
            }
        }
        // console.log(resultSet)

        //console.log('before rendering searchPage isAdmin:', req.user.isAdmin)
        res.render('searchPage', { isAdmin: req.user.isAdmin, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), activePageSearch: true, basicResults: resultSet })

    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })
}

// Shared search Post between student and admin
const searchPagePOST = (req, res) => {

    // console.log("Row 1 field", req.body.row[0].field)
    // console.log("Row 1 input", req.body.row[0].input)
    // console.log("Row 1 condition", req.body.row[0].condition)
    //console.log('Form Data: ', req.body)

    /*
        mostViewStamps = [
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
                                catTitle: char,
                                tags: [
                                    tag: {
                                        isMatched: bool,
                                        tagTitle: char
                                    }
                                ]
                            }
                        ]
                    },
                    result2: {}
                ]
    */

    // Example input #1: title matching `Pythagorean Theorem` AND artifact type matching `.MP4` (video).
    // var queryObj = [
    //     {
    //         field: 'Artifacts.title',
    //         input: 'Pythagorean Theorem',
    //         condition: 'AND'
    //     }
    // ]

    // Note: For testing, start server at login page to avoid typeArray being defined as undefined.

    var queryObj = req.body.row;
    // console.log(queryObj)

    // Converting top navigation user friendly types (i.e. typeArray = ['Video', 'Document', 'Image']) to correct respective formatType (in preparartion for database).  Specifically, row entry input's property values are changed to the correct database formatTypes (e.g. "Video" from UI to ".MP4").
    for (const element in queryObj) {
        switch (queryObj[element].input) {
            case "Video":
                queryObj[element].input = "Video"
                // WHERE `title` LIKE '%Pythagorean Theorem%' AND Artifacts.formatType LIKE '.MP4' OR Artifacts.formatType LIKE 'Link'
                break;
            case "Link":
                queryObj[element].input = "Video"
                break;
            case "Document":
                queryObj[element].input = ".PDF"
                break;
            case "Image":
                queryObj[element].input = ".PNG"
                break;
            default:
            // Do nothing.
        }
    }

    // console.log(queryObj)

    const searchFormQueryProm = dbCombined.listArtifactInfoMatchingSearchFormQuery(queryObj)

    // Caller that accepts promise results when ready.
    searchFormQueryProm.then(function (dbListOfArtifactsAndAssociatedStamps) {

        var queryExactMatchResults = []

        if (dbListOfArtifactsAndAssociatedStamps.length != 0) {
            // console.log(dbListOfArtifactsAndAssociatedStamps)

            // Condensing dbListOfArtifactsAndAssociatedStamps list of objects to only minimal properties required.
            // var queryExactMatchResults = []
            var queryExactMatchResultsTempObj = {}

            for (const element in dbListOfArtifactsAndAssociatedStamps) {
                queryExactMatchResultsTempObj['stampID'] = dbListOfArtifactsAndAssociatedStamps[element].stampID
                queryExactMatchResultsTempObj['formatType'] = dbListOfArtifactsAndAssociatedStamps[element].formatType
                queryExactMatchResultsTempObj['location'] = dbListOfArtifactsAndAssociatedStamps[element].location
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


            // console.log("--------------Entered middleware-------------")
            //console.log(queryExactMatchResults)

            // console.log(queryExactMatchResults[0])
            // console.log(queryExactMatchResults[0].categories[0].tags)


        }

        //console.log('formLength', req.body.row.length)

        // console.log(queryObj)

        // Caller that accepts promise results when ready.
        dbCombined.listCorrelatedArtifactInfoMatchingSearchFormQuery(queryObj).then(function(dbListOfCorrelatedArtifactsAndAssociatedStamps) {   
                        
            // console.log(dbListOfCorrelatedArtifactsAndAssociatedStamps)
        
            // Condensing dbListOfCorrelatedArtifactsAndAssociatedStamps list of objects to only minimal properties required.
            var queryCorrelatedMatchResults = []
            var queryCorrelatedMatchResultsTempObj = {}
            
            for (const element in dbListOfCorrelatedArtifactsAndAssociatedStamps) {
                queryCorrelatedMatchResultsTempObj['stampID'] = dbListOfCorrelatedArtifactsAndAssociatedStamps[element].stampID
                queryCorrelatedMatchResultsTempObj['formatType'] = dbListOfCorrelatedArtifactsAndAssociatedStamps[element].formatType
                queryCorrelatedMatchResultsTempObj['location'] = dbListOfCorrelatedArtifactsAndAssociatedStamps[element].location
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
            // console.log(queryCorrelatedMatchResults, "<-------")

            res.render('searchPage', { isAdmin: req.user.isAdmin, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), activePageSearch: true, exactMatchResults: queryExactMatchResults, exactMatchCount: queryExactMatchResults.length, formData: req.body, shortForm: (req.body.row.length <= 1 ? true : false), looseMatchResults: queryCorrelatedMatchResults, userQuery: JSON.stringify(req.body) })
        
        }).catch(function(err) {
            console.log(`Promise rejection error LOOSE --> ${err}`)
        })

        



    }).catch(function (err) {
        console.log(`Promise rejection error EXACT --> ${err}`)
    })


    // res.render('searchPage', { isAdmin: false, isDarkMode: false, activePageSearch: true, })
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from searchPage stamp Thumbnail click -> render artifactViewerPage
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const artifactViewer = (req, res) => {
    // console.log(req.query.id)  <--- To be used
    //console.log(req.query.userQuery)

    /*
        req.body
            stampID
            userQuery (should already be in req.body)
     
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
     
        get userID from session ( e.g. used to determine whether update / delete buttons show)
     
        query db by stampID + userID
            return:
                results{
                    mediaType: enum
                    artifactTitle: string
                    stampTitle: sting
                    author: string
                    views: int
                    description: string
                    likes: int
                    dislikes: int
                    artifactID: int
                    hasThumbUp: bool (based on user)
                    hasThumbDown: bool (based on user)
                    isFlagged: bool
                    location: string
                    timestamp/pageNumber/section: int/string
                    stampID: int
                    categories: [
                        category: {
                            catTitle: char,
                            tags: [
                                tag: {
                                    tagTitle: char
                                }
                            ]
                        }
                    ]
                }
     
        if results:
            res.render
                artifactViewerPage
                    isAdmin, (from session)
                    isLightMode, (from session)
                    userQuery,
                    results,
                    activePage
        else
            res error
    */


    //const artifactID = req.query.id  <-- From UI

    const stampID = req.query.id
    const userID = req.user.userID


    // querydb to see if session exists

    // Caller that accepts promise results when ready.
    dbSessions.listSessionsByIDs(userID, stampID).then(function (dbResults) {
        // Session exists.
        if (dbResults.length != 0) {
            // console.log("Session already exists; entering stamp.")
            // Function that increments a stamp's views.
            // Caller that accepts promise results when ready.
            dbStamps.incrementViews(stampID).then(function (dbResults) {
                if (dbResults.affectedRows > 0) {
                    // console.log(`Successful incrementViews update.`)
                } else {
                    // console.log(`No record was updated.`)
                }
            }).catch(function (err) {
                console.log(`Promise rejection error --> ${err}`)
            })

            // Update session to update date accessed column.
            // Caller that accepts promise results when ready.
            dbSessions.updateSession(dateTimeUtil.getCurrentTimeStamp, userID, stampID).then(function (dbResults) {
                if (dbResults.affectedRows > 0) {
                    // console.log(`Successful update of session.`)
                } else {
                    // console.log(`No session record was updated.`)
                }
            }).catch(function (err) {
                console.log(`Promise rejection error --> ${err}`)
            })
            // Caller that accepts promise results when ready.
            dbCombined.listStampByID(stampID, userID).then(function (dbResult) {

                // Checking if records exist.
                if (dbResult.length != 0) {
                    // console.log(dbResult)

                    // Determing appropriate stamp type for artifact.
                    function resolveStampType(element) {
                        var artifactStampType = null

                        if (dbResult[element].aTimestamp != null) {
                            artifactStampType = dbResult[element].aTimestamp
                        } else if (dbResult[element].pageNumber != null) {
                            artifactStampType = dbResult[element].pageNumber
                        } else if (dbResult[element].sectionPercentage != null) {
                            artifactStampType = dbResult[element].sectionPercentage
                        } else {
                            // console.log("Entered else statement")
                            artifactStampType = `Unknown stamp type for artifact.`
                        }

                        return artifactStampType
                    }

                    for (const element in dbResult) {
                        // Pushing key value pair to stamp object.
                        dbResult[element].timestampORpageNumberORsection = resolveStampType(element)
                    }

                    //console.log(dbResult)

                    res.render('artifactViewer', { isAdmin: req.user.isAdmin, artifact: dbResult[0], isLiked: true, isDisliked: false, isFlagged: false, activePageSearch: true, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true') });

                } else {
                    // console.log('Entered else')
                    // console.log(`No records match the stampID of ${stampID} for the userID of ${userID}.`)
                }

            }).catch(function (err) {
                console.log(`Promise rejection error --> ${err}`)
            })
        } else {
            // console.log("Session does not exist, so creating a new session and entering stamp.")
            // Creating a new session.
            // Caller that accepts promise results when ready.
            // Arguments: userID, stampID, lastAccessedDate, duration, hasThumbUp, hasThumbDown            
            dbSessions.insertSession(userID, stampID, dateTimeUtil.getCurrentTimeStamp, 0, 0, 0).then(function (dbResults) {
                if (dbResults.affectedRows > 0) {
                    // console.log(`Successful insert.`)
                    // Function that increments a stamp's views.
                    // Caller that accepts promise results when ready.
                    dbStamps.incrementViews(stampID).then(function (dbResults) {
                        if (dbResults.affectedRows > 0) {
                            // console.log(`Successful incrementViews update.`)
                        } else {
                            // console.log(`No record was updated.`)
                        }
                    }).catch(function (err) {
                        console.log(`Promise rejection error --> ${err}`)
                    })

                    // Caller that accepts promise results when ready.
                    dbCombined.listStampByID(stampID, userID).then(function (dbResult) {

                        // Checking if records exist.
                        if (dbResult.length != 0) {
                            // console.log(dbResult)

                            // Determing appropriate stamp type for artifact.
                            function resolveStampType(element) {
                                var artifactStampType = null

                                if (dbResult[element].aTimestamp != null) {
                                    artifactStampType = dbResult[element].aTimestamp
                                } else if (dbResult[element].pageNumber != null) {
                                    artifactStampType = dbResult[element].pageNumber
                                } else if (dbResult[element].sectionPercentage != null) {
                                    artifactStampType = dbResult[element].sectionPercentage
                                } else {
                                    // console.log("Entered else statement")
                                    artifactStampType = `Unknown stamp type for artifact.`
                                }

                                return artifactStampType
                            }

                            for (const element in dbResult) {
                                // Pushing key value pair to stamp object.
                                dbResult[element].timestampORpageNumberORsection = resolveStampType(element)
                            }

                            // console.log(dbResult)

                            res.render('artifactViewer', { isAdmin: req.user.isAdmin, artifact: dbResult[0], isLiked: true, isDisliked: false, isFlagged: false, activePageSearch: true, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true') });

                        } else {
                            // console.log('Entered else')
                            // console.log(`No records match the stampID of ${stampID} for the userID of ${userID}.`)
                        }

                    }).catch(function (err) {
                        console.log(`Promise rejection error --> ${err}`)
                    })
                } else {
                    // console.log(`No record was inserted.`)
                }
            }).catch(function (err) {
                console.log(`Promise rejection error --> ${err}`)
            })
        }
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })




  
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from artifactViewerPage like click -> respond json
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const toggleLikePOST = (req, res) => {
    // console.log(req.body.isLiked)
    // console.log(req.body.isDisliked)
    // console.log(req.body.id)


    /*
    req.body
        stampID
        hasThumbUp
        hasThumbDown
 
    get userID from session
 
    if hasThumbUp
        queryDB to remove
    else
        queryDB to add
    if hasThumbDown
        queryDB to remove
        toggleThumbDown = true
 
    res
        success = true/false
        hasThumbUp
        toggleThumbDown
    
    
*/

    var isLiked;
    var toggleDislike = false;
    var userID = req.user.userID
    var stampID = req.body.id

    // console.log(`req.body.isLiked ${req.body.isLiked}`)

    if (!req.body.isLiked) {  // If like button is toggled to true by user.
        //querydb set like true
        // Function that updates a user session's hasThumbsUp column to true.

        // Caller that accepts promise results when ready.
        dbSessions.setHasThumbsUpToTrue(userID, stampID).then(function (dbResults) {
            if (dbResults.affectedRows > 0) {
                // console.log(`Successful update: hasThumbsUp = true.`)

                // Function that increments a stamp's thumbsUpCount.        
                // Caller that accepts promise results when ready.
                dbStamps.incrementThumbsUpCount(stampID).then(function (dbResults) {
                    if (dbResults.affectedRows > 0) {
                        // console.log(`Successful update: thumbsUpCount incremented.`)
                        isLiked = true;

                        if (req.body.isDisliked) {
                            // Function that updates a user session's hasThumbsDown column to false.            
                            // Caller that accepts promise results when ready.
                            dbSessions.setHasThumbsDownToFalse(userID, stampID).then(function (dbResults) {
                                if (dbResults.affectedRows > 0) {
                                    // console.log(`Successful update: hasThumbsDown = false.`)
                                    // Function that decrements a stamp's thumbsDownCount.            
                                    // Caller that accepts promise results when ready.
                                    dbStamps.decrementThumbsDownCount(stampID).then(function (dbResults) {
                                        if (dbResults.affectedRows > 0) {
                                            // console.log(`Successful update: thumbsUpCount decremented.`)

                                            toggleDislike = true
                                            res.json({ success: true, isLiked: isLiked, toggleDislike: toggleDislike })
                                        } else {
                                            // console.log(`No record was updated.`)
                                        }
                                    }).catch(function (err) {
                                        console.log(`Promise rejection error --> ${err}`)
                                    })
                                } else {
                                    // console.log(`No record was updated.`)
                                }
                            }).catch(function (err) {
                                console.log(`Promise rejection error --> ${err}`)
                            })
                        } else {
                            res.json({ success: true, isLiked: isLiked, toggleDislike: toggleDislike })
                        }
                    } else {
                        // console.log(`No record was updated.`)
                    }
                }).catch(function (err) {
                    console.log(`Promise rejection error --> ${err}`)
                })
            } else {
                // console.log(`No record was updated.`)
            }
        }).catch(function (err) {
            console.log(`Promise rejection error --> ${err}`)
        })

    } else {  // "Untoggling" like button.
        // Function that updates a user session's hasThumbsUp column to false.
        // Caller that accepts promise results when ready.
        dbSessions.setHasThumbsUpToFalse(userID, stampID).then(function (dbResults) {
            if (dbResults.affectedRows > 0) {
                // console.log(`Successful update: hasThumbsUp = false.`)

                // Function that decrements a stamp's thumbsUpCount.        
                // Caller that accepts promise results when ready.
                dbStamps.decrementThumbsUpCount(stampID).then(function (dbResults) {
                    if (dbResults.affectedRows > 0) {
                        // console.log(`Successful update: thumbsUpCount decremented..`)
                        isLiked = false;
                        res.json({ success: true, isLiked: isLiked, toggleDislike: toggleDislike })
                    } else {
                        // console.log(`No record was updated.`)
                    }
                }).catch(function (err) {
                    console.log(`Promise rejection error --> ${err}`)
                })
            } else {
                // console.log(`No record was updated.`)
            }
        }).catch(function (err) {
            console.log(`Promise rejection error --> ${err}`)
        })
    }

}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from artifactViewerPage dislike click -> respond json
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const toggleDislikePOST = (req, res) => {
    // console.log(req.body.isLiked)
    // console.log(req.body.isDisliked)
    // console.log(req.body.id)

    /*
 
    req.body
        stampID
        hasThumbUp
        hasThumbDown
 
    get userID from session
 
    if hasThumbDown
        queryDB to remove
    else
        queryDB to add
    if hasThumbUp
        queryDB to remove
        toggleThumbUp = true
 
    res
        success = true/false
        hasThumbDown
        toggleThumbUp
 
*/

    var isDisliked;
    var toggleLike = false;

    var userID = req.user.userID
    var stampID = req.body.id

    if (!req.body.isDisliked) {

        // Function that updates a user session's hasThumbsDown column to true.        
        // Caller that accepts promise results when ready.
        dbSessions.setHasThumbsDownToTrue(userID, stampID).then(function (dbResults) {
            if (dbResults.affectedRows > 0) {
                // console.log(`Successful update: hasThumbsDown = true.`)
                // Function that increments a stamp's thumbsDownCount.
                // Caller that accepts promise results when ready.
                dbStamps.incrementThumbsDownCount(stampID).then(function (dbResults) {
                    if (dbResults.affectedRows > 0) {
                        // console.log(`Successful update: thumbsDownCount incremented.`)
                        isDisliked = true;
                        if (req.body.isLiked) {
                            // Function that updates a user session's hasThumbsUp column to false.            
                            // Caller that accepts promise results when ready.
                            dbSessions.setHasThumbsUpToFalse(userID, stampID).then(function (dbResults) {
                                if (dbResults.affectedRows > 0) {
                                    // console.log(`Successful update: hasthumbsUp = false.`)
                                    // Function that decrements a stamp's thumbsUpCount.            
                                    // Caller that accepts promise results when ready.
                                    dbStamps.decrementThumbsUpCount(stampID).then(function (dbResults) {
                                        if (dbResults.affectedRows > 0) {
                                            // console.log(`Successful update: thumbsUpCount decremented.`)
                                            toggleLike = true
                                            res.json({ success: true, isDisliked: isDisliked, toggleLike: toggleLike })
                                        } else {
                                            // console.log(`No record was updated.`)
                                        }
                                    }).catch(function (err) {
                                        console.log(`Promise rejection error --> ${err}`)
                                    })
                                } else {
                                    // console.log(`No record was updated.`)
                                }
                            }).catch(function (err) {
                                console.log(`Promise rejection error --> ${err}`)
                            })
                        } else {
                            res.json({ success: true, isDisliked: isDisliked, toggleLike: toggleLike })
                        }
                    } else {
                        //console.log(`No record was updated.`)
                    }
                }).catch(function (err) {
                    console.log(`Promise rejection error --> ${err}`)
                })

            } else {
                //console.log(`No record was updated.`)
            }
        }).catch(function (err) {
            console.log(`Promise rejection error --> ${err}`)
        })
    } else {
        //querydb set dislike false
        // Function that updates a user session's hasThumbsDown column to false.
        // Caller that accepts promise results when ready.
        dbSessions.setHasThumbsDownToFalse(userID, stampID).then(function (dbResults) {
            if (dbResults.affectedRows > 0) {
                //console.log(`Successful update: hasThumbsDown = false.`)

                // Function that decrements a stamp's thumbsDownCount.
                // Caller that accepts promise results when ready.
                dbStamps.decrementThumbsDownCount(stampID).then(function (dbResults) {
                    if (dbResults.affectedRows > 0) {
                        //console.log(`Successful update: thumbsDownCount decremented.`)
                        isDisliked = false;
                        res.json({ success: true, isDisliked: isDisliked, toggleLike: toggleLike })
                    } else {
                        //console.log(`No record was updated.`)
                    }
                }).catch(function (err) {
                    console.log(`Promise rejection error --> ${err}`)
                })
            } else {
                //console.log(`No record was updated.`)
            }
        }).catch(function (err) {
            console.log(`Promise rejection error --> ${err}`)
        })
    }

    // res.json({ success: true, isLiked: isLiked, toggleDislike: toggleDislike })
    // res.json({ success: true, isDisliked: isDisliked, toggleLike: toggleLike })
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from artifactViewerPage flag click -> respond json
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const toggleFlagPOST = (req, res) => {
    //console.log(req.body.isFlagged)
    //console.log(req.body.id)

    var stampID = req.body.id

    if (!req.body.isFlagged) {
        //console.log(`stampID: ${stampID}`)

        // Caller that accepts promise results when ready.
        dbStamps.setIsFlaggedToTrue(stampID).then(function (dbResults) {
            if (dbResults.affectedRows > 0) {
                //console.log(`Successful update.`)
                res.json({ success: true, })
            } else {
                //(`No record was updated.`)
            }
        }).catch(function (err) {
            console.log(`Promise rejection error --> ${err}`)
        })
    } else {
        if (req.user.isAdmin) {
            // Function that toggles a stamp's isFlagged to false.
            // Caller that accepts promise results when ready.
            dbStamps.setIsFlaggedToFalse(stampID).then(function (dbResults) {
                if (dbResults.affectedRows > 0) {
                    //console.log(`Successful update.`)
                    res.json({ success: true, })
                } else {
                    //console.log(`No record was updated.`)
                }
            }).catch(function (err) {
                console.log(`Promise rejection error --> ${err}`)
            })
        } else {
            res.json({ success: false, })
        }
    }

    // res.json({ success: true, })
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from searchPage request media click -> respond json
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const createTicketPOST = (req, res) => {

    //console.log(req.body.formData)


    /*
        req
            userQuery
     
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
     
        get userID from session
     
        queryDB to set ticket
     
        res
            success = true/false
    */

    // Sample JSON query object from user.
    queryObj = [
        {
            field: 'Artifacts.title',
            input: 'Pythagorean Theorem',
            condition: 'AND'
        }
    ]

    // userID retrieved from session.
    userID = req.user.userID


    // Caller that accepts promise results when ready.    
    dbTickets.insertTicket(userID, dateTimeUtil.getCurrentTimeStamp, req.body.formData.row).then(function (dbResults) {
        if (dbResults.affectedRows > 0) {
            //console.log(`Successful insert.`)
        } else {
            //console.log(`No record was inserted.`)
        }
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })

    // res.json({ success: true })

    res.render('searchPage')
}

const dataAnalytics = (req, res) => {

    res.render('dataAnalytics', {activePageDataAnalytics: true, isAdmin: req.user.isAdmin, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true')})
    // Passing data through the route.
    // res.render('adminDataAnalytics', { activePageAdminDataAnalytics: true })

}


const dataAnalyticsPageGETChartData = (req, res) => {
    // Caller that accepts promise results when ready.
    dbCombined.listMostLikedStamps().then(function(dbResults) {   

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
        
        // console.log(resultSet)    

        // Storing x-axis labels & y-axis data values
        var stampShortNames = []
        var stampLikes = []

        for (const element in resultSet) {
            stampShortNames.push(resultSet[element].shortName)
            stampLikes.push(resultSet[element].thumbsUpCount)
        }

        // console.log(stampShortNames)
        // console.log(stampLikes)

        res.json({stampShortNames: stampShortNames, stampLikes: stampLikes})
        

    }).catch(function(err) {
        console.log(`Promise rejection error --> ${err}`)
    })
}


// Exporting pages to be used by the routes/index.js.
module.exports = {
    loginPage,
    //loginPagePOST,
    logoutPOST,
    topNavArrays,
    toggleDarkMode,
    searchPage,
    searchPagePOST,
    artifactViewer,
    toggleLikePOST,
    toggleDislikePOST,
    toggleFlagPOST,
    createTicketPOST,
    dataAnalytics,
    dataAnalyticsPageGETChartData
}