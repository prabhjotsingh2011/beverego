
require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const initRoutes = require('./routes/web');
const mongoose = require('mongoose');
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
const passport = require('passport');
const Emitter=require('events')


//connection to DB
mongoose.connect(process.env.MONGO_CONNECTION_URL, { useCreateIndex: true, useFindAndModify: true, useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("database connected");
})


const PORT = process.env.PORT || 3000;

//session store
let mongoStore = new MongoDbStore({
    // mongooseConnection: connection,
    mongoUrl: process.env.MONGO_CONNECTION_URL,
    collection: 'sessions'
})


//event emitter

const eventEmitters=new Emitter();
app.set('eventEmitter',eventEmitters);





//session config
app.use(session({
    secret: process.env.COOKIES_SECRET,  
    resave: false,
    saveUninitialized: false,
    store:mongoStore,
    cookie: { maxAge: 3600000} //1 hrs  
}))


//passport config
const passportInit=require('./app/config/passport')
passportInit(passport);
app.use(passport.initialize())
app.use(passport.session())



app.use(flash())


//Assets
app.use(express.static('public'));

//global middleware
app.use((req,res,next)=>{
    res.locals.sessionss= req.session;
    res.locals.user=req.user;
    next();
})

//set template engine
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');



//calling web,js for routes
require('./routes/web')
initRoutes(app);



const server = app.listen(PORT, () => {
    console.log(`listning at ${PORT}`);
})


//socket

const io=require('socket.io')(server)
io.on('connection',(socket)=>{
    // console.log(socket.id);
    socket.on('join',(orderId)=>{
        socket.join(orderId)
    })
})


eventEmitters.on('orderUpdated',(data)=>{
    // console.log(data.id);
     io.to(`order_${data.id}`).emit('orderUpdateds',data)
})

// eventEmitters.on('orderUpadted',(data)=>{
//     console.log(data.id);
//     // io.to(`order_${data.id}`).emit('orderUpdated',data)
// });
