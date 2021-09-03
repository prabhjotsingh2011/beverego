const LocalStrategy=require('passport-local').Strategy
const User = require('../models/user');
const bcrypt=require('bcrypt')

async function init(passport) {
    passport.use(new LocalStrategy({usernameField:'email'},async (email,password,done)=>{

        //login logic

        //check if email exists
       const user=await User.findOne({email:email})
       if (!user) {
           return done(null,false,{message:'No user exists with this email'})
       }


       bcrypt.compare(password,user.password).then((match)=>{
           if(match){
               return done(null,user,{message:'logged in sucessfully'})
           }
           return done(null,false,{message:'wrong username password'})
       }).catch(err=>{
           return done(null,false,{message:'something went wrong please try again'})
       })   
    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id);  //stored users id in session
    })

    passport.deserializeUser((id,done)=>{    //got user id stored in session in id parameter
        User.findById(id,(err,user)=>{
            done(err,user);
        });
    })
}
module.exports=init;