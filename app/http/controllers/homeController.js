const Menu = require('../../models/menu')

function homeController() {
    //factory function
    return {

        //to read page
        async index(req, res){
            
            const drink=await Menu.find();
            // console.log(drink);
            return res.render('home', { layout: false , drink:drink})
            
            
            Menu.find().then(async function(drink){
                // console.log(drink);
                // return res.render('home', { layout: false , drink:drink})
            })
        }
    }
}

module.exports = homeController;