import {orders} from '../data/orders.js';
import {findProductById} from '../data/products.js';
import {findOptionById} from '../data/delivery.js';
import {formatMoney} from '../utils/money.js';
import {addToCart, totalCartQuantity} from '../data/cart.js';

document.querySelector('.js-orders-container').innerHTML = ordersHTML() || emptyOrdersHTML();
renderNavbar();

document.querySelectorAll('.js-buy-again-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = btn.getAttribute('product-id');
        const orderId = btn.getAttribute('order-id');
        const qnt = Number(btn.dataset.qnt);
        addToCart(productId, qnt);
        renderNavbar();

        blinkBuyAgainBtn(orderId, productId);
    });
});

document.querySelector('.js-search-btn').addEventListener('click', () => {
    const query = document.querySelector('.js-search-input').value;
    window.location.href = `index.html?query=${query}`;
});

document.querySelectorAll('.js-track-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const orderId = btn.dataset.orderId;
        const productId = btn.dataset.productId;
        window.location.href = `tracking.html?orderId=${orderId}&productId=${productId}`;
    });
});

function ordersHTML() {
    let html = '';
    orders.forEach(order => {
        let itemsHtml = '';
        order.cartItems.forEach(item => {
            const product = findProductById(item.productId);

            itemsHtml += `
                <div class="row gx-5">
                    <div class="col-auto">
                        <img src="${product.image}" height="110px" width="120px" style="object-fit:contain;">
                    </div>
                    <div class="col">
                        <div class="row gy-2">
                            <div class="col-12 col-md-8 pe-4">
                                <div class="fw-bold mb-1 overflow-hidden" style="max-height: 45px;">${product.name}</div>
                                <div class="mb-1">Arriving on: <span>${item.deliveryDate}</span></div>
                                <div class="mb-1">Quantity: <span>${item.quantity}</span></div>
                                <div class="btn btn-warning">
                                    <div class="d-flex align-items-center gap-3 js-buy-again-btn" order-id="${order.id}" product-id="${product.id}" data-qnt="${item.quantity}">
                                        <img src="images/icons/buy-again.png" height="25px">
                                        <div class="fs-7">Buy it again</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <button class="btn border fs-7 track-btn shadow-sm js-track-btn" data-order-id="${order.id}" data-product-id="${product.id}">
                                    Track package
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
            <div class="card">
                <div class="card-header p-3 row mx-0">
                    <div class="col-12 col-md-auto me-3">
                        <strong>Order Placed:</strong> <br class="d-none d-md-block"> <span>${order.date}</span>
                    </div>
                    <div class="col-12 col-md-auto me-auto">
                        <strong>Total:</strong> <br class="d-none d-md-block"> <span>$${formatMoney(order.total)}</span>
                    </div>
                    <div class="col-12 col-md-auto">
                        <strong>Order ID:</strong> <br class="d-none d-md-block"> <span>${order.id}</span>
                    </div>
                </div>
                <div class="card-body d-flex flex-column gap-4 gap-md-6 py-5 px-4">
                    ${itemsHtml}
                </div>
            </div>
        `;
    });

    return html;
}

function emptyOrdersHTML() {
    return `
        <div class="card border-danger">
            <div class="card-body">
                <div class="card-title mt-2 fw-bold text-danger">
                    You have no past orders!
                </div>
            </div>
        </div>
    `;
}

function renderNavbar() {
    document.querySelector('.js-navbar-quantity').innerHTML = totalCartQuantity();
}

function blinkBuyAgainBtn(orderId, productId) {
    const btn = document.querySelector(`.js-buy-again-btn[product-id="${productId}"][order-id="${orderId}"]`);
    btn.innerHTML = '<div class="fs-7">Added!</div>';

    setTimeout(() => {
        btn.innerHTML = `
            <img src="images/icons/buy-again.png" height="25px">
            <div class="fs-7">Buy it again</div>
        `;
    }, 1500);
}