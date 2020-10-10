const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const passport = require('passport');
const JWTStrategy = passportJWT.Strategy;
const databaseConfig = require('./database');
const appConfig = require('./app');



const User = require('../model/usersModel');

module.exports = function (passport) {

};

/*
  To authorize each request  / To send term&cond and language change detection
*/

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : appConfig.secret,
    },
    function (jwtPayload, cb) {
      
          User.findById(jwtPayload._id)
            .then(user => { 
              if(user)
              {
                let userInfo = JSON.stringify(user);
                userInfo = JSON.parse(userInfo);
                return cb(null, userInfo);   
              }
              else
              {
                return cb('User does not exists',null);
              }
                

            })
            .catch(err => {
                return cb(err,null);
            });
    }
));