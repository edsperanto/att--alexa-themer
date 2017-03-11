// server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
// handlebars
const handlebars = require('express-handlebars');
const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// request handlers
const bp = require('body-parser');
const methodOverride = require('method-override');
app.use(bp.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// session & passport
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// database
const RedisStore = require('connect-redis')(session);

// custom helpers
const isAuth = require('./public/js/isAuth');
const CONFIG = require('./config/config.json');
const db = require('./models');
const User = db.User;

// session settings
app.use(session({
  store: new RedisStore(),
  secret: 'Ed is Chinese',
  resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// passport settings
passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({
      where: {
        username: username,
        }
      }).then( user =>{
        if(user === null){
          return done(null, false, {message: 'bad username'});
        }else{
          bcrypt.compare(password,user.password).then((res)=>{
            if(res){
              return done(null, user);
            }else{
              return done(null, false, {message: 'bad password'});
            }
          });
       
        }
      }).catch((err)=>{
        console.log('error', err);
      });
    }
));  
passport.serializeUser(function(user, done) {
  return done(null, user);
});
passport.deserializeUser(function(user, done) {
  return done(null, user);
});

// routes

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/upload', (req, res) =>{
  res.render("upload");
})

const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.post('/upload', (req, res) => {
  fs.writeFile(`${req.body.username}.mp3`, req.files.music.data);
  console.log(req.files);
  res.end();
});

const child_process = require('child_process');
const exec = child_process.exec;
app.post('/login', (req, res) =>{
  console.log('loggedin: ', req.body.username);
  exec(`play ${req.body.username}.mp3`);
  res.end();
});

if(!module.parent) {
	app.listen(PORT, _ => {
		console.log(`Server listening at port ${PORT}`);
	});
}

