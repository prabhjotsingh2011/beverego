const mongoose = require('mongoose');

const menuSchema=mongoose.Schema({
     name:{
         type:String,
        required:true,
     },
     image:{
         type:String,
        required:true,
     },
     price:{
         type:String,
        required:true,
     },
     size:{
         type:String,
        required:true,
     },
})

// const Menu=;

module.exports=mongoose.model('Menu',menuSchema);