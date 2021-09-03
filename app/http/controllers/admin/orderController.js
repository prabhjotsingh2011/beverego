const order = require("../../../models/order")

const Order = require('../../../models/order')

function AdminOrderController() {
    return {

        index(req, res) {
            Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } }).populate('customerId', '-password').exec((err, orders) => {
                // console.log(orders);
                if (req.xhr) {
                    return res.json(orders);
                } else {
                    // console.log(orders);
                    return res.render('admin/orders')
                }
            })
        }
    }

}

module.exports = AdminOrderController;