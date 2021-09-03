const Order=require('../../../models/order')

function statusController() {
    return {

        update(req,res){
            Order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,data)=>{
                if (err) {
                    console.log(err);
                }   
                //Emit event
                const eventEmitter=req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated',{id:req.body.orderId,status:req.body.status})
                // console.log(eventEmitter);
               
                // eventEmitter.emit('orderUpdated',{name:"ffeee"}) 
                return res.redirect('/adminOrders')
            })
        }
    }
}

module.exports=statusController;