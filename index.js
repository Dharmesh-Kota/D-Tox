const express = require('express');
const port = 8000;
const apk = express();
const env = require('./config/environment')
const logger = require('morgan')
const path = require('path')
const cookieParser = require('cookie-parser');

// access to express-ejs-layouts
const expressLayouts = require('express-ejs-layouts');

// access to the database
const db = require('./config/mongoose');

//access to express session for cookie encryption
const session = require('express-session');

//access to passport.js and passport local strategy
const passport = require('passport');
const passportLocal = require('./config/passport-strategy-local');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-startegy');

// giving access to the mongo-connect
const MongoStore = require('connect-mongo');

// node-sass-middleware access
const sassMiddleware = require('node-sass-middleware');

// access to connect-flash package for flash notifications
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// establishing chat server to run with socket.io
// const chatServer = require('http').Server(apk);
// const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
// var io = require('socket.io')(chatServer, {
//     cors: {
//       origin: "http://localhost:8000",
//       methods: ["GET", "POST"],
//       credentials: true,
//       transports : ['websockets']
//     },
// });
// chatServer.listen(5000);
// console.log('Chat Server is listening on the port 5000');

if(env.name == 'development'){
    apk.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}

// using middlewares
apk.use(express.urlencoded());

//cookie parser
apk.use(cookieParser());

// giving access to statics
apk.use(express.static(env.asset_path));

// making the upload files available in the browser
apk.use('/uploads', express.static(__dirname + '/uploads'));

// accessing the logging file and the library to clear the trash log files in a particular interval,
// i.e., rotating-file-stream
apk.use(logger(env.morgan.mode, env.morgan.options));

// express-ejs-layout middleware to extract styles and scripts from sub pages into the layouts.
apk.use(expressLayouts);
apk.set('layout extractStyles', true);
apk.set('layout extractScripts', true);

// setting up ejs and giving access to the views folder
apk.set('view engine', 'ejs');
apk.set('views', './views');

// establishing cookie
apk.use(session({
    name: 'D-Tox',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookies: {
        maxAge: (1000*60*100)
    },
    // storing the cookie data in mongoDB
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/dtoxUsers',
        autoRemove: 'disabled'    
    }, function(err){
        console.log(err || 'connect-mongo setup ok!!');
    })
}));

// handling passport middlewares
apk.use(passport.initialize());
apk.use(passport.session());

// handling the checkAuthenticated function for evry request as a middleware
apk.use(passport.setAuthenticatedUser);

apk.use(flash());
apk.use(customMware.setFlash);

// using remote routes folder 
apk.use('/', require('./routes/index'));

apk.listen(port, function(err){
    if(err){
        console.log(`Error occured in starting the server on port: ${port}`);
    } else {
        console.log(`Server is running on port: ${port}`);
    }
});