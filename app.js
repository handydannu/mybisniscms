const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const engine = require('ejs-mate');
const flash = require('req-flash');

//router web
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const categoryRouter = require('./routes/category');
const advertRouter = require('./routes/advert');
const product = require('./routes/product');

//router API
const authApi = require('./routes/api/auth');
const advertApi = require('./routes/api/advert');
const productApi = require('./routes/api/product');
const userApi = require('./routes/api/users');

const app = express();
const sessionStore = new session.MemoryStore;

// view engine setup
app.engine('ejs', engine);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

//Web
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/auth', authRouter);
app.use('/category', categoryRouter);
app.use('/product', product);
app.use('/advert', advertRouter);

//API
app.use('/api/auth', authApi);
app.use('/api/product', productApi);
app.use('/api/user', userApi);
app.use('/api/advert', advertApi);


app.use('/privacy-policy', (req, res) => {

    res.render('privacy-policy')

});


// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
