const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: 'assets',
    session_cookie_key: process.env.D_TOX_SESSION_COOKIE_KEY,
    db: 'dtoxUsers',
    smtp: {
            service: 'gmail',
            host: 'smtp.gamil.com',
            port: 587,
            secure: false,
            auth: {
                user: 'dharmeshkota123@gmail.com',
                pass: 'kogjqsjrawhoqnvz'
            }
        },
    google_client_id: '961865475467-m8tv75cnjuh5991g9a7fo1e9pq63efrf.apps.googleusercontent.com',
    google_client_secret: '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',
    google_call_back_url: 'http://localhost:8000/users/auth/google/callback',

    jwt_secret: process.env.D_TOX_JWT_SECRET,
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.D_TOX_ASSET_PATH,
    session_cookie_key: process.env.D_TOX_SESSION_COOKIE_KEY,
    db: process.env.D_TOX_DB,
    smtp: {
            service: 'gmail',
            host: 'smtp.gamil.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.D_TOX_GMAIL_USERNAME,
                pass: process.env.D_TOX_GMAIL_PASSWORD
            }
        },
    google_client_id: process.env.D_TOX_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.D_TOX_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.D_TOX_GOOGLE_CALL_BACK_URL,

    jwt_secret: process.env.D_TOX_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = eval(process.env.D_TOX_ENVIRONMENT) == undefined ? development : eval(process.env.D_TOX_ENVIRONMENT);