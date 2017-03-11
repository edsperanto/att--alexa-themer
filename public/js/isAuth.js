//authentication middleware
const isAuth = (function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    next();
  }else{
    console.log('suck it trebek');
    res.redirect(303, '/login');
  }
});

module.exports = isAuth;