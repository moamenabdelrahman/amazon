import {findProductById} from '../data/products.js';
import {cart, totalCartQuantity, saveCart, findItemByProductId, deleteItemByProductId, updateItemQnt} from '../data/cart.js';
import {deliveryOptions, findOptionById} from '../data/delivery.js';
import {formatMoney} from '../utils/money.js';
import {addOrder} from '../data/orders.js';

const placeOrderBtn = document.querySelector('.js-place-order');
renderOrderSummary();
adjustPlaceOrderBtnState();
renderNavbar();
document.querySelector('.js-items-container').innerHTML = cartItemsHTML() || emptyCartItemsHTML();

placeOrderBtn.addEventListener('click', () => {
    addOrder(cart, orderSummary().orderTotal);
    cart.splice(0, cart.length);
    saveCart();
    window.location.href = 'orders.html';
});

document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const productId = radio.dataset.productId;
        const optionId = radio.dataset.optionId;
        updateCartItemDelivery(productId, optionId);
        renderOrderSummary();

        const option = findOptionById(optionId);
        document.querySelector(`.js-item-date[product-id="${productId}"]`).innerHTML = option.date;
    });
});

document.querySelectorAll('.js-delete-item').forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = btn.dataset.productId;
        removeCartItem(productId);
    })
});

document.querySelectorAll('.js-update-qnt').forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = btn.dataset.productId;
        const toHide = document.querySelector(`.js-saved-qnt-state[product-id="${productId}"]`);
        const toShow = document.querySelector(`.js-edited-qnt-state[product-id="${productId}"]`);
        toHide.classList.add('d-none');
        toShow.classList.remove('d-none');
    });
});

document.querySelectorAll('.js-save-qnt').forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = btn.dataset.productId;
        const newQnt = Number(document.querySelector(`.js-qnt-input[product-id="${productId}"]`).value);
        if(newQnt === 0) {
            removeCartItem(productId);
        } else if(newQnt < 0) {
            alert("You can't have a negative value in quantity!");
        } else {
            const toShow = document.querySelector(`.js-saved-qnt-state[product-id="${productId}"]`);
            const toHide = document.querySelector(`.js-edited-qnt-state[product-id="${productId}"]`);
            toHide.classList.add('d-none');
            toShow.classList.remove('d-none');
    
            updateItemQnt(productId, newQnt);
            document.querySelector(`.js-item-quantity[product-id="${productId}"]`).innerHTML = newQnt;
            renderNavbar();
            renderOrderSummary();
            adjustPlaceOrderBtnState();
        }
    });
});


function orderSummary() {
    const summary = {
        totalAmount: 0,
        shipping: 0,
        totalBeforeTax: 0,
        estimatedTax: 0,
        orderTotal: 0
    };
    cart.forEach(item => {
        const product = findProductById(item.productId);
        const option = findOptionById(item.deliveryOptionId);
        summary.totalAmount += product.priceCents * item.quantity;
        summary.shipping += option.priceCents;
    });
    summary.totalBeforeTax = summary.totalAmount + summary.shipping;
    summary.estimatedTax = summary.totalBeforeTax * 0.1;
    summary.orderTotal = summary.totalBeforeTax + summary.estimatedTax;

    return summary;
}

function renderOrderSummary() {
    const summary = orderSummary();

    document.querySelector('.js-summary-items').innerHTML = totalCartQuantity();
    document.querySelector('.js-totalAmount').innerHTML = `$${formatMoney(summary.totalAmount)}`;
    document.querySelector('.js-shipping').innerHTML = `$${formatMoney(summary.shipping)}`;
    document.querySelector('.js-total-before-tax').innerHTML = `$${formatMoney(summary.totalBeforeTax)}`;
    document.querySelector('.js-estimated-tax').innerHTML = `$${formatMoney(summary.estimatedTax)}`;
    document.querySelector('.js-order-total').innerHTML = `$${formatMoney(summary.orderTotal)}`;
}

function renderNavbar() {
    document.querySelector('.js-navbar-qnt').innerHTML = `${totalCartQuantity()} items`;
}

function cartItemsHTML() {
    let html = '';

    cart.forEach(item => {
        const product = findProductById(item.productId);
        const option = findOptionById(item.deliveryOptionId);

        let deliveryOptionsHTML = '';
        deliveryOptions.forEach(opt => {
            deliveryOptionsHTML += `
                <div class="form-check d-flex align-items-center gap-2 mb-3">
                    <input class="form-check-input" type="radio" name="delivery-${product.id}" id="delivery-${product.id}-${opt.id}"
                        data-product-id="${product.id}" data-option-id="${opt.id}" ${option.id===opt.id? 'checked': ''}>
                    <label class="form-check-label" for="delivery-${product.id}-${opt.id}">
                        <span class="text-success fw-bold">${opt.date}</span>
                        <br>
                        <span class="text-muted fs-7">
                            ${opt.priceCents>0? `$${formatMoney(opt.priceCents)} -`: 'FREE'} Shipping
                        </span>
                    </label>
                </div>
            `;
        });

        html += `
            <div class="card" product-id="${product.id}">
                <div class="card-body">
                    <div class="card-title text-success fw-bold mb-3">
                        Delivery date: <span class="js-item-date" product-id="${product.id}">${option.date}</span>
                    </div>
                    <div class="row gx-4 mb-4">
                        <img src="${product.image}" class="col-4" height="150px" style="object-fit: contain;">
                        <div class="col-8">
                            <div class="fw-bold overflow-hidden mb-2" style="max-height: 45px;">${product.name}</div>
                            <div class="fw-bold text-danger mb-3">$${formatMoney(product.priceCents)}</div>
                            <span>Quantity:</span>
                            <span class="js-saved-qnt-state" product-id=${product.id}>
                                <span class="me-1 js-item-quantity" product-id="${product.id}" >${item.quantity}</span>
                                <a class="text-decoration-none btn-link me-2 js-update-qnt" data-product-id="${product.id}">Update</a>
                            </span>
                            <span class="d-none js-edited-qnt-state" product-id=${product.id}>
                                <input type="number" class="me-2 js-qnt-input" min="0" product-id="${product.id}" style="width: 50px;" value="${item.quantity}">
                                <a class="text-decoration-none me-2 btn-link js-save-qnt" data-product-id="${product.id}">Save</a>
                            </span>
                            <a class="text-decoration-none btn-link js-delete-item" data-product-id="${product.id}">Delete</a>
                        </div>
                    </div>
                    <div class="fw-bold mb-2">Choose a delivery option:</div>
                        ${deliveryOptionsHTML}
                    </div>
                </div>
            </div>
        `;
    });

    return html;
}

function emptyCartItemsHTML() {
    return `
        <div class="card border-danger">
            <div class="card-body">
                <div class="card-title mt-2 fw-bold text-danger">
                    Your Cart is Empty!
                </div>
            </div>
        </div>
    `;
}

function updateCartItemDelivery(productId, optionId) {
    const item = findItemByProductId(productId);
    item.deliveryOptionId = optionId;
    saveCart();
}

function removeCartItem(productId) {
    const container = document.querySelector('.js-items-container');
    const card = document.querySelector(`.card[product-id="${productId}"]`);
        
    deleteItemByProductId(productId);
    card.remove();
    if(!container.innerHTML.trim()) {
        container.innerHTML = emptyCartItemsHTML();
    }
    renderNavbar();
    renderOrderSummary();
    adjustPlaceOrderBtnState();
}

function adjustPlaceOrderBtnState() {
    placeOrderBtn.disabled = (totalCartQuantity() <= 0);
}