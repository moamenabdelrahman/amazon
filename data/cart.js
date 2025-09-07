export const cart = JSON.parse(localStorage.getItem('cart')) || [];

export function addToCart(productId, quantity) {
    let cartItem;
    for(let i=0; i<cart.length; i++) {
        if(cart[i].productId === productId) {
            cartItem = cart[i];
            break;
        }
    }

    if(cartItem) {
        cartItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            quantity,
            deliveryOptionId: '1'
        });
    }

    saveCart();
}

export function totalCartQuantity() {
    let total = 0;
    cart.forEach(item => {
        total += item.quantity;
    });

    return total;
}

export function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function findItemByProductId(productId) {
    let matching;
    cart.forEach(item => {
        if(item.productId === productId) {
            matching = item;
        }
    });
    return matching;
}

export function deleteItemByProductId(productId) {
    let idx;
    cart.forEach((item, index) => {
        if(item.productId === productId) {
            idx = index;
        }
    });
    cart.splice(idx, 1);
    saveCart();
}

export function updateItemQnt(productId, newQnt) {
    const item = findItemByProductId(productId);
    item.quantity = newQnt;

    saveCart();
}