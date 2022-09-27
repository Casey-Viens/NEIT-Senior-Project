const dbCombined = require('../../models/model_Combined.js')
const dbCategories = require('../../models/model_Categories.js')
const dbTags = require('../../models/model_Tags.js')
const dbTickets = require('../../models/model_Tickets.js')
const dbUsers = require('../../models/model_Users.js')
const dbArtifacts = require('../../models/model_Artifacts.js')
const dbStamps = require('../../models/model_Stamps.js')
const dbStampCatConn = require('../../models/model_Stamps_Categories_Bridge.js')
const dbCatTagConn = require('../../models/model_Categories_Tags_Bridge.js')
const dbStampCatTagConn = require('../../models/model_Stamps_Categories_Tags_Bridge.js')
const dbSessions = require('../../models/model_Sessions.js')


const AWSS3uploadObject = require('../../AWS_S3_Middleware/s3_uploadObject')
const AWSS3getObject = require('../../AWS_S3_Middleware/s3_getObject')
const AWSS3deleteObject = require('../../AWS_S3_Middleware/s3_deleteObject')

const dateTimeUtil = require('../../utils/getDateTimeUtil.js')

const chartJS = require('chart.js')



const adminUploadPage = (req, res) => {
    // Passing data through the route.
    res.render('adminUpload', { activePageAdminUpload: true, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), })
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminUploadPage link submit click -> render adminIndexer
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const adminUploadPageLinkPOST = (req, res) => {
    // console.log('Link:', req.body.link)
    /*
 
       req.body
        link
 
       string manip the link from watch to embeded
 
       queryDB to create artifact with link
 
       res.render
        adminIndexer
            isLightMode
            mediaType
            location
            artifactID
            activePage
 
*/
    var key
    var embededLink

    if (req.body.link.indexOf('youtu.be') != -1) {
        key = req.body.link.slice(req.body.link.indexOf('be/') + 3,)
        embededLink = 'https://www.youtube.com/embed/' + key
    } else {
        key = req.body.link.slice(req.body.link.indexOf('=') + 1,)
        embededLink = 'https://www.youtube.com/embed/' + key
    }

    res.render('adminIndexer', { isUpload: true, isLink: true, format: 'Link', source: embededLink, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), activePageAdminUpload: true, })
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminUploadPage file submit click -> render adminIndexer
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const adminUploadPagePOST = (req, res) => {
    // console.log(req.file)

    var format

    if (req.file.mimetype == 'image/png') {
        format = '.PNG'
    } else if (req.file.mimetype == 'video/mp4') {
        format = '.MP4'
    } else if (req.file.mimetype == 'application/pdf') {
        format = '.PDF'
    } else if (req.file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || req.file.mimetype == 'application/msword') {
        format = '.PDF'
        //convert file
    }
    /*
 
       req.body
        file
 
       look into figuring out what type of file it is
 
       if doc/docx
        convert to pdf
    
    queryDB to create artifact with media
 
       res.render
        adminIndexer
            isLightMode
            medaType
            location
            artifactID
            activePage
 
*/

    AWSS3uploadObject.uploadToS3Object(req.file).then(function (data) {
        // console.log(`Object with key '${data.Key}' was successfully uploaded.`)
        // console.log(data)  // Can use the "Key" attribute to later retrieve signed url (via s3_getObject.js)

        // AWSS3getObject.retrieveS3ObjectByKey(data.Key).then(function (dataURL) {
        //     console.log(`URL: ${dataURL}`)
        //     res.render('adminIndexer', { isUpload: true, format: format, source: dataURL, activePageAdminUpload: true, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), })
        // }).catch(function (err) {
        //     console.log(`Promise rejection error --> ${err}`)
        // })

        res.render('adminIndexer', { isUpload: true, awsKey: data.Key, format: format, source: data.Location, activePageAdminUpload: true, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), })
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })

    // console.log("Single file upload success.")
    // res.render('adminIndexer', { isUpload: true, format: format, source: embededLink, activePageAdminUpload: true, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), })
}


const adminIndexerCategoriesAndTagsGET = (req, res) => {
    var catArray = {}
    var tagArray = {}

    // Caller that accepts promise results when ready.
    const promise1 = dbCombined.listAllCategoriesWithID().then(function (dbResults) {
        for (const element in dbResults) {
            catArray[dbResults[element].catID] = dbResults[element].catLabel
        }

        return catArray
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })

    // Caller that accepts promise results when ready.
    const promise2 = dbCombined.listAllTagsWithID().then(function (dbResults) {
        for (const element in dbResults) {
            tagArray[dbResults[element].tagID] = dbResults[element].tagLabel
        }

        return tagArray
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })

    // Waiting for asynchronous results from all asynchronous calls.
    Promise.all([promise1, promise2]).then((dbResults) => {
        // for (const element in dbResults[0]) {
        //     catArray[dbResults[0][element].catID] = dbResults[0][element].catLabel
        // }
        // for (const element in dbResults[1]) {
        //     tagArray[dbResults[1][element].tagID] = dbResults[1][element].tagLabel
        // }
        // console.log(dbResults, '<----')
        catArray = dbResults[0]
        tagArray = dbResults[1]
        res.json({ catArray: catArray, tagArray: tagArray })  // Returning to a fetch call.
    })

}
// adminIndexerCategoriesAndTagsGET() // Simulating POST


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminIndexer save click -> render ?landing page?
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const adminIndexerPageSavePOST = (req, res) => {

    // console.log('indexer Post: ', req.body)
    // console.log('indexer Post Stamps: ', req.body.artifact.stamps)
    // console.log('indexer Post Stamp Categories: ', req.body.artifact.stamps[0].categories)
    // console.log('indexer Post Stamp Category Tags: ', req.body.artifact.stamps[0].categories[0].tags)
    /*
        req.body
            artifactID
            title
            author
            description
            stamps [
                stamp{
                    stampName
                    timestamp/page/location
                    categories [
                        category{
                            categoryID
                            tags [
                                tag{
                                    tagID
                                }
                            ]
                        }
                    ]
                }
            ]

    
        queryDB to update artifact, create stamps, create stamp, cat, tag connections
    
        if success
            update local instance of authorArray, titleArray, etc.
            res.render
                searchPage
                    'repeat searchPage data'
        else
            res.json
                error
                
    
    */

    // If the required minimum fields are filled-in (i.e. title, author, description, and at least 1 stamp, shortNameTitle, category, and tag), then save.  Otherwise, return validation error messages.

    // Admin has correctly filled required minimum fields and passed validations.
    var isValidSave = true

    if(req.body.artifact.stamps){  // Checking if stamps exist (on the form).
        if (req.body.artifact.stamps.length < 1) {
            isValidSave = false
        } else {
            for (const stamp in req.body.artifact.stamps) {
                if (req.body.artifact.stamps[stamp].categories){  // Checking if stamp category exist
                    if (req.body.artifact.stamps[stamp].categories.length < 1 || req.body.artifact.stamps[stamp].title == '' || req.body.artifact.stamps[stamp].location == '') {
                        isValidSave = false
                    } else {
                        for (const cat in req.body.artifact.stamps[stamp].categories) {
                            if (req.body.artifact.stamps[stamp].categories[cat].tags) {
                                if (req.body.artifact.stamps[stamp].categories[cat].tags.length < 1 || req.body.artifact.stamps[stamp].categories[cat].category == '') {
                                    isValidSave = false
                                }
                            } else {
                                isValidSave = false
                            }
                        }
                    }
                } else {
                    isValidSave = false
                }
            }
        }
    } else {
        isValidSave = false
    }

    // Sample object posted from UI to be saved.
    /*
    var artifactDataObjToSave = {
        artifactID: null,  // For testing purposes, this will be the last index inserted + 1.  This exception applies to artifacts not inserted in the database yet.
        userID: 5,
        title: 'Pythagorean Theorem adminIndexTest',
        author: 'Khan Academy',
        description: `Trigonometry on Khan Academy: Big, fancy word, right? Don't be fooled. Looking at the prefix, tri-, you could probably assume that trigonometry (trig as it's sometimes called) has something to do with triangles. You would be right! Trig is the study of the properties of triangles. Why is it important? It's used in measuring precise distances, particularly in industries like satellite systems and sciences like astronomy. It's not only space, however. Trig is present in architecture and music, too. Now you may wonder...how is knowing the measurement and properties of triangles relevant to music?? THAT is a great question. Maybe you'll learn the answer from us in these tutorials!`,
        formatType: 'Link',
        location: 'https://www.youtube.com/embed/Jsiy4TxgIME',
        stamps: [
            stamp = {
                stampID: null,  // For testing purposes, this will be the last index inserted + 1.  This exception applies to artifacts not inserted in the database yet.     
                aTimestamp: '00:07:15', // Null by default.
                pageNumber: null, // Null by default.
                sectionPercentage: null, // Null by default.
                // timestamp_page_location: null,  // Converted user entry field into either aTimestamp, pageNumber or sectionPercentage column value based on formatType before being sent to backend API.
                shortStampName: 'SOH CAH TOA',
                // views: 3700,
                // thumbsUpCount: 250,
                // thumbsDownCount: 20,
                // isFlagged: 0,
                categories: [
                    category = {
                        categoryID: 13,  // Selected prior to save. (e.g. Trigonometry)
                        tags: [
                            tag = {
                                tagID: 8  // Selected prior to save. (e.g. 3-4-5)
                            },
                        ],
                    },
                ]
            },
        ]
    }
    */
    var artifactSavePOST = req.body.artifact
    var tempStampObj
    var tempCatObj
    var tempTagObj

    var artifactDataObjToSave = {
        artifactID: null,  // For testing purposes, this will be the last index inserted + 1.  This exception applies to artifacts not inserted in the database yet.
        userID: req.user.userID,
        title: artifactSavePOST.title,
        author: artifactSavePOST.author,
        description: artifactSavePOST.description,
        formatType: artifactSavePOST.format,
        location: artifactSavePOST.source,
        stamps: []
    }

    for (const stampIndex in artifactSavePOST.stamps) {
        // Temporary stamp object
        tempStampObj = {}
        tempStampObj.stampID = null

        // Converting user friendly types (i.e. typeArray = ['Video', 'Document', 'Image']) to correct respective formatType (in preparartion for database).  Specifically, row entry input's property values are changed to the correct database formatTypes (e.g. "Video" from UI to ".MP4").

        switch (artifactSavePOST.format) {
            case "Link":
                tempStampObj.aTimestamp = artifactSavePOST.stamps[stampIndex].location
                tempStampObj.pageNumber = null
                tempStampObj.sectionPercentage = null
                break;
            case ".MP4":
                tempStampObj.aTimestamp = artifactSavePOST.stamps[stampIndex].location
                tempStampObj.pageNumber = null
                tempStampObj.sectionPercentage = null
                break;
            case ".PDF":
                tempStampObj.aTimestamp = null
                tempStampObj.pageNumber = artifactSavePOST.stamps[stampIndex].location
                tempStampObj.sectionPercentage = null
                break;
            case ".PNG":
                tempStampObj.aTimestamp = null
                tempStampObj.pageNumber = null
                tempStampObj.sectionPercentage = artifactSavePOST.stamps[stampIndex].location
                break;
            default:
            // Do nothing.
        }

        tempStampObj.shortStampName = artifactSavePOST.stamps[stampIndex].title

        // Push tempStampObj into stamps array
        tempStampObj.categories = []
        for (const catIndex in artifactSavePOST.stamps[stampIndex].categories) {
            tempCatObj = {}

            tempCatObj.categoryID = artifactSavePOST.stamps[stampIndex].categories[catIndex].category
            tempCatObj.tags = []
            for (const tagIndex in artifactSavePOST.stamps[stampIndex].categories[catIndex].tags) {
                tempTagObj = {}
                tempTagObj.tagID = artifactSavePOST.stamps[stampIndex].categories[catIndex].tags[tagIndex].id
                // Push tempTagObj into tags array
                tempCatObj.tags.push(tempTagObj)
            }
            // Push tempCatObj into categories array
            tempStampObj.categories.push(tempCatObj)
        }

        artifactDataObjToSave.stamps.push(tempStampObj)

        // stamps: [
        //     stamp = {
        //         stampID: null,  // For testing purposes, this will be the last index inserted + 1.  This exception applies to artifacts not inserted in the database yet.     
        //         aTimestamp: '00:07:15', // Null by default.
        //         pageNumber: null, // Null by default.
        //         sectionPercentage: null, // Null by default.
        //         // timestamp_page_location: null,  // Converted user entry field into either aTimestamp, pageNumber or sectionPercentage column value based on formatType before being sent to backend API.
        //         shortStampName: 'SOH CAH TOA',
        //         // views: 3700,
        //         // thumbsUpCount: 250,
        //         // thumbsDownCount: 20,
        //         // isFlagged: 0,
        //         categories: [
        //             category = {
        //                 categoryID: 13,  // Selected prior to save. (e.g. Trigonometry)
        //                 tags: [
        //                     tag = {
        //                         tagID: 8  // Selected prior to save. (e.g. 3-4-5)
        //                     },
        //                 ],
        //             },
        //         ]
        //     },
        // ]

        // artifactSavePOST.stamps[stampIndex].push(tempStampObj)

        // Resetting temporary objects.
        tempStampObj = {}
        tempCatObj = {}
        tempTagObj = {}
    }

    // Batch insert example: [{stampID, CatID, TagID},{stampID, CatID, TagID},{stampID, CatID, TagID},{stampID, CatID, TagID}, ]

    // console.log("-------------")
    // console.log(artifactDataObjToSave)
    // console.log(artifactDataObjToSave.stamps[0].categories)
    // console.log(artifactDataObjToSave.stamps[0].categories[0].tags)
    //isValidSave = false
    // console.log('Artifact--', artifactDataObjToSave)
    // console.log('Artifact--Stamps--', artifactDataObjToSave.stamps)
    // console.log('Artifact--Stamps--Categories', artifactDataObjToSave.stamps[0].categories)
    // console.log('Artifact--Stamps--Categories--tags', artifactDataObjToSave.stamps[0].categories[0].tags)
    if (isValidSave) {
        // Inserting an artifact.
        // Callers that accepts promise results when ready.
        // Arguments: userID, title, descr, author, formatType, location
        dbArtifacts.insertArtifact(artifactDataObjToSave.userID, artifactDataObjToSave.title, artifactDataObjToSave.description, artifactDataObjToSave.author, artifactDataObjToSave.formatType, artifactDataObjToSave.location).then(function (dbArtifactResults) {
            if (dbArtifactResults.affectedRows > 0) {
                // console.log(`Successful artifact insert (affected rows: ${dbArtifactResults.affectedRows}).`)
                artifactDataObjToSave.artifactID = dbArtifactResults.insertId;  // Storing artifactID for use in later queries.
            } else {
                // console.log(`No artifact record was inserted.`)
            }

            // Looping using artifactID to add stamps.            
            for (const stampsIndex in artifactDataObjToSave.stamps) {
                // Arguments: artifactID, aTimestamp, pageNumber, sectionPercentage, shortName, views, thumbsUpCount, thumbsDownCount, isFlagged
                dbStamps.insertStamp(artifactDataObjToSave.artifactID, artifactDataObjToSave.stamps[stampsIndex].aTimestamp, artifactDataObjToSave.stamps[stampsIndex].pageNumber, artifactDataObjToSave.stamps[stampsIndex].sectionPercentage, artifactDataObjToSave.stamps[stampsIndex].shortStampName, 0, 0, 0, 0).then(function (dbStampsResults) {
                    if (dbStampsResults.affectedRows > 0) {
                        // console.log(`Successful stamp insert (affected rows: ${dbStampsResults.affectedRows}).`)
                        artifactDataObjToSave.stamps[stampsIndex].stampID = dbStampsResults.insertId;  // Storing stampID for use in later queries.
                    } else {
                        // console.log(`No stamp record was inserted.`)
                    }

                    // Note: The categories and tags and their respective associations are already assumed to exist, which were accomplished by a different POST prior to saving.
                    // Looping to add associations of tag(s) within one or more categories to stamp(s) (three-way table) to identify tags that were chosen for a stamp.                     
                    for (const catIndex in artifactDataObjToSave.stamps[stampsIndex].categories) {

                        // Caller that accepts promise results when ready.    
                        dbStampCatConn.addStampCatConnection(artifactDataObjToSave.stamps[stampsIndex].stampID, artifactDataObjToSave.stamps[stampsIndex].categories[catIndex].categoryID).then(function (dbStampCatConnResults) {
                            if (dbStampCatConnResults.affectedRows > 0) {
                                // console.log(`Successful stampCatConnection insert (affected rows: ${dbStampCatConnResults.affectedRows}).`)
                            } else {
                                // console.log(`No stampCatConnection record was inserted.`)
                            }
                        }).catch(function (err) {
                            console.log(`Promise rejection error --> ${err}`)
                        })


                        for (const tagIndex in artifactDataObjToSave.stamps[stampsIndex].categories[catIndex].tags) {

                            // Checking if category and tag connection already exists.
                            // Caller that accepts promise results when ready.
                            dbCatTagConn.listCatTagConnectionByIDs(artifactDataObjToSave.stamps[stampsIndex].categories[catIndex].categoryID, artifactDataObjToSave.stamps[stampsIndex].categories[catIndex].tags[tagIndex].tagID).then(function (dbListCatTagConnectionResults) {
                                if (dbListCatTagConnectionResults.length == 0) {
                                    // Adding category and tag connection.
                                    // Caller that accepts promise results when ready.
                                    dbCatTagConn.addCatTagConnection(artifactDataObjToSave.stamps[stampsIndex].categories[catIndex].categoryID, artifactDataObjToSave.stamps[stampsIndex].categories[catIndex].tags[tagIndex].tagID).then(function (dbCatTagConnectionResults) {
                                        if (dbCatTagConnectionResults.affectedRows > 0) {
                                            // console.log(`Successful addCatTagConnection insert (affected rows: ${dbCatTagConnectionResults.affectedRows}).`)
                                        } else {
                                            // console.log(`No addCatTagConnection record was inserted.`)
                                        }
                                    }).catch(function (err) {
                                        console.log(`Promise rejection error --> ${err}`)
                                    })
                                }
                            }).catch(function (err) {
                                console.log(`Promise rejection error --> ${err}`)
                            })

                            // Arguments: stampID, catID, tagID          
                            dbStampCatTagConn.addStampCatTagConnection(artifactDataObjToSave.stamps[stampsIndex].stampID, artifactDataObjToSave.stamps[stampsIndex].categories[catIndex].categoryID, artifactDataObjToSave.stamps[stampsIndex].categories[catIndex].tags[tagIndex].tagID).then(function (dbStampCatTagConnResults) {
                                if (dbStampCatTagConnResults.affectedRows > 0) {
                                    // console.log(`Successful stamp & category & tag (three-way table) association insert (affected rows: ${dbStampCatTagConnResults.affectedRows}).`)
                                } else {
                                    // console.log(`No stamp & category & tag (three-way table) association record was inserted.`)
                                }
                            }).catch(function (err) {
                                console.log(`Promise (addStampCatTagConnection()) rejection error --> ${err}`)
                            })
                        }
                    }


                }).catch(function (err) {
                    console.log(`Promise (insertStamp()) rejection error --> ${err}`)
                })
            }


        }).catch(function (err) {
            console.log(`Promise (insertArtifact()) rejection error --> ${err}`)
        })

        res.redirect('/searchPage')

        // ------------------- Backup ----------------------
        /*
        artifact & stamp object
        {
            stampID: 7,
            formatType: 'Link',
            artifactTitle: 'Pythagorean Theorem',
            shortName: '',
            author: 'Khan Academy',
            views: 20,
            description: 'YouTube Video Test',
            thumbnail: null,
            categories: [ [Object], [Object] ]
        },

        stamp object
        {
            stampID: 7,
            catID: 4,
            catLabel: 'Calculus',
            tags: [
                {
                stampID: 7,
                catID: 4,
                tagID: 5,
                tagLabel: "d/dx(fg) = fg' + gf'"
                }
            ]
        }

        Tag object
        [
            { stampID: 7, catID: 4, tagID: 5, tagLabel: "d/dx(fg) = fg' + gf'" }
        ]   

        stampID: 1,
                format: 'link',
                source: 'https://www.youtube.com/embed/Jsiy4TxgIME',
                title: 'Basic trigonometry',
                author: 'Khan Academy',
                views: 3781050,
                descr: "Trigonometry on Khan Academy: Big, fancy word, right? Don't be fooled. Looking at the prefix, tri-, you could probably assume that trigonometry (trig as it's sometimes called) has something to do with triangles. You would be right! Trig is the study of the properties of triangles. Why is it important? It's used in measuring precise distances, particularly in industries like satellite systems and sciences like astronomy. It's not only space, however. Trig is present in architecture and music, too. Now you may wonder...how is knowing the measurement and properties of triangles relevant to music?? THAT is a great question. Maybe you'll learn the answer from us in these tutorials!",
                categories: [
                    {
                        isMatched: true,
                        catTitle: 'Trigonometry',
                        tags: [
                            {
                                isMatched: true,
                                tagTitle: 'Right Triangle'
                            },
                            {
                                isMatched: true,
                                tagTitle: 'Triangle'
                            },
                            {
                                isMatched: false,
                                tagTitle: '3-4-5'
                            },
                            {
                                isMatched: false,
                                tagTitle: 'Pythagorean Theorem'
                            },
                            {
                                isMatched: false,
                                tagTitle: '90 Degrees'
                            },
                            {
                                isMatched: true,
                                tagTitle: 'Hypotenuse'
                            }
                        ]
                    },
                ]
        */


        /*
        // Inserting an artifact.
        // Callers that accepts promise results when ready.
        dbArtifacts.insertArtifact(2, "TestInsert", "TestDesc", "UnknownAuthor", "OTHER", "TempLocation2").then(function(dbResults) {
            if (dbResults.affectedRows > 0) {
                console.log(`Successful artifact insert.`)
            } else {
                console.log(`No artifact record was inserted.`)
            }

            // Looping using artifactID to add stamps.
            dbStamps.insertStamp(4, '01:58:42', null, null, 'timeStampTitleSample', 5, 1, 0, 0).then(function(dbResults) {
                if (dbResults.affectedRows > 0) {
                    console.log(`Successful stamp insert.`)
                } else {
                    console.log(`No stamp record was inserted.`)
                }

                // Looping to add all categories within a stamp.
                dbCategories.insertCategory('Calculus2').then(function(dbResults) {
                    if (dbResults.affectedRows > 0) {
                        console.log(`Successful category insert.`)
                    } else {
                        console.log(`No category record was inserted.`)
                    }

                    // Adding an association of category to stamp <----------
                    addStampCatConnection(7, 2).then(function(dbResults) {
                        if (dbResults.affectedRows > 0) {
                            console.log(`Successful stamp & category association insert.`)
                        } else {
                            console.log(`No stamp & category association record was inserted.`)
                        }
                    }).catch(function(err) {
                        console.log(`Promise rejection error --> ${err}`)
                    })

                    // Looping adding all tags within a category.  
                    dbTags.insertTag('d/dx(sin(x)) = cos(x)').then(function(dbResults) {
                        if (dbResults.affectedRows > 0) {
                            console.log(`Successful tag insert.`)
                        } else {
                            console.log(`No tag record was inserted.`)
                        }

                        
                        // Adding an association between tag and category <----------
                        addCatTagConnection(5, 1).then(function(dbResults) {
                            if (dbResults.affectedRows > 0) {
                                console.log(`Successful category & tag association insert.`)
                            } else {
                                console.log(`No category & tag association record was inserted.`)
                            }
                        }).catch(function(err) {
                            console.log(`Promise rejection error --> ${err}`)
                        })

                        // Adding an association of tag to stamp (three-way table) <----------
                        addStampCatTagConnection(5, 2, 3).then(function(dbResults) {
                            if (dbResults.affectedRows > 0) {
                                console.log(`Successful stamp & category & tag (three-way table) association insert.`)
                            } else {
                                console.log(`No stamp & category & tag (three-way table) association record was inserted.`)
                            }
                        }).catch(function(err) {
                            console.log(`Promise rejection error --> ${err}`)
                        })

                        //res.render('adminUpload', { isAdmin: req.user.isAdmin, isDarkMode: false, activePageSearch: true, exactMatchResults: queryExactMatchResults, exactMatchCount: queryExactMatchResults.length, formData: req.body, looseMatchResults: results, userQuery: JSON.stringify(req.body) })
                        
                    }).catch(function(err) {
                        console.log(`Promise rejection error --> ${err}`)
                    })

                }).catch(function(err) {
                    console.log(`Promise rejection error --> ${err}`)
                })

            }).catch(function(err) {
                console.log(`Promise rejection error --> ${err}`)
            })

        }).catch(function(err) {
            console.log(`Promise rejection error --> ${err}`)
        })
        */

        /* Backup #2 -----------------------

        // Inserting an artifact.
        // Callers that accepts promise results when ready.
        dbArtifacts.insertArtifact(2, "TestInsert", "TestDesc", "UnknownAuthor", "OTHER", "TempLocation2").then(function(dbResults) {
            if (dbResults.affectedRows > 0) {
                console.log(`Successful artifact insert.`)
            } else {
                console.log(`No artifact record was inserted.`)
            }

            // Looping using artifactID to add stamps.
            dbStamps.insertStamp(4, '01:58:42', null, null, 'timeStampTitleSample', 5, 1, 0, 0).then(function(dbResults) {
                if (dbResults.affectedRows > 0) {
                    console.log(`Successful stamp insert.`)
                } else {
                    console.log(`No stamp record was inserted.`)
                }

                // Looping to add all category associations within a stamp (category is assumed to already exist, which was accomplished by a different POST prior to saving).


                // Adding an association of category to stamp <----------
                addStampCatConnection(7, 2).then(function(dbResults) {
                    if (dbResults.affectedRows > 0) {
                        console.log(`Successful stamp & category association insert.`)
                    } else {
                        console.log(`No stamp & category association record was inserted.`)
                    }
                }).catch(function(err) {\adminUpload
                    console.log(`Promise (addStampCatConnection()) rejection error --> ${err}`)
                })

                // Looping to add all category and tag associations within a stamp (tags are assumed to already exist, which was accomplished by a different POST prior to saving).                     
                // Adding an association between tag and category <----------
                addCatTagConnection(5, 1).then(function(dbResults) {
                    if (dbResults.affectedRows > 0) {
                        console.log(`Successful category & tag association insert.`)
                    } else {
                        console.log(`No category & tag association record was inserted.`)
                    }
                }).catch(function(err) {
                    console.log(`Promise (addCatTagConnection()) rejection error --> ${err}`)
                })

                // Adding an association of tag to stamp (three-way table) to identify tags that were chosen for a stamp. <----------
                addStampCatTagConnection(5, 2, 3).then(function(dbResults) {
                    if (dbResults.affectedRows > 0) {
                        console.log(`Successful stamp & category & tag (three-way table) association insert.`)
                    } else {
                        console.log(`No stamp & category & tag (three-way table) association record was inserted.`)
                    }
                }).catch(function(err) {
                    console.log(`Promise (addStampCatTagConnection()) rejection error --> ${err}`)
                })

                    //res.render('adminUpload', { isAdmin: req.user.isAdmin, isDarkMode: false, activePageSearch: true, exactMatchResults: queryExactMatchResults, exactMatchCount: queryExactMatchResults.length, formData: req.body, looseMatchResults: results, userQuery: JSON.stringify(req.body) })

            }).catch(function(err) {
                console.log(`Promise (insertStamp()) rejection error --> ${err}`)
            })

        }).catch(function(err) {
            console.log(`Promise (insertArtifact()) rejection error --> ${err}`)
        })

        */
        // ------------------- Backup end ----------------------


    } else {

        // No save occurs and rerender the page.

        //res.render('adminUpload', { isAdmin: req.user.isAdmin, isDarkMode: false, activePageSearch: true, exactMatchResults: queryExactMatchResults, exactMatchCount: queryExactMatchResults.length, formData: req.body, looseMatchResults: results, userQuery: JSON.stringify(req.body) })
    }



}
// adminIndexerPageSavePOST()  // Simulating POST for debug

const adminIndexerPageUpdatePOST = (req, res) => {

    /*
        route will post ~ the same data format as savePOST

        ex:
            // Sample object posted from UI to be saved.
        /*
        var artifactDataObjToSave = {
            artifactID: null,  // For testing purposes, this will be the last index inserted + 1.  This exception applies to artifacts not inserted in the database yet.
            userID: 5,
            title: 'Pythagorean Theorem adminIndexTest',
            author: 'Khan Academy',
            description: `Trigonometry on Khan Academy: Big, fancy word, right? Don't be fooled. Looking at the prefix, tri-, you could probably assume that trigonometry (trig as it's sometimes called) has something to do with triangles. You would be right! Trig is the study of the properties of triangles. Why is it important? It's used in measuring precise distances, particularly in industries like satellite systems and sciences like astronomy. It's not only space, however. Trig is present in architecture and music, too. Now you may wonder...how is knowing the measurement and properties of triangles relevant to music?? THAT is a great question. Maybe you'll learn the answer from us in these tutorials!`,
            formatType: 'Link',
            location: 'https://www.youtube.com/embed/Jsiy4TxgIME',
            stamps: [
                stamp = {
                    stampID: null,  // For testing purposes, this will be the last index inserted + 1.  This exception applies to artifacts not inserted in the database yet.     
                    aTimestamp: '00:07:15', // Null by default.
                    pageNumber: null, // Null by default.
                    sectionPercentage: null, // Null by default.
                    // timestamp_page_location: null,  // Converted user entry field into either aTimestamp, pageNumber or sectionPercentage column value based on formatType before being sent to backend API.
                    shortStampName: 'SOH CAH TOA',
                    // views: 3700,
                    // thumbsUpCount: 250,
                    // thumbsDownCount: 20,
                    // isFlagged: 0,
                    categories: [
                        category = {
                            categoryID: 13,  // Selected prior to save. (e.g. Trigonometry)
                            tags: [
                                tag = {
                                    tagID: 8  // Selected prior to save. (e.g. 3-4-5)
                                },
                            ],
                        },
                    ]
                },
            ]
        }

        Get stampID from req.body
        Then queryDB for artifact based on stampID
        Compare formData if changes were made in title, author, and description fields 
            If so, update artifact table
        One Major change is that in some cases the stampID will not be null (existing stamps)
            In those cases we queryDB for stamp data (timestamp, shortStampName)
                then, we compare formData for those fields to dbData, if different update db
                then, remove all stampID connections on 3waybridge & stampCatBridge
                then, create connections based on formData for stampID, catID, and TagID
            In cases where stampID is null
                then, reuse savePOst logic to create stamp + connections
    */


        // Admin has correctly filled required minimum fields and passed validations.
        var isValidSave = true

        if(req.body.artifact.stamps){  // Checking if stamps exist (on the form).
            if (req.body.artifact.stamps.length < 1) {
                isValidSave = false
            } else {
                for (const stamp in req.body.artifact.stamps) {
                    if (req.body.artifact.stamps[stamp].categories){  // Checking if stamp category exist
                        if (req.body.artifact.stamps[stamp].categories.length < 1 || req.body.artifact.stamps[stamp].title == '' || req.body.artifact.stamps[stamp].location == '') {
                            isValidSave = false
                        } else {
                            for (const cat in req.body.artifact.stamps[stamp].categories) {
                                if (req.body.artifact.stamps[stamp].categories[cat].tags) {
                                    if (req.body.artifact.stamps[stamp].categories[cat].tags.length < 1 || req.body.artifact.stamps[stamp].categories[cat].category == '') {
                                        isValidSave = false
                                    }
                                } else {
                                    isValidSave = false
                                }
                            }
                        }
                    } else {
                        isValidSave = false
                    }
                }
            }
        } else {
            isValidSave = false
        }
        

        if (isValidSave) {

            // Retrieving artifactID and stampID from req.body
            var artifactID = req.body.artifactID
            var stampID = req.body.stampID

            // console.log(req.body, "<--- req.body")
            // console.log(req.body.artifact.stamps, "<--- req.body.artifact.stamps")
            // console.log(req.body.artifact.stamps[0].categories, "<--- req.body.artifact.stamps[0].categories")
            // console.log(req.body.artifact.stamps[0].categories[0].tags, "<--- req.body.artifact.stamps[0].categories[0].tags")

            // Function that returns an artifact by artifact ID and associated stamp, categories, and tag data.
            dbCombined.listArtifactDetailsByArtifactID(artifactID).then(function(dbArtifactResult) {   
        
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
                        stampResultTempObj['timestampORpageNumberORsection'] = resolveStampType()        
                        stampResultTempObj['stampTitle'] = dbArtifactResult[element].shortName        
                        stampResultTempObj['categories'] = dbArtifactResult[element].categories
            
                        // Pushing temporary stamp object to the stamps property of artifactResultObj.
                        artifactResultObj.stamps.push(stampResultTempObj)
            
                        // Resetting temporary object.
                        stampResultTempObj = {}
            
                    }    
            
                    // console.log(artifactResultObj, "<------")

                    // Comparing artifact formData if changes were made in title, author, and description fields 
                    // If so, update artifact table

                    if (req.body.artifact.title == artifactResultObj.artifactTitle && req.body.artifact.author == artifactResultObj.author && req.body.artifact.description == artifactResultObj.description) {
                        // Do nothing.
                    } else {
                        // Caller that accepts promise results when ready.
                        dbArtifacts.updateArtifactV2(req.body.artifactID, req.body.artifact.title, req.body.artifact.description, req.body.artifact.author).then(function(dbUpdateArtifactV2Results) {
                            if (dbUpdateArtifactV2Results.affectedRows > 0) {
                                // console.log(`Successful update of dbUpdateArtifactV2Results.`)
                            } else {
                                // console.log(`No dbUpdateArtifactV2Results record was updated.`)
                            }


                        }).catch(function(err) {
                            console.log(`Promise rejection error --> ${err}`)
                        })
                    }
                
                var stampInDB
                // Looping to check if stampIDs (in form) are non-null (i.e. existing stamp that may need an update).
                for (const stampIDIndex in req.body.artifact.stamps) {
                    // Comparing stamp formData to stamp data in database; if a mismatch is found, then updating timestamp and shortStampName values, removing all stampID connections in Stamps_Categories_Tags_Bridge (3-way-bridge) & Stamps_Categories_Bridge, and creating new connections based on formData for that stampID, catIDs, and tagIDs (essentially, instead of updates, recreating connections).

                    // Flag that checks if any of the stamps were found in the database.
                    stampInDB = false
                    // Comparing form's stampID to artifactResultObj DB call result's stampIDs.
                    for (const artifactResultObjStampsIndex in artifactResultObj.stamps) {
                        if (req.body.artifact.stamps[stampIDIndex].id == artifactResultObj.stamps[artifactResultObjStampsIndex].stampID) {
                            // console.log(`Form stamp index: ${stampIDIndex} AND \nForm stamp ID: ${req.body.artifact.stamps[stampIDIndex].id} \nDB stamp index: ${artifactResultObjStampsIndex} \nDB stamp ID: ${artifactResultObj.stamps[artifactResultObjStampsIndex].stampID}`)

                            stampInDB = true
                            // Transforming form's location to appropriate stamp type.
                            var convertedFormStamp = null;
                            var convertedFormStampToaTimestamp = null;
                            var convertedFormStampToPageNumber = null;
                            var convertedFormStampToSectionPercentage = null;
                            if (req.body.artifact.format == "Link" || req.body.artifact.format == ".MP4") {
                                // Transformed to aTimestamp (string 'hh:mm:ss')
                                convertedFormStampToaTimestamp = req.body.artifact.stamps[stampIDIndex].location                            
                            } else if (req.body.artifact.format == ".PDF") {
                                // Transformed to pageNumber (int)
                                convertedFormStampToPageNumber = req.body.artifact.stamps[stampIDIndex].location
                            } else if (req.body.artifact.format == ".PNG") {
                                // Transformed to pageNumber (string 'leftPixels, topPixels')
                                convertedFormStampToSectionPercentage = req.body.artifact.stamps[stampIDIndex].location
                            } else {
                                // console.log("Unexpected formatType during location conversion")
                            }

                            // Updating each stamp's stamp value and short name title if differences are found.
                            if (convertedFormStamp != artifactResultObj.stamps[artifactResultObjStampsIndex].timestampORpageNumberORsection || req.body.artifact.stamps[stampIDIndex].title != artifactResultObj.stamps[artifactResultObjStampsIndex].stampTitle) {
                    
                                // Caller that accepts promise results when ready.
                                dbStamps.updateStampV2(req.body.artifact.stamps[stampIDIndex].id, req.body.artifactID, convertedFormStampToaTimestamp, convertedFormStampToPageNumber, convertedFormStampToSectionPercentage, req.body.artifact.stamps[stampIDIndex].title).then(function(dbUpdateStampV2Results) {
                                    if (dbUpdateStampV2Results.affectedRows > 0) {
                                        // console.log(`Successful update of dbUpdateStampV2Results record.`)
                                    } else {
                                        // console.log(`No dbUpdateStampV2Results record was updated.`)
                                    }
                                }).catch(function(err) {
                                    console.log(`Promise rejection error --> ${err}`)
                                })

                            }

                            // Deleting all stamp's connections instead of comparing (for Stamps_Categories_Tags_Bridge (3-way-bridge) & Stamps_Categories_Bridge).
                            // Caller that accepts promise results when ready.
                            dbStampCatTagConn.deleteStampCatTagConnectionByStampID(req.body.artifact.stamps[stampIDIndex].id).then(function(dbDeleteStampCatTagConnectionResults) {
                                if (dbDeleteStampCatTagConnectionResults.affectedRows > 0) {
                                    // console.log(`Successful deletion of dbDeleteStampCatTagConnectionResults record(s).`)

                                    // Caller that accepts promise results when ready.
                                    dbStampCatConn.deleteStampCatConnectionV2(req.body.artifact.stamps[stampIDIndex].id).then(function(dbDeleteStampCatConnectionV2Results) {
                                        if (dbDeleteStampCatConnectionV2Results.affectedRows > 0) {
                                            // console.log(`Successful deletion of dbDeleteStampCatConnectionV2Results record(s).`)

                                            // Similar to adminIndexerPageSavePOST savePost logic for connections.

                                            // Looping to add associations of tag(s) within one or more categories to stamp(s) (three-way table) to identify tags that were chosen for a stamp.                     
                                            for (const catIndex in req.body.artifact.stamps[stampIDIndex].categories) {

                                                // Caller that accepts promise results when ready.    
                                                dbStampCatConn.addStampCatConnection(req.body.artifact.stamps[stampIDIndex].id, req.body.artifact.stamps[stampIDIndex].categories[catIndex].category).then(function (dbStampCatConnResults) {
                                                    if (dbStampCatConnResults.affectedRows > 0) {
                                                        // console.log(`Successful stampCatConnection insert (affected rows: ${dbStampCatConnResults.affectedRows}).`)
                                                    } else {
                                                        // console.log(`No stampCatConnection record was inserted.`)
                                                    }
                                                }).catch(function (err) {
                                                    console.log(`Promise rejection error --> ${err}`)
                                                })


                                                for (const tagIndex in req.body.artifact.stamps[stampIDIndex].categories[catIndex].tags) {

                                                    // Checking if category and tag connection already exists.
                                                    // Caller that accepts promise results when ready.
                                                    dbCatTagConn.listCatTagConnectionByIDs(req.body.artifact.stamps[stampIDIndex].categories[catIndex].category, req.body.artifact.stamps[stampIDIndex].categories[catIndex].tags[tagIndex].id).then(function (dbListCatTagConnectionResults) {
                                                        if (dbListCatTagConnectionResults.length == 0) {
                                                            // Adding category and tag connection.
                                                            // Caller that accepts promise results when ready.
                                                            dbCatTagConn.addCatTagConnection(req.body.artifact.stamps[stampIDIndex].categories[catIndex].category, req.body.artifact.stamps[stampIDIndex].categories[catIndex].tags[tagIndex].id).then(function (dbCatTagConnectionResults) {
                                                                if (dbCatTagConnectionResults.affectedRows > 0) {
                                                                    // console.log(`Successful addCatTagConnection insert (affected rows: ${dbCatTagConnectionResults.affectedRows}).`)
                                                                } else {
                                                                    // console.log(`No addCatTagConnection record was inserted.`)
                                                                }
                                                            }).catch(function (err) {
                                                                console.log(`Promise rejection error --> ${err}`)
                                                            })
                                                        }
                                                    }).catch(function (err) {
                                                        console.log(`Promise rejection error --> ${err}`)
                                                    })

                                                    // Arguments: stampID, catID, tagID          
                                                    dbStampCatTagConn.addStampCatTagConnection(req.body.artifact.stamps[stampIDIndex].id, req.body.artifact.stamps[stampIDIndex].categories[catIndex].category, req.body.artifact.stamps[stampIDIndex].categories[catIndex].tags[tagIndex].id).then(function (dbStampCatTagConnResults) {
                                                        if (dbStampCatTagConnResults.affectedRows > 0) {
                                                            // console.log(`Successful stamp & category & tag (three-way table) association insert (affected rows: ${dbStampCatTagConnResults.affectedRows}).`)
                                                        } else {
                                                            // console.log(`No stamp & category & tag (three-way table) association record was inserted.`)
                                                        }
                                                    }).catch(function (err) {
                                                        console.log(`Promise (addStampCatTagConnection()) rejection error --> ${err}`)
                                                    })
                                                }
                                            }
                                        } else {
                                            // console.log(`No dbDeleteStampCatConnectionV2Results record(s) was deleted.`)
                                        }
                                    }).catch(function(err) {
                                        console.log(`Promise rejection error --> ${err}`)
                                    })
                                } else {
                                    // console.log(`No dbDeleteStampCatTagConnectionResults record(s) was deleted.`)
                                }         
                            }).catch(function(err) {
                                console.log(`Promise rejection error --> ${err}`)
                            })
                        } 
                    }

                    // Else adding the stamp if stampID is null (a new stamp created), then creating stamp and associated data and connections.
                    if (stampInDB == false) {
                        // Reuse adminIndexerPageSavePOST savePost logic to create stamp + connections.
                        
                        // Transforming form's location to appropriate stamp type.
                        var convertedFormStamp = null;
                        var convertedFormStampToaTimestamp = null;
                        var convertedFormStampToPageNumber = null;
                        var convertedFormStampToSectionPercentage = null;
                        if (req.body.artifact.format == "Link" || req.body.artifact.format == ".MP4") {
                            // Transformed to aTimestamp (string 'hh:mm:ss')
                            convertedFormStampToaTimestamp = req.body.artifact.stamps[stampIDIndex].location                            
                        } else if (req.body.artifact.format == ".PDF") {
                            // Transformed to pageNumber (int)
                            convertedFormStampToPageNumber = req.body.artifact.stamps[stampIDIndex].location
                        } else if (req.body.artifact.format == ".PNG") {
                            // Transformed to pageNumber (string 'leftPixels, topPixels')
                            convertedFormStampToSectionPercentage = req.body.artifact.stamps[stampIDIndex].location
                        } else {
                            // console.log("Unexpected formatType during location conversion")
                        }

                        dbStamps.insertStamp(req.body.artifactID, convertedFormStampToaTimestamp, convertedFormStampToPageNumber, convertedFormStampToSectionPercentage, req.body.artifact.stamps[stampIDIndex].title, 0, 0, 0, 0).then(function (dbStampsResults) {
                            if (dbStampsResults.affectedRows > 0) {
                                // console.log(`Successful stamp insert (affected rows: ${dbStampsResults.affectedRows}).`)

                                var currentstampID = dbStampsResults.insertId

                                // Looping to add associations of tag(s) within one or more categories to stamp(s) (three-way table) to identify tags that were chosen for a stamp.                     
                                for (const catIndex in req.body.artifact.stamps[stampIDIndex].categories) {

                                    // Caller that accepts promise results when ready.    
                                    dbStampCatConn.addStampCatConnection(currentstampID, req.body.artifact.stamps[stampIDIndex].categories[catIndex].category).then(function (dbStampCatConnResults) {
                                        if (dbStampCatConnResults.affectedRows > 0) {
                                            // console.log(`Successful stampCatConnection insert (affected rows: ${dbStampCatConnResults.affectedRows}).`)
                                        } else {
                                            // console.log(`No stampCatConnection record was inserted.`)
                                        }
                                    }).catch(function (err) {
                                        console.log(`Promise rejection error --> ${err}`)
                                    })


                                    for (const tagIndex in req.body.artifact.stamps[stampIDIndex].categories[catIndex].tags) {

                                        // Checking if category and tag connection already exists.
                                        // Caller that accepts promise results when ready.
                                        dbCatTagConn.listCatTagConnectionByIDs(req.body.artifact.stamps[stampIDIndex].categories[catIndex].category, req.body.artifact.stamps[stampIDIndex].categories[catIndex].tags[tagIndex].id).then(function (dbListCatTagConnectionResults) {
                                            if (dbListCatTagConnectionResults.length == 0) {
                                                // Adding category and tag connection.
                                                // Caller that accepts promise results when ready.
                                                dbCatTagConn.addCatTagConnection(req.body.artifact.stamps[stampIDIndex].categories[catIndex].category, req.body.artifact.stamps[stampIDIndex].categories[catIndex].tags[tagIndex].id).then(function (dbCatTagConnectionResults) {
                                                    if (dbCatTagConnectionResults.affectedRows > 0) {
                                                        // console.log(`Successful addCatTagConnection insert (affected rows: ${dbCatTagConnectionResults.affectedRows}).`)
                                                    } else {
                                                        // console.log(`No addCatTagConnection record was inserted.`)
                                                    }
                                                }).catch(function (err) {
                                                    console.log(`Promise rejection error --> ${err}`)
                                                })
                                            }
                                        }).catch(function (err) {
                                            console.log(`Promise rejection error --> ${err}`)
                                        })

                                        // Arguments: stampID, catID, tagID          
                                        dbStampCatTagConn.addStampCatTagConnection(currentstampID, req.body.artifact.stamps[stampIDIndex].categories[catIndex].category, req.body.artifact.stamps[stampIDIndex].categories[catIndex].tags[tagIndex].id).then(function (dbStampCatTagConnResults) {
                                            if (dbStampCatTagConnResults.affectedRows > 0) {
                                                // console.log(`Successful stamp & category & tag (three-way table) association insert (affected rows: ${dbStampCatTagConnResults.affectedRows}).`)
                                            } else {
                                                // console.log(`No stamp & category & tag (three-way table) association record was inserted.`)
                                            }
                                        }).catch(function (err) {
                                            console.log(`Promise (addStampCatTagConnection()) rejection error --> ${err}`)
                                        })
                                    }
                                }
                            } else {
                                // console.log(`No stamp record was inserted.`)
                            }
                        }).catch(function (err) {
                            console.log(`Promise (insertStamp()) rejection error --> ${err}`)
                        })

                    }
                }

                } else {
                    // console.log(`No records match the artifactID of ${artifactID}`)
                }
            
            }).catch(function(err) {
                console.log(`Promise rejection error --> ${err}`)
            })  
            
            res.redirect('/searchPage')
        }
}
// adminIndexerPageUpdatePOST()  // Simulating POST for debug


const adminIndexerPageDeletePOST = (req, res) => {

    // console.log('req.body: ', req.body)
    // console.log('ArtifactID: ', req.body.artifactID)
    // console.log('AWSURL: ', req.body.aws)
    // console.log('Format: ', req.body.format)

    // Caller that accepts promise results when ready.
    dbArtifacts.deleteArtifact(req.body.artifactID).then(function(dbArtifactDeleteResults) {
        if (dbArtifactDeleteResults.affectedRows > 0) {
            // console.log(`Successful dbArtifactDeleteResults deletion.`)
        } else {
            // console.log(`No dbArtifactDeleteResults record was deleted.`)
        }
    }).catch(function(err) {
        console.log(`Promise rejection error --> ${err}`)
    })

    // AWS S3 objects will not be deleted for now because the key is not stored when s3_upload occurs.
    res.redirect('/searchPage')
}


const adminIndexerPageSaveCancelPOST = (req, res) => {
    // console.log(req.body.awsKey) <-- S3 object key from UI
    //console.log('Cancel', req.body)

    AWSS3deleteObject.deleteS3ObjectByKey(req.body.awsKey).then(function (data) {
        // console.log(`Object with key '${req.body.awsKey}' was successfully deleted.`)
        res.render('adminUpload', { activePageAdminUpload: true, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), })
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })


    //res.render('adminUpload', { isAdmin: req.user.isAdmin, isDarkMode: false, activePageSearch: true, exactMatchResults: queryExactMatchResults, exactMatchCount: queryExactMatchResults.length, formData: req.body, looseMatchResults: results, userQuery: JSON.stringify(req.body) })
    //res.redirect('/adminUpload')
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from artifactViewerPage update click -> render adminIndexer page
// - Initial completion of DB API to middleware.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const adminArtifactViewerUpdatePOST = (req, res) => {

    // console.log('StampID: ', req.body.stampID)
    // console.log('ArtifactID: ', req.body.artifactID)
    /*
    
    
    req.body
        stampID / artifactID
    queryDB by stampID / artifactID
        results{
            artifactID: int   
            location: string
            formatType: enum
            artifactTitle: string
            author: string
            description: string         
            stamps: [
                {
                    stampID: int
                    timestamp/pageNumber/section: timestamp/int/string
                    stampTitle: string
                    categories: [
                        category: {
                            catID: int
                            catTitle: char,
                            tags: [
                                tag: {
                                    tagID: int
                                    tagTitle: char
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    res.render 
        adminIndexer
            results
            isLightMode
            activePage
    
    */

    
    const artifactID = req.body.artifactID
    
    // Caller that accepts promise results when ready.
    
    const artifactInfoProm = dbCombined.listArtifactDetailsByArtifactID(artifactID)  
    
    artifactInfoProm.then(function (dbArtifactResult) {
    
        // Checking if records exist for the provided artifactID argument.
        if (dbArtifactResult.length != 0) {
            // console.log(dbArtifactResult)
        
            // Condensing dbArtifactResult list of objects to only minimal properties required.
        
            // Artifact information is the same throughout all records.
            var artifactResultObj = {
                'artifactID': dbArtifactResult[0].artifactID,
                'location': dbArtifactResult[0].location,
                'formatType': dbArtifactResult[0].formatType,
                'artifactTitle': dbArtifactResult[0].title,
                'author': dbArtifactResult[0].author,
                'description': dbArtifactResult[0].descr,
                'stamps': []
            }
            var stampResultTempObj = {}
        
            // Determing appropriate stamp type for artifact.
            function resolveStampType(element) {
                artifactStampType = null
                if (dbArtifactResult[element].aTimestamp != null) {
                    artifactStampType = dbArtifactResult[element].aTimestamp
                } else if (dbArtifactResult[element].pageNumber != null) {
                    artifactStampType = dbArtifactResult[element].pageNumber
                } else if (dbArtifactResult[element].sectionPercentage != null) {
                    artifactStampType = dbArtifactResult[element].sectionPercentage
                } else {
                    artifactStampType = `Unknown stamp type for artifact.`
                }
        
                return artifactStampType
            }
        
            for (const element in dbArtifactResult) {
                stampResultTempObj['formatTypeDuplicate'] = dbArtifactResult[element].formatType // Added due to handlebars issue with undefined values.

                stampResultTempObj['stampID'] = dbArtifactResult[element].stampID
                stampResultTempObj['timestampORpageNumberORsection'] = resolveStampType(element)
                stampResultTempObj['stampTitle'] = dbArtifactResult[element].shortName
                stampResultTempObj['categories'] = dbArtifactResult[element].categories
        
                // Pushing temporary stamp object to the stamps property of artifactResultObj.
                artifactResultObj.stamps.push(stampResultTempObj)
        
                // Resetting temporary object.
                stampResultTempObj = {}
        
            }
        
            // console.log(artifactResultObj, "<-----")
            res.render('adminIndexer', {isUpdate: true, activePageAdminUpload: true, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), artifact: artifactResultObj, stampID: req.body.stampID});
        
        } else {
            // console.log(`No records match the artifactID of ${artifactID}`)
        }
    
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })
    
    
    

}
// artifactViewerUpdatePOST()  // Simulating POST for debug.



const adminArtifactViewerDeletePOST = (req, res) => {
    //console.log('StampID to be deleted: ', req.body.stampID)

    var stampID = req.body.stampID
    // Caller that accepts promise results when ready.
    dbStamps.deleteStamp(stampID).then(function (dbResults) {
        if (dbResults.affectedRows > 0) {
            // console.log(`Successful deletion.`)
            res.redirect('/searchPage')
        } else {
            // console.log(`No record was deleted.`)
        }
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })

    // res.json({ dummy: 'data' })
}

// adminIndexerPageSaveCancelPOST()  // Simulating POST for debug




// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminIndexer save click -> render ?landing page?
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/*
      req.body
        artifactID
        title
        author
        description
        stamps [
            stamp{
                stampName
                timestamp/page/location
                categories [
                    category{
                        categoryID
                        tags [
                            tag{
                                tagID
                            }
                        ]
                    }
                ]
            }
        ]
 
       queryDB to update artifact, create stamps, create stamp, cat, tag connections
 
       if success
        update local instance of authorArray, titleArray, etc.
        res.render
            searchPage
                'repeat searchPage data'
    else
        res.json
            error
            
 
*/

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminIndexer create Category click -> respond json
// Call route from adminCatTagManagement create category click -> respond json
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const createCategoryPOST = (req, res) => {
    // console.log(req.body)
    /*
 
       req.body
        category
 
       queryDB to create category
 
       update local instance of categoryarray
 
       res.json
        category
        categoryID
 
*/
    //var catLabel = 'Calculus3'
    var catLabel = req.body.categoryName
    //var currentStampID = 7;  // Retrieved from UI.
    var currentCatID;    // Dynamically retrieved upon insert.
    // Caller that accepts promise results when ready.
    dbCategories.insertCategory(catLabel).then(function (dbCatResults) {
        if (dbCatResults.affectedRows > 0) {
            currentCatID = dbCatResults.insertId
            // console.log(`Successful category insert with catID of ${currentCatID}.`)

            res.json({ data: { id: currentCatID, categoryName: catLabel } });
        } else {
            // console.log(`No record was inserted.`)
        }
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })


    // res.json({ data: { id: 12, categoryName: req.body.categoryName } });
}
// createCategoryPOST()  // Simulating POST

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminIndexer create tag click -> respond json
// Call route from adminCatTagManagement create tag click -> respond json
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const createTagPOST = (req, res) => {
    // console.log(req.body)
    /*
 
       req.body
        tag
 
       queryDB to create tag
 
       update local instance of tagarray
 
       res.json
        tag
        tagID
*/


    var tagLabel = req.body.tagName
    // var currentCatID = 5;  // Retrieved from UI.
    var currentTagID;         // Dynamically retrieved upon insert.
    dbTags.insertTag(tagLabel).then(function (dbTagResults) {
        if (dbTagResults.affectedRows > 0) {
            // console.log(`Successful insert.`)

            currentTagID = dbTagResults.insertId
            // console.log(`Successful tag insert with tagID of ${currentTagID}.`)
            res.json({ data: { id: currentTagID, tagName: tagLabel } });
        } else {
            // console.log(`No record was inserted.`)
        }
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })



    // res.json({ data: { id: 12, tagName: req.body.tagName } });
}
// createTagPOST()  // Simulating POST


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Update existing route from leftNav cat and tag management -> render adminCatandTagManagement
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const adminTagManagementPage = (req, res) => {

    /*
 
   req.body
    null
 
   queryDB for all cat their tags, and tags
 
   results: [
    categories: [
        category: {
            categoryID: int
            categoryName: string
            tags: [
                tag: {
                    tagID: int
                    tagLabel: string
                }
            ]
        }
    ]
    tags: [
        tag: {
            tagid: int
            tagName: string
        }
    ]
]
 
   res.render
    adminCatandTagManagement
        isLightMode
        activePage
        results
 
*/

    var categories = []
    var tempCatObj = {}
    var tempTagObj = {}
    var isFirstCategory = true

    // Caller that accepts promise results when ready.
    const prom1 = dbCategories.listAllCategories().then(function(dbAllCatResults) {
        
        // Looping through each category
        var categoryIndices = []
        for (const catIndex in dbAllCatResults) {
            // console.log(dbAllCatResults[element])
            // Caller that accepts promise results when ready.
            dbCategories.listAllCatTagsByCatID(dbAllCatResults[catIndex].catID).then(function(dbAllCatTagsByCatIDResults) {
                if (dbAllCatTagsByCatIDResults.length > 0) {
                    // Looping through all tags within a category
                    isFirstCategory = true
                    tempCatObj = {}
                    tempCatObj.tags = []
                    for (const dbAllCatTagsByCatIDResultsIndex in dbAllCatTagsByCatIDResults) {
                        // console.log(dbAllCatTagsByCatIDResults[dbAllCatTagsByCatIDResultsIndex])

                        // If dbAllCatTagsByCatIDResults.categoryID (from database) matches any of the new list's categoryID, then push tags to that new list's category.tags; otherwise add a new category.
                        tempTagObj = {}

                        // Populating the first index of the new categories list to enable its looping.
                        if (isFirstCategory) {
                            isFirstCategory = false

                            tempCatObj.categoryID = dbAllCatTagsByCatIDResults[dbAllCatTagsByCatIDResultsIndex].catID
                            tempCatObj.categoryName = dbAllCatTagsByCatIDResults[dbAllCatTagsByCatIDResultsIndex].catLabel

                            tempTagObj.tagID = dbAllCatTagsByCatIDResults[dbAllCatTagsByCatIDResultsIndex].tagID
                            tempTagObj.tagName = dbAllCatTagsByCatIDResults[dbAllCatTagsByCatIDResultsIndex].tagLabel

                            tempCatObj.tags.push(tempTagObj)

                            categories.push(tempCatObj)


                        } else {
                            tempTagObj.tagID = dbAllCatTagsByCatIDResults[dbAllCatTagsByCatIDResultsIndex].tagID
                            tempTagObj.tagName = dbAllCatTagsByCatIDResults[dbAllCatTagsByCatIDResultsIndex].tagLabel
                            tempCatObj.tags.push(tempTagObj)
                        }                 
                        
                    }
                } else {  // Adding category with no tags to the categories list.
                    tempCatObj = {}
                    tempCatObj.tags = []
                    tempCatObj.categoryID = dbAllCatResults[catIndex].catID
                    tempCatObj.categoryName = dbAllCatResults[catIndex].catLabel
                    categories.push(tempCatObj)
                }
                
                // Rendering page once outer loop is completed.
                if (dbAllCatResults.length == parseInt(catIndex) + 1) {
                    // console.log(categories, "<----")
                    // console.log(categories[2])

                    // Caller that accepts promise results when ready.
                    dbTags.listAllTags().then(function(dbAllTagsResults) {
                        // for (const element in dbAllTagsResults) {
                        //     console.log(dbAllTagsResults[element])
                        // }
                        // console.log(dbAllTagsResults)

                        // console.log(categories)
                        
                        res.render('adminTagManagement', { activePageAdminTagManagement: true, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), categories: categories, tags: dbAllTagsResults})
                    }).catch(function(err) {
                        console.log(`Promise rejection error --> ${err}`)
                    })

                }   
            }).catch(function(err) {
                console.log(`Promise rejection error --> ${err}`)
            })
        }

    }).catch(function(err) {
        console.log(`Promise rejection error --> ${err}`)
    })

}
// adminTagManagementPage()  // Simulating POST for debug.

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminCatTagManagement delete category click -> respond json
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Deleting of a category and associations in two-way table.
const deleteCategoryPOST = (req, res) => {
    // console.log(req.body)
    /*
 
       req.body
        categoryID
 
       queryDB delete category, remove instances on both bridge tables
 
       update local instance categoryArray
 
       res.json
        success/failure
 
*/

    var isSuccess = false
    var catID = req.body.categoryID

    // Caller that accepts promise results when ready.
    dbCategories.deleteCategory(catID).then(function (dbCatResults) {
        if (dbCatResults.affectedRows > 0) {
            // console.log(`Successful deletion of category.`)
            isSuccess = true

            res.json({ success: isSuccess });

            // Associated connections are deleted via DB's ON DELETE CASCADE.

        } else {
            res.json({ success: isSuccess });

            // console.log(`No category record was deleted.`)
        }
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })
    
}
// deleteCategoryPOST()  // Simulating POST

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminCatTagManagement delete tag click -> respond json
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Deleting of a tag and associations in two-way and three-way tables.
const deleteTagPOST = (req, res) => {
    // console.log(req.body)
    /*
 
       req.body
        tagID
 
       queryDB delete tag, remove instances on both bridge tables
 
       update local instance tagArray
 
       res.json
        success/failure
 
*/

    var isSuccess = false
    // var deleteCatTagConnectionIsSuccess = false
    // var deleteStampCatTagConnectionIsSuccess = false

    var tagID = req.body.tagID

    // Caller that accepts promise results when ready.
    dbTags.deleteTag(tagID).then(function (dbTagResults) {
        if (dbTagResults.affectedRows > 0) {
            // console.log(`Successful deletion of tag.`)
            isSuccess = true

            res.json({ success: isSuccess });

            // Associated connections are deleted via DB's ON DELETE CASCADE.

            // // Potential loop that deletes all tag connections to categories.
            // // Caller that accepts promise results when ready.
            // dbCatTagConn.deleteCatTagConnection(catID, tagID).then(function(dbCatTagConnResults) {
            //     if (dbCatTagConnResults.affectedRows == 0) { // dbStampCatConn executed
            //         console.log(`Successful deletion of catTagConnection.`)
            //         deleteCatTagConnectionIsSuccess = true
            //     } else {
            //         console.log(`No catTagConnection record was deleted.`)
            //     }
            // }).catch(function(err) {
            //     console.log(`Promise rejection error --> ${err}`)
            // })

            // // Potential loop that deletes all tag connections within categories to all stamps.
            // // Delete stamp to tag association in three-way table.
            // dbStampCatTagConn.deleteStampCatTagConnection(stampID, catID, tagID).then(function(dbStampCatTagConnResults) {
            //     if (dbStampCatTagConnResults.affectedRows > 0) {
            //         console.log(`Successful deletion of stampCatTagConnection.`)
            //         deleteStampCatTagConnectionIsSuccess = true
            //     } else {
            //         console.log(`No stampCatTagConnection record was deleted.`)
            //     }
            // }).catch(function(err) {
            //     console.log(`Promise rejection error --> ${err}`)
            // })
        } else {
            res.json({ success: isSuccess });
            // console.log(`No tag record was deleted.`)
        }
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })

    // If all deletions of associations were exeucted successfully.
    // if (deleteCatTagConnectionIsSuccess && deleteStampCatTagConnectionIsSuccess) {
    //     isSuccess = true
    // }


    // res.json({ success: isSuccess });
}
// deleteTagPOST() // Simulating POST


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminCatTagManagement edit category click -> respond json
// UI to middleware done ~ CV
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const editCategoryPOST = (req, res) => {
    // console.log(req.body)
    // console.log('Category Name:', req.body.categoryName)
    // console.log('Category ID:', req.body.categoryID)
    /*
 
       req.body
        categoryName
        categoryID
 
       queryDB update categoryName where id matches
 
       update local instance of categoryArray
 
       res.json
        success/failure
 
*/

    var isSuccess = false;

    var catLabel = req.body.categoryName
    var catID = req.body.categoryID

    // Caller that accepts promise results when ready.
    dbCategories.updateCategory(catID, catLabel).then(function (dbResults) {
        if (dbResults.affectedRows > 0) {
            // console.log(`Successful update.`)
            isSuccess = true

            res.json({ success: isSuccess });
        } else {
            res.json({ success: isSuccess });
            // console.log(`No record was updated.`)
        }
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })
    
}
// editCategoryPOST() // Simulating POST


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminCatTagManagement tag click -> respond json
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const editTagPOST = (req, res) => {
    // console.log(req.body)
    // console.log('Tag Name:', req.body.tagName)
    // console.log('Tag ID:', req.body.tagID)
    /*
 
       req.body
        tagID
        tagName
 
       queryDB update tagName where id matches
 
       update local instance of tagArray
 
       res.json
        success/failure
 
*/

    var isSuccess = false

    var tagID = req.body.tagID
    var tagLabel = req.body.tagName

    // Caller that accepts promise results when ready.
    dbTags.updateTag(tagID, tagLabel).then(function (dbResults) {
        if (dbResults.affectedRows > 0) {
            // console.log(`Successful update.`)
            // console.log(dbResults)

            isSuccess = true

            res.json({ success: isSuccess });
        } else {
            res.json({ success: isSuccess });
            // console.log(`No record was updated.`)
        }
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })

    
}
// editTagPOST()  // Simulating POST


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminCatTagManagement remove tag click -> respond json
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Removing of a tag's association to a category.
const removeTagConnPOST = (req, res) => {
    // console.log(req.body)
    // console.log('Category ID:', req.body.categoryID)
    // console.log('Tag ID:', req.body.tagID)
    /*
     
           req.body
            tagID
            categoryID
     
           queryDB update bridgeTable where ids matches
     
           res.json
            success/failure
     
    */

    var isSuccess = false
    var catID = req.body.categoryID
    var tagID = req.body.tagID

    // Caller that accepts promise results when ready.
    dbCatTagConn.deleteCatTagConnection(catID, tagID).then(function (dbCatTagConnResults) {
        if (dbCatTagConnResults.affectedRows > 0) {
            // console.log(`Successful CatTagConnection deletion.`)

            isSuccess = true
                // Caller that accepts promise results when ready.
                dbStampCatTagConn.deleteStampCatTagConnectionByCatIDAndTagID(catID, tagID).then(function(dbDeleteStampCatTagConnResults) {
                    if (dbDeleteStampCatTagConnResults.affectedRows > 0) {
                        // console.log(`Successful dbDeleteStampCatTagConnResults deletion.`)                        

                        res.json({ success: isSuccess });
                    } else {

                        res.json({ success: isSuccess });
                        // console.log(`No dbDeleteStampCatTagConnResults record was deleted.`)
                    }
                }).catch(function(err) {
                    console.log(`Promise rejection error --> ${err}`)
                })
        } else {
            res.json({ success: isSuccess });
            // console.log(`No record was deleted.`)
        }
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })

}
// removeTagConnPOST() // Simulating POST

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminCatTagManagement add tag click -> respond json
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const addTagToCategoryPOST = (req, res) => {
    // console.log(req.body)
    // console.log('Tag Name:', req.body.tagName)
    // console.log('Tag ID:', req.body.tagID)
    /*
 
       req.body
        tagID
        categoryID
 
       queryDB update bridgeTable where ids matches
 
       res.json
        success/failure
 
*/

    var isSuccess = false

    var currentCatID = req.body.catID
    var currentTagID = req.body.tagID
    var tagName = req.body.tagName

    
    // Caller that accepts promise results when ready.
    dbCatTagConn.addCatTagConnection(currentCatID, currentTagID).then(function (dbCatTagConnResults) {
        if (dbCatTagConnResults.affectedRows > 0) {
            // console.log(`Successful catTagConnection insert.`)
            isSuccess = true

            res.json({ success: true });
        } else {
            res.json({ success: true });
            // console.log(`No record was inserted.`)
        }
    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })


}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Update existing route from leftNav tickets -> render adminTickets
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const adminTicketsPage = (req, res) => {
    /*
 
       req.body
        null
 
       queryDB for all tickets
 
       results: [
        ticket{
            ticketID: int
            username: string
            userSearchQuery: string
            datePlaced: date
        }
    ]
 
       res.render
        adminTickets
            isLightMode
            results
            activePage
 
       */


    // Caller that accepts promise results when ready.
    var tempDate;
    var tempField;
    dbTickets.listTickets().then(function (dbTicketResults) {
        if (dbTicketResults.length != 0) {
            for (const ticketsIndex in dbTicketResults) {
                // console.log(dbResults[ticketsIndex])'
                // Transforming DB date to format of 'Month Day Year'
                tempDate = dbTicketResults[ticketsIndex].datePlaced.toString()
                dbTicketResults[ticketsIndex].datePlaced = tempDate.slice(0, (tempDate.indexOf(':') - 3))

                dbTicketResults[ticketsIndex].parsedUserSearchQuery = JSON.parse(dbTicketResults[ticketsIndex].userSearchQuery)
                for (const element in dbTicketResults[ticketsIndex].parsedUserSearchQuery) {
                    tempField = dbTicketResults[ticketsIndex].parsedUserSearchQuery[element].field.toString()
                    dbTicketResults[ticketsIndex].parsedUserSearchQuery[element].field = tempField.slice((tempField.indexOf('.') + 1),)
                    dbTicketResults[ticketsIndex].parsedUserSearchQuery[element].field = tempField.slice((tempField.indexOf('.') + 1), (tempField.indexOf('.') + 2)).toUpperCase() + tempField.slice((tempField.indexOf('.') + 2),)
                }


                // Retrieving usernames based off of userID.
                dbUsers.findUserByID(dbTicketResults[ticketsIndex].userID).then(function (dbUserResults) {
                    for (const userIndex in dbUserResults) {
                        // console.log(dbUserResults[userIndex])
                        // dbResults[userIndex].username
                        dbTicketResults[ticketsIndex].username = dbUserResults[userIndex].username
                    }

                    // Rendering the page once the inner loop is finished.
                    if ((parseInt(ticketsIndex) + 1) == dbTicketResults.length) {
                        // console.log(dbTicketResults[ticketsIndex])
                        res.render('adminTickets', { activePageAdminTickets: true, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), ticketsResults: dbTicketResults, ticketCount: dbTicketResults.length })
                    }

                }).catch(function (err) {
                    console.log(`Promise rejection error --> ${err}`)
                })
            }
        } else {
            res.render('adminTickets', { activePageAdminTickets: true, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), ticketsResults: 0, ticketCount: 0 })
        }


    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })




    // Passing data through the route.
    //res.render('adminTickets', { activePageAdminTickets: true, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), })
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminTicketsPage search click -> render searchPage
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const adminTicketsPageSearchPOST = (req, res) => {
    // Caller that accepts promise results when ready.
    dbTickets.listTicketByID(req.body.ticketID).then(function (dbResults) {
        // Converting stored JSON object as a string back into JSON.
        // console.log(JSON.parse(dbResults[0].userSearchQuery))
        dbResults[0].userSearchQuery = JSON.parse(dbResults[0].userSearchQuery)
        // The dbResults's userSearchQuery property can be provided to listArtifactInfoMatchingSearchFormQuery as an argument to perform search (akin to top-navigation searching).
        // console.log(dbResults[0])  

        var queryObj = { row: [] }
        // var queryObj = dbResults[0].userSearchQuery
        for (const element in dbResults[0].userSearchQuery) {
            queryObj.row.push(dbResults[0].userSearchQuery[element])
        }

        // console.log('Form Data: ', queryObj)

        const searchFormQueryProm = dbCombined.listArtifactInfoMatchingSearchFormQuery(queryObj.row)

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
                // console.log(queryExactMatchResults[0].categories[0])
                // console.log(queryExactMatchResults[0].categories[0].tags)

            }

            res.render('searchPage', { isAdmin: req.user.isAdmin, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), activePageSearch: true, exactMatchResults: queryExactMatchResults, exactMatchCount: queryExactMatchResults.length, formData: queryObj, shortForm: (queryObj.row.length <= 1 ? true : false), looseMatchResults: null, userQuery: JSON.stringify(queryObj) })

        }).catch(function (err) {
            console.log(`Promise rejection error --> ${err}`)
        })

    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })


}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Call route from adminTicketsPage resolve click -> respond json
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const adminTicketsPageResolvePOST = (req, res) => {
    // console.log('Ticket ID:', req.body.ticketID)
    /*
          req.body
            ticketID
    
            queryDB to remove ticket
    
            res.json
            success=true/false
    */

    var ticketID = req.body.ticketID

    // Caller that accepts promise results when ready.
    dbTickets.deleteTicket(ticketID).then(function (dbResults) {
        var isSuccessful = false

        if (dbResults.affectedRows > 0) {
            // console.log(`Successful deletion.`)
            isSuccessful = true
            res.redirect('/adminTickets')  // Calling the route
        } else {
            // console.log(`No record was deleted.`)
        }


        // res.json({ success: isSuccessful })
        // res.render('adminTickets', { isAdmin: req.user.isAdmin, isDarkMode: false, activePageSearch: true,  })

    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Update existing route from leftNav flags -> render adminFlags
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const adminFlagsPage = (req, res) => {
    /*
    
            req.body
            null
    
            queryDB for all flagged stamps
    
    NOTE --- second reminder that current db does not support user query/userID of person who placed flag
    
            results: [
            result: {
                artifactTitle: string
                stampTitle: string
                stampID: int
                author: string
                description: string
                views: int
    
                    }
        ]
    
            res.render
            adminFlags
                isLightMode
                results
                activePage
    
    */

    dbCombined.listFlaggedStamps().then(function (dbResult) {

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


            // console.log("--------------Entered middleware-------------")
            // console.log(dbStampResult)

            res.render('adminFlags', { activePageAdminFlags: true, flaggedStamps: dbStampResult, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), })

        } else {
            res.render('adminFlags', { activePageAdminFlags: true, flaggedStamps: 0, isDarkMode: (req.cookies.isDarkMode == null) ? false : !(req.cookies.isDarkMode == 'true'), })
            // console.log(`No records match the artifactID of ${artifactID}`)
        }


    }).catch(function (err) {
        console.log(`Promise rejection error --> ${err}`)
    })


    // Passing data through the route.
    // res.render('adminFlags', { activePageAdminFlags: true })
}










// Exporting pages to be used by the routes/index.js.
module.exports = {
    adminUploadPage,
    adminUploadPageLinkPOST,
    adminUploadPagePOST, 
    adminIndexerCategoriesAndTagsGET,
    adminIndexerPageUpdatePOST,
    adminIndexerPageDeletePOST,
    adminIndexerPageSaveCancelPOST,
    adminArtifactViewerUpdatePOST,
    adminArtifactViewerDeletePOST,
    adminIndexerPageSavePOST,
    //adminIndexerPage,
    createCategoryPOST,
    createTagPOST,
    adminTagManagementPage,
    deleteCategoryPOST,
    deleteTagPOST,
    editCategoryPOST,
    editTagPOST,
    removeTagConnPOST,
    addTagToCategoryPOST,
    adminTicketsPage,
    adminTicketsPageSearchPOST,
    adminTicketsPageResolvePOST,
    adminFlagsPage,

}