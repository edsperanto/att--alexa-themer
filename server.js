// server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// handlebars
const handlebars = require('express-handlebars');
const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// request handlers
const fs = require('fs');
const bp = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
app.use(bp.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(fileUpload());

// session & passport
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// system
const child_process = require('child_process');
const exec = child_process.exec;

// database
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const client = redis.createClient();

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

var playing = [];

function stopEverything() {
	while(playing.length > 0) {
		playing[0].kill();
		playing.splice(0, 1);
	}
}

function play(username) {
	stopEverything();
	let curr = exec(`play ./public/assets/music/${username}.mp3`);
	playing.push(curr);
}

// routes

app.use(express.static('public'));

app.get('/', (req, res) => {
	let cookieId;
	if(req.cookies)
		if(req.cookies['connect.sid'])
			cookieId = 'ses' + req.cookies['connect.sid'].split('.')[0];
	if(cookieId) {
		client.get(cookieId, (err, data) => {
			let cookie = JSON.parse(data).cookie;
			if(cookie.username)
				play(cookie.username);
		});
	}
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/upload', (req, res) =>{
  res.render("upload");
});

app.get('/stop', (req, res) => {
	stopEverything();
	res.render('index');
})

app.post('/upload', (req, res) => {
	let cookieId = 'ses' + req.cookies['connect.sid'].split('.')[0];
	console.log(req.files.music);
  fs.writeFile(`./public/assets/music/${req.body.username}.mp3`, req.files.music.data);
	client.get(cookieId, (err, data) => {
		let newCookie = JSON.parse(data);
		newCookie.cookie.username = req.body.username;
		client.set(cookieId, JSON.stringify(newCookie));
	});
  res.end();
});

app.post('/login', (req, res) =>{
  console.log('Logged In: ', req.body.username);
	play(req.body.username);
  res.end();
});

if(!module.parent) {
	app.listen(PORT, _ => {
		console.log(`Server listening at port ${PORT}`);
	});
}

