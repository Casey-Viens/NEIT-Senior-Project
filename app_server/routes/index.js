/*
    Example comparison of manual routing and serving pages versus MVC routing:

        Manual routing:
            /app.js:
                app.get("/", function(req, res) {
                    res.sendFile(__dirname + "/index.html")
                })

        MVC routing:
            routes/index.js:
                router.get('/', ctrlPages.mainPage)
            controllers/pages.js:
                const mainPage = (req, res) => {
                    // Passing data through the route.
                    res.render('index')
                }
*/

const express = require('express')
const router = express.Router()
// const ctrlPages = require('../controllers/pages')
const ctrlSharedPages = require('../controllers/sharedPages')
const ctrlAdminPages = require('../controllers/adminPages')
const passport = require('passport')

// Loading passport-config for authenticating requests.
// const initializePassportLocal = require('../../utils/passport-config') // <------------- To be reactivated later
// Alternative way of requiring and passing data to passport-config.js.
// const initializePassportLocal = require('../../utils/passport-config')(passport)

// Testing passport as if data was passed in from the client browser (UI).
// const testUser1UI = {
//     username: `testUser12`,
//     userPassword: `testUser1`
// }

// initializePassportLocal(
//     passport
//     //testUser1UI
// );

//initializePassportLocal();



// Multer is a middleware for handling multipart/form-data, primarily helpful for uploading files.
const multer = require('multer')
// Defining local disk location to store file and defining a filename.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //cb (null, '../../public/tempUploadStaging/')  // Note: Dest storage path value starts at the root 
        cb(null, './public/tempUploadStaging')  // Note: Dest storage path value starts at the root 
    },
    filename: function (req, file, cb) {
        //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
    }
})
//const upload = multer({ dest: '../../public/tempUploadStaging/' })  // Note: Dest storage path value starts at the root 
const upload = multer({ storage: storage })

// ----Routes to render a page.----
router.get('/', checkNotAuthenticated, ctrlSharedPages.loginPage)
router.get('/index', checkNotAuthenticated, ctrlSharedPages.loginPage)
//console.log("Entered index.js")
router.post('/index', checkNotAuthenticated, passport.authenticate('local', {
    // If this middleware function gets called, authentication was successful and req.user contains the authenticated user.
    successRedirect: '/searchPage',
    failureRedirect: '/index',
    successFlash: true,
    failureFlash: true,
    badRequestMessage: 'Invalid login'  // Default: Missing Credentials  
    // next() function is called by default, calling the next callback function.
    //}, ctrlPages.loginPagePOST))
}))
// Log out route (left navigation bar).
router.delete('/logout', checkAuthenticated, ctrlSharedPages.logoutPOST)


// Shared pages
router.get('/topNavArrays', checkAuthenticated, ctrlSharedPages.topNavArrays)
router.get('/toggleDarkMode', checkAuthenticated, ctrlSharedPages.toggleDarkMode)
router.get('/searchPage', checkAuthenticated, ctrlSharedPages.searchPage)
router.post('/searchPagePOST', checkAuthenticated, ctrlSharedPages.searchPagePOST)
router.get('/artifactViewer', checkAuthenticated, ctrlSharedPages.artifactViewer)

router.post('/createTicketPOST', checkAuthenticated, ctrlSharedPages.createTicketPOST)
router.post('/toggleLikePOST', checkAuthenticated, ctrlSharedPages.toggleLikePOST)
router.post('/toggleDislikePOST', checkAuthenticated, ctrlSharedPages.toggleDislikePOST)
router.post('/toggleFlagPOST', checkAuthenticated, ctrlSharedPages.toggleFlagPOST)
router.get('/dataAnalytics', checkAuthenticated, ctrlSharedPages.dataAnalytics)
router.get('/dataAnalyticsPageGETChartData', checkAuthenticated, ctrlSharedPages.dataAnalyticsPageGETChartData)



// Admin Pages
router.get('/adminUpload', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminUploadPage)
router.post('/adminUploadPageLinkPOST', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminUploadPageLinkPOST)
// Temporary route to test multer.
router.post('/adminUploadPageAWSPOST', checkAuthenticated, checkAuthorized, upload.single('artifactToUpload'), ctrlAdminPages.adminUploadPagePOST)  // Note: The upload.single('artifactToUpload') argument looks for the "name" attritube in the HTML form input.
//router.get('/adminIndexer', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminIndexerPage)
router.get('/adminIndexerCategoriesAndTagsGET', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminIndexerCategoriesAndTagsGET)
router.post('/adminIndexerPageDeletePOST', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminIndexerPageDeletePOST)
router.post('/adminIndexerPageSaveCancelPOST', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminIndexerPageSaveCancelPOST)
router.post('/adminArtifactViewerUpdatePOST', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminArtifactViewerUpdatePOST)
router.post('/adminArtifactViewerDeletePOST', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminArtifactViewerDeletePOST)
router.post('/adminIndexerPageSavePOST', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminIndexerPageSavePOST)
router.post('/adminIndexerPageUpdatePOST', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminIndexerPageUpdatePOST)
router.post('/createCategoryPOST', checkAuthenticated, checkAuthorized, ctrlAdminPages.createCategoryPOST)
router.post('/createTagPost', checkAuthenticated, checkAuthorized, ctrlAdminPages.createTagPOST)
router.post('/deleteCategoryPost', checkAuthenticated, checkAuthorized, ctrlAdminPages.deleteCategoryPOST)
router.post('/deleteTagPost', checkAuthenticated, checkAuthorized, ctrlAdminPages.deleteTagPOST)
router.post('/editCategoryPost', checkAuthenticated, checkAuthorized, ctrlAdminPages.editCategoryPOST)
router.post('/editTagPost', checkAuthenticated, checkAuthorized, ctrlAdminPages.editTagPOST)
router.post('/removeTagPost', checkAuthenticated, checkAuthorized, ctrlAdminPages.removeTagConnPOST)
router.post('/addTagToCategoryPost', checkAuthenticated, checkAuthorized, ctrlAdminPages.addTagToCategoryPOST)
router.get('/adminTickets', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminTicketsPage)
router.post('/adminTicketsPageSearchPOST', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminTicketsPageSearchPOST)
router.post('/adminTicketsPageResolvePOST', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminTicketsPageResolvePOST)
router.get('/adminFlags', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminFlagsPage)
router.get('/adminTagManagement', checkAuthenticated, checkAuthorized, ctrlAdminPages.adminTagManagementPage)



// Passport function that prevents users from navigating to the page directly without being authenticated.
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/index')
}

// Passport function that prevents authenticated users from navigating back to the login page.  Instead, they are returned to their respective search page.
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/searchPage')
    }

    next()
}

// Passport function that validates if they are an admin.  If true, the admin is permitted to visit the page.  Otherwise, the student is redirected back to the search landing page.
function checkAuthorized(req, res, next) {
    if (req.user.isAdmin) {
        return next()
    }

    res.redirect('/searchPage')
}


// Exporting to be used in app.js.
module.exports = router