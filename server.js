const express = require('express');
const router = express.Router();
const handlebars = require('express-handlebars');
const bp = require('body-parser');
const isAuth = require('./public/js/isAuth');
const methodOverride = require('method-override');
const db = require('./models');
const User = db.User;
const PORT = process.env.PORT || 3000;
const CONFIG = require('./config/config.json');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const app = express();
const bcrypt = require('bcrypt');


app.use(express.static('public'));
app.use(bp.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(session({
  store: new RedisStore(),
  secret: 'Ed is Chinese',
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({
      where: {
        username: username,
        }
      }).then( user =>{
        if(user === null){
          return done(null, false);
        }else{
          bcrypt.compare(password,user.password).then((res)=>{
            if(res){
              return done(null, user);
            }else{
              return done(null, false);
            }
          });
       
        }
      }).catch((err)=>{
        console.log('error', err);
      });
    }
    
));  

const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

