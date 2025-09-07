import { searchProducts } from '../data/products.js';
import { addToCart, totalCartQuantity } from '../data/cart.js';
import {formatMoney} from '../utils/money.js';

const queryParams = new URLSearchParams(window.location.search);
const query = queryParams.get('query');

document.querySelector('.js-products-container').innerHTML = getProductsHTML() || 'Empty Result!';
renderNavbar();

document.querySelector('.js-search-btn').addEventListener('click', () => {
    const query = document.querySelector('.js-search-input').value;
    window.location.href = `index.html?query=${query}`;
});

document.querySelectorAll('.js-addToCart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = btn.dataset.productId;
        const qnt = document.querySelector(`[qnt-product-id="${productId}"]`);
        addToCart(productId, Number(qnt.value));
        blinkAddToCartCheckmark(productId);
        renderNavbar();
    });
});

function getProductsHTML() {
    const products = searchProducts(query || '');
    
    let html = '';
    products.forEach((product) => {
        html += `
            <div class="col p-3 border">
                <div class="card border-0">
                    <img src="${product.image}" class="card-img-top" style="height: 200px; object-fit: contain;">
                    <div class="card-body pb-1">
                        <div class="card-title fs-6 lh-sm overflow-hidden" style="max-height: 35px;">${product.name}</div>
                        <div class="row g-2 row-cols-2">
                        <img src="images/ratings/rating-${product.rating.stars * 10}.png" height="20px" class="col-auto">
                        <div class="col-auto text-primary">${product.rating.count}</div>
                        <div class="col-12 fw-bold">$${formatMoney(product.priceCents)}</div>
                        <div class="col-12 mb-3">
                            <select name="quantity" class="form-select" style="width: 70px;" qnt-product-id = ${product.id}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            </select>
                        </div>
                        <div class="col-12 invisible d-flex align-items-start gap-2" checkmark-product-id="${product.id}">
                            <img src="images/icons/checkmark.png" height="20px">
                            <span class="text-success">Added</span>
                        </div>
                        <button type="button" class="col-12 btn btn-warning px-4 fs-8 rounded-pill js-addToCart-btn" data-product-id="${product.id}">
                            Add to Cart
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    return html;
}

function renderNavbar() {
    document.querySelector('.js-navbar-quantity').innerHTML = totalCartQuantity();
    document.querySelector('.js-search-input').value = query || '';
}

function blinkAddToCartCheckmark(productId) {
    const checkmark = document.querySelector(`[checkmark-product-id="${productId}"]`);
    checkmark.classList.remove('invisible');
    setTimeout(() => {
        checkmark.classList.add('invisible');
    }, 1500);
}