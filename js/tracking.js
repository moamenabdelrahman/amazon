import {orders} from '../data/orders.js';
import {findProductById} from '../data/products.js';

const queryParams = new URLSearchParams(window.location.search);
const orderId = queryParams.get('orderId');
const productId = queryParams.get('productId');

document.querySelector('.js-main-content').innerHTML = mainContentHTML();

document.querySelector('.js-search-btn').addEventListener('click', () => {
    const query = document.querySelector('.js-search-input').value;
    window.location.href = `index.html?query=${query}`;
});

function mainContentHTML() {
    const item = getOrderItem(orderId, productId);

    return `
        <div class="fw-bold fs-4 mb-2">
          Arriving on <span>${item.deliveryDate}</span>
        </div>
        <div>${item.product.name}</div>
        <div class="mb-4">Quantity: <span>${item.quantity}</span></div>
        <img src="${item.product.image}" height="150px" class="mb-5">
        <div class="d-flex fw-semibold fs-5 justify-content-between mb-3">
          <div class="text-success">Preparing</div>
          <div>Shipped</div>
          <div>Delivered</div>
        </div>
        <div class="progress rounded-pill" style="height: 25px;">
          <div class="progress-bar bg-success rounded-pill" style="width: 10%"></div>
        </div>
      </div>
    `;
}

function getOrderItem(orderId, productId) {
    const order = findByOrderId(orderId);
    const item = findOrderItem(order.cartItems, productId);
    const product = findProductById(item.productId);

    return {
        product,
        deliveryDate: item.deliveryDate,
        quantity: item.quantity
    };
}

function findByOrderId(orderId) {
    let matching;
    orders.forEach(order => {
        if(order.id === orderId) {
            matching = order;
        }
    });
    return matching;
}

function findOrderItem(items, productId) {
    let matching;
    items.forEach(item => {
        if(item.productId === productId) {
            matching = item;
        }
    });
    return matching;
}