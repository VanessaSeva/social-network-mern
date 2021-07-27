const express = require('express');
const userRoutes = require('./routes/user.routes.js');
const postRoutes = require('./routes/post.routes.js');

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config({path: './config/.env'});
require('./config/db');

const { checkUser, requireAuth } = require('./middleware/auth.middleware')
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeader': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}


app.use(cors({ origin: process.env.CLIENT_URL }))

//jwt
app.get('*', checkUser)
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
})

//routes
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)




app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})