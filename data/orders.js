import dayjs from 'https://unpkg.com/dayjs@1.11.18/esm/index.js';
import {findOptionById} from './delivery.js';

export const orders = JSON.parse(localStorage.getItem('orders')) || [];
let nextOrderId = orders.length + 1;


export function addOrder(cart, orderTotal) {
    cart.forEach(item => {
        const option = findOptionById(item.deliveryOptionId);
        delete item.deliveryOptionId;
        item.deliveryDate = option.date;
    });
    
    orders.push({
        id: String(nextOrderId),
        date: dayjs().format('MMMM D'),
        total: orderTotal,
        cartItems: cart
    });

    nextOrderId++;
    saveOrders();
}

function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}