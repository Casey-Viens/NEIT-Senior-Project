/* 
    Casey Viens & George Saban Jr.
    Professor Gooch
    SE425.80 Senior Project
    12 July 2022
    Repository created for NEIT quarter 12 SE425.80 Senior Project. This repository serves as a source control repository for 
        Team Index Innovators' Knowledge Stitcher application.

    Heroku Deployment Live Link (as of 7/12/2022): https://se425-ks-proof-of-concepts.herokuapp.com/
        
*/

// Light-weight web application framework that helps organize a web application into MVC architecture on the server side.  
// Useful for setting up views and routes (gets added to package.json file as a dependency that can be reinstalled later).
var express = require('express')
// Handlebars is a templating engine similar to ejs module that keeps the view and code separated.
const exphbs = require('express-handlebars')
// Note: The body-parser package allows easier parsing of the body elements in a HTML form (client) to a server via a request.
const bodyparser = require('body-parser')
// Enables easier interactions with path directories (e.g. joins).
const path = require('path')
// Allows hashing of passwords.
//const bcrypt = require('bcrypt')
// Middleware that authenticates requests.
const passport = require('passport')
// The express-session stores the session id within a cookie, where the cookie exists in the client end (browser), and the session data is stored on the server's backend store (such as a database).  Every time a request is sent to a server, the cookie is sent, allowing session data to be accessed and saved.
const session = require('express-session')
// Extension wrapper of connect-flash that allows flashing and rendering of message without redirecting the request.
const flash = require('express-flash')
const { parseWithoutProcessing } = require('handlebars')
// Allows overriding of POST to be deleted.
const methodOverride = require('method-override')
// Allows cookies to be set and sent between client and server
const cookieParser = require('cookie-parser')


var app = express()
const port = process.env.PORT || 3000;




// Attaching imports to app.
// Creates application/x-www-form-urlencoded parser.  Also enables body parser post data to be more readable and useful (excludes metadata).
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))  // Allows web page information to be accessible within routes via req and res objects.
app.use(express.json())

// Static route that points to the root in order to provide access to static files & images folders.
// app.use(express.static(__dirname + '/'));

// app.get("/views/index.html", function(req, res) {
//     res.sendFile(__dirname + "/index.html")
// })

// Using app_server/routes/index.js for routing pages.
const router = require('./app_server/routes/index')

// Loading passport-config for authenticating requests.
const initializePassportLocal = require('./utils/passport-config') // <------------- To be reactivated later
// Alternative way of requiring and passing data to passport-config.js.
// const initializePassportLocal = require('./utils/passport-config')(passport)

// Testing passport as if data was passed in from the client browser (UI).
// const testUser1UI = {
//     username: `testUser1`,
//     userPassword: `testUser1`
// }


initializePassportLocal(
    passport
);

// The line below needs to be commented on when Casey runs the server locally since he does not have the db set up, so the server fails
const dbConn = require('./models/db')



// Middleware that defines Express sessions (e.g. sets req.session objects).

app.use(session({
    secret: 'secret', // Signs cookie
    resave: true,	// Resaves session variables regardless of if changes were made
    saveUninitialized: true  // If session is not modified, save session regardless
    // cookie: { secure: true }
}));


// Initialize passport middleware
// Sets up the serialize/deserialize functions of user data based on client browser requests.  This is called whenever a route request is called.
app.use(passport.initialize())
// Alters the request object by obtaining the session ID from the client cookie and deserializing into the user object. 
app.use(passport.session())

// Enable flash messages.
app.use(flash());

app.use(methodOverride('_method'))
app.use(cookieParser())


app.use('/', router)

// Catch-all error handler.
app.use(function (err, req, res, next) {
    console.log("Catch-all error handler activated --> ", err)
});

// Configuring the view engine.
app.engine('hbs', exphbs.engine({
    // Setting the default layout.
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        select(selected, option) {
            return (selected == option) ? 'selected="selected"' : '';
        },
        thumbnail(format, source, thumbnail) {
            if (format == 'Link') {
                if (source) {
                    var key = source.slice(source.indexOf('embed/') + 6,)
                    return '<img class="aspect-video" src="https://img.youtube.com/vi/' + key + '/sddefault.jpg" alt="">'
                }
            } else if (format == '.PNG') {
                return '<div class="aspect-video" style="overflow: hidden; display: flex; justify-content: center; justify-items: center;"> <img src="' + source + '"></img> </div>'
            } else if (format == '.MP4' || format == '.MP3') {
                return '<video class="aspect-video" src="' + source + '"></video>'
            } else if (format == '.PDF') {
                return '<div class="aspect-video" style="overflow: hidden; display: flex; justify-content: center; justify-items: center;"> <img src="' + './tempArtifactFiles/backupPDF.png' + '"></img> </div>'
            }
        },
        mediaPlayer(format, source, location) {
            // source = location
            // location = timestampORpageNumberORsection
            if (format == 'Link') {
                var tempLocation = location.split(':')
                var seconds = (+tempLocation[0]) * 60 * 60 + (+tempLocation[1]) * 60 + (+tempLocation[2])
                if (source.indexOf('?start') > -1) {
                    var source = source.slice(0, source.indexOf('?start'))
                }
                return '<iframe class="w-10/12 aspect-video" src="' + source + '?start=' + seconds + '" title="Video Title" frameborder="0"allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"allowfullscreen="true"> </iframe>'
            } else if (format == '.PNG') {
                //onload="adjustPosition(this, ' + location + ')"
                // console.log('<div class="overflow-scroll w-8/12" style="height: 600px;"><img id="image" data-location="' + location + '" src="' + source + '" alt="" class="max-w-none"></div>')
                return '<div class="overflow-scroll w-8/12" style="height: 600px;"><img id="image" data-location="' + location + '" src="' + source + '" alt="" class="max-w-none"></div>'
            } else if (format == '.MP4' || format == '.MP3') {
                return '<video class="w-10/12 aspect-video" controls><source src="' + source + '#t=' + location + '" type="video/mp4"></video>'
            } else if (format == '.PDF') {
                //<iframe id="mediaPlayer" width="80%" height="700px" src="https://docs.google.com/viewerng/viewer?url=' + source + '#page=' + location + '&embedded=true" frameborder="0" allow="fullscreen"></iframe>
                // console.log('<iframe id="mediaPlayer" width="80%" height="700px" src="https://docs.google.com/viewerng/viewer?url=' + source + '#page=' + location + '&output=embed" frameborder="0" allow="fullscreen"></iframe>')
                //return '<iframe id="mediaPlayer" width="80%" height="700px" src="https://docs.google.com/viewerng/viewer?url=' + source + '#page=' + location + '&output=embed" target="_parent" frameborder="0" allow="fullscreen"></iframe>'
                return '<iframe id="mediaPlayer" width="80%" height="700px" src="https://docs.google.com/viewerng/viewer?url=' + source + '&embedded=true" frameborder="0" allow="fullscreen"></iframe>'
            }
        },
        indexerMediaPlayer(format, source) {
            if (format == 'Link') {
                return '<iframe id="mediaPlayer" class="w-10/12 aspect-video" src="' + source + '" title="Video Title" frameborder="0"allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"allowfullscreen="true"> </iframe>'
            } else if (format == '.PNG') {
                return '<div id="mediaPlayer" class="overflow-scroll w-8/12" style="height: 600px;"><img src="' + source + '" alt="" class="max-w-none"></div>'
            } else if (format == '.MP4' || format == '.MP3') {
                return '<video id="mediaPlayer" class="w-10/12 aspect-video" controls><source src="' + source + '" type="video/mp4"></video>'
            } else if (format == '.PDF') {
                return '<iframe id="mediaPlayer" width="80%" height="700px" src="https://docs.google.com/viewerng/viewer?url=' + source + '&embedded=true" frameborder="0" allow="fullscreen"></iframe>'
            }
        },
        adminIndexerLocationInput(format, isHidden, index) {
            if (!isHidden) {
                if (format == 'Link') {
                    return '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Timestamp</label> <input required oninvalid="formIsInvalid()" type="text" id="stamp' + index + 'location" name="artifact[stamps][' + index + '][location]" size="10" placeholder="hh:mm:ss" pattern="(?:\\d{2,}):(?:[012345]\\d):(?:[012345]\\d)" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                } else if (format == '.PNG') {
                    return '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Image Position</label> <input required oninvalid="formIsInvalid()" name="artifact[stamps][' + index + '][location]" readonly value="0,0" type="text" id="stamp' + index + 'location" size="10" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                } else if (format == '.MP4' || format == '.MP3') {
                    return '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Timestamp</label> <input required oninvalid="formIsInvalid()" name="artifact[stamps][' + index + '][location]" readonly value="0" type="text" id="stamp' + index + 'location" size="10" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                } else if (format == '.PDF') {
                    return '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Page</label> <input required oninvalid="formIsInvalid()" name="artifact[stamps][' + index + '][location]" type="number" value="0" min="0" step="1" id="stamp' + index + 'location" size="10" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                }
            } else {
                if (format == 'Link') {
                    // console.log(`<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Timestamp</label><input type="text" id="stamp#location" size="10" pattern="^(?:(?:([01]?\\d|2[0-3]):)?([0-5]?\\d):)?([0-5]?\\d)$" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">`)
                    return `<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Timestamp</label><input oninvalid="formIsInvalid()" type="text" id="stamp#location" size="10" placeholder="hh:mm:ss" pattern="(?:\\d{2,}):(?:[012345]\\d):(?:[012345]\\d)" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">`
                } else if (format == '.PNG') {
                    return '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Image Position</label> <input oninvalid="formIsInvalid()" readonly value="0,0" type="text" id="stamp#location" size="10" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                } else if (format == '.MP4' || format == '.MP3') {
                    return '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Timestamp</label> <input oninvalid="formIsInvalid()" readonly value="0" type="text" id="stamp#location" size="10" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                } else if (format == '.PDF') {
                    return '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Page</label> <input oninvalid="formIsInvalid()" type="number" value="0" min="0" step="1" id="stamp#location" size="10" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                }
            }
        },
        adminIndexerUpdateLocationInput(format, isHidden, index, value) {

            // console.log('Helper function format', format)
            // console.log('Helper function isHidden', isHidden)
            // console.log('Helper function index', index)
            // console.log('Helper function value', value)
            if (!isHidden) {
                if (format == 'Link') {
                    var html = '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Timestamp</label> <input required oninvalid="formIsInvalid()" value="' + value + '" type="text" id="stamp' + index + 'location" name="artifact[stamps][' + index + '][location]" size="10" placeholder="hh:mm:ss" pattern="(?:\\d{2,}):(?:[012345]\\d):(?:[012345]\\d)" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                    // console.log(html)
                    return html
                } else if (format == '.PNG') {
                    return '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Image Position</label> <input required oninvalid="formIsInvalid()" value="' + value + '" name="artifact[stamps][' + index + '][location]" readonly type="text" id="stamp' + index + 'location" size="10" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                } else if (format == '.MP4' || format == '.MP3') {
                    return '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Timestamp</label> <input required oninvalid="formIsInvalid()" value="' + value + '" name="artifact[stamps][' + index + '][location]" readonly type="text" id="stamp' + index + 'location" size="10" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                } else if (format == '.PDF') {
                    return '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Page</label> <input required oninvalid="formIsInvalid()" value="' + value + '" name="artifact[stamps][' + index + '][location]" type="number" min="0" step="1" id="stamp' + index + 'location" size="10" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                }
            } else {
                if (format == 'Link') {
                    return `<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Timestamp</label><input oninvalid="formIsInvalid()" type="text" id="stamp#location" size="10" placeholder="hh:mm:ss" pattern="(?:\\d{2,}):(?:[012345]\\d):(?:[012345]\\d)" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">`
                } else if (format == '.PNG') {
                    return '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Image Position</label> <input oninvalid="formIsInvalid()" readonly value="0,0" type="text" id="stamp#location" size="10" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                } else if (format == '.MP4' || format == '.MP3') {
                    return '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Timestamp</label> <input oninvalid="formIsInvalid()" readonly type="text" value="0" id="stamp#location" size="10" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                } else if (format == '.PDF') {
                    return '<label class="font-medium text-ks-light-text dark:text-ks-dark-text">Page</label> <input oninvalid="formIsInvalid()" type="number" value="0" min="0" step="1" id="stamp#location" size="10" class="px-3 py-1 rounded-md border text-ks-light-text border-ks-light-border dark:border-ks-dark-border">'
                }
            }
        },
        adminIndexerUpdateFlexOrHidden(index) {
            if (index == 0) {
                return 'flex'
            } else {
                return 'hidden'
            }
        },
        adminIndexerUpdateisActive(index) {
            if (index == 0) {
                return 'active bg-ks-light-foregroundActive dark:bg-ks-dark-foregroundActive'
            } else {
                return 'bg-ks-light-background dark:bg-ks-dark-background'
            }
        },
        adminCatAndTagManagementisActive(index) {
            if (index == 0) {
                return 'active flex'
            } else {
                return 'hidden'
            }
        },
        adminIndexerLocationButton(format) {
            //console.log('format -- ', format)
            if (format == '.PNG' || format == '.MP4' || format == '.MP3') {
                //console.log('<button type="button" onclick="setLocation(this, event,`' + format + '`)"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"> <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /> </svg> </button>')
                return '<button class="bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-2 py-2 my-auto" type="button" onclick="setLocation(this, event,`' + format + '`)"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"> <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /> </svg> </button>'
            } else {
                return ''
            }
        }
    }
    //helpers: require('./helpers/handlebars')
}))

// Setting the view engine.
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, "public")))

app.listen(port, function (error) {
    if (error) {
        console.log("Unfortunately, something went wrong ", error)
    } else {
        console.log("Server is listening on port ", port)
    }
})