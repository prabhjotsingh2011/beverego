import axios from 'axios'
import moment from 'moment';
import Swal from 'sweetalert2'
import initAdmin from './admin'

let addToCart=document.querySelectorAll('.add-to-cart');
let cartCounter=document.querySelector('#cartCounter');







function updateCart(drink) {
    axios.post('/update-cart',drink).then((res)=>{
        cartCounter.innerText=res.data.totalQty;
        Swal.fire({
            // position: 'top-end',
            icon: 'success',
            title: 'Item added to cart Successfully',
            showConfirmButton: false,
            timer: 1000
          })
        
    }).catch(err=>{
        alert(err);
    })
}


addToCart.forEach((btn) => {
    btn.addEventListener('click',(e)=>{
        let drink=JSON.parse(btn.dataset.drink);
        console.log(drink);
        updateCart(drink)
        // console.log(drink.name);

    })
});


const alertMsg=document.querySelector('#success-alert');
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000);
}

initAdmin();

const btn = document.querySelector("button.mobile-menu-button");
const menu = document.querySelector(".main-menu");
btn.addEventListener("click", () => {
	menu.classList.toggle("hidden");
});



//for order details//

function generate(orders) {
    let count=1;
    // console.log(orders[0][1].item.name);
    return orders.map((order)=>{
        // console.log(order[1].qty);
        return `
        <div class="flex justify-between text-2xl py-3 ">
        <span class="" >${count++ }.</span>

        <span class="" >${order[1].item.name}&#160&#160&#160</span>
        <span class="flex justify-end">${orders[0][1].qty} ${" " }pcs</span>
            <br>
        </div>

        `
    }).join('')
}
// const markupss=generate(arrayOrder)
// order_detail.innerHTML=markupss;



//change order status
let statuses=document.querySelectorAll('.status_line')
let order=document.querySelector('#hiddenInput') ?document.querySelector('#hiddenInput').value :null;
order=JSON.parse(order);
let time=document.createElement('small');
const order_detail=document.querySelector('#order_detail')


function updateStatus(order) {

    let stepCompleted=true;

    
    const order_detail=document.querySelector('#order_detail');
    let arrayOrder= Object.entries(order.items)
    // console.log(arrayOrder[0][1].item.name);
        // console.log(arrayOrder[1][1].qty);
        // console.log(arrayOrder[0][1].item.name);
        const markupss=generate(arrayOrder)
        order_detail.innerHTML=markupss;



        
    
    statuses.forEach((status)=>{
        let dataProp=status.dataset.statuss;
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        


        if (dataProp===order.status) {  
            stepCompleted=false;
            time.innerText=moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })

}
updateStatus(order);


//socket
let socket=io()

//join                  
if (order) {
    
    socket.emit('join',`order_${order._id}`) //when all =order page will open this will send data to socket to create a private room
}

//socket-> not working 
//data is recieved in server.js 
//but not sending or recieving it in this listner

socket.on('orderUpdateds',(data)=>{
    console.log("ewegwgwg");
    const updatedOrder={...order}
    updatedOrder.updatedAt=moment().format();
    updatedOrder.status=data.status;
    console.log(data);
})      





