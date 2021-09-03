const bcrypt = require('bcrypt');
const passport = require('passport');
const User=require('./../../models/user')

function authController(){
    return{
        login:(req,res)=>{
        res.render("auth/login")
        },

        postlogin:(req,res,next)=>{  

            const {email,password}=req.body;
              // validate request
              if(!email || !password){
                req.flash('error','All fields are required') 
                return res.redirect('/login');
            }

            passport.authenticate('local',(err,user,info)=>{  //whenever authenticate is called it goes to config and check for conditions and (err,user,info) this will store the data which will come from done() in passport config file.
                if (err) {
                    req.flash('error',info.message)
                    return next(err);
                }
                if (!user) {
                    req.flash('error',info.message)
                    return res.redirect('/login');
                }

                req.logIn(user,(err)=>{
                    if (err) {
                        req.flash('error',info.message)
                        return next(err);
                    }
                    if (req.user.role==='admin') {
                        
                        return res.redirect('/adminOrders');
                    }
                    return res.redirect('/');


                })
            })(req,res,next)
        },




        register:(req,res)=>{
        res.render("auth/register")
        },
        async postregister(req,res){
            const{ name,email,password } = req.body;

            // validate request
            if(!name || !email || !password){
                req.flash('error','All fields are required') 
                req.flash('name',name);
                req.flash('email',email);
                return res.redirect('/register');
            }

            //check email exists
            User.exists({email:email},(err,result)=>{
                if (result) {
                    req.flash('error','email already exists') 
                    req.flash('name',name);
                    return res.redirect('/register');
                }
            })

            //hashing password
            const hashedPassword=await bcrypt.hash(password,10)

            // create a user 
            const user=new User({
                name:name,
                email:email,
                password:hashedPassword,

            })

            user.save().then((user)=>{
                // auto login

                return res.redirect('/')
            }).catch((err)=>{
                req.flash('error','something went wrong') 
                return res.redirect('/register');
            })

            // console.log(req.body);


        },

        logout(req,res){
            req.logout()
            return res.redirect('/login')
        }

    }
}

module.exports=authController