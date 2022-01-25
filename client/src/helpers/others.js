const openCart = () => {
    const cart = document.querySelector('.cart');
    const cartChildren = Array.from(document.querySelectorAll('.cart>*'));

    cart.style.transform = 'scaleX(1)';
    setTimeout(() => {
        cartChildren.forEach((item) => {
            item.style.opacity = '1';
        });
    }, 200);
}

const closeCart = () => {
    const cart = document.querySelector('.cart');
    const cartChildren = Array.from(document.querySelectorAll('.cart>*'));

    cartChildren.forEach((item) => {
        item.style.opacity = '0';
    });
    setTimeout(() => {
        cart.style.transform = 'scaleX(0)';
    }, 200);
}

export { openCart, closeCart }
