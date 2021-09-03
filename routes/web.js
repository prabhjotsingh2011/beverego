const homeController= require('../app/http/controllers/homeController');
const authController= require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController=require('../app/http/controllers/customers/orderController')
const AdminOrderController=require('../app/http/controllers/admin/orderController')
const statusController=require('../app/http/controllers/admin/statusController')

//middlewares
const guest =require('../app/http/middlewares/guest')
const auth =require('../app/http/middlewares/auth')
const admin =require('../app/http/middlewares/admin');



function initRoutes(app) {

    app.get("/",homeController().index)
    
    app.get("/cart",cartController().index)

    app.get("/login",guest,authController().login)
    app.post("/login",authController().postlogin)

    app.get("/register",guest, authController().register)
    app.post('/register',authController().postregister)


    app.post('/logout',authController().logout)

    app.post('/update-cart',cartController().update)
    
    //customer routes
    app.post('/orders',auth,orderController().store);
    
    app.get('/allorders',auth,orderController().index)
    
    
    
        
    
    //admin routes
    app.get('/adminOrders',admin,AdminOrderController().index);


    app.post('/status',statusController().update);

    
    
    // app.use((req,res)=>{
    //     res.status(404).render('errors/404')
    // })
    
    // app.get('*', function(req, res){
    //     res.send('what???', 404);
    //   });
    
    app.get('/:id',auth,orderController().show)
    
}

module.exports = initRoutes;