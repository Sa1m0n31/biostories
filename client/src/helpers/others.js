const openCart = (shadow = true) => {
    const cart = document.querySelector('.cart');
    const cartChildren = Array.from(document.querySelectorAll('.cart>*'));

    if(shadow) {
        const background = document.querySelector('.background');
        background.style.zIndex = '9';
        background.style.opacity = '.5';
    }

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

    document.querySelector('html').classList.remove('after');

    const background = document.querySelector('.background');
    background.style.opacity = '0';

    cartChildren.forEach((item) => {
        item.style.opacity = '0';
    });
    setTimeout(() => {
        background.style.zIndex = '-1';
        cart.style.transform = 'scaleX(0)';
    }, 200);
}

const openMenu = () => {
    const menu = document.querySelector('.menu');
    const menuChildren = Array.from(document.querySelectorAll('.menu>*'));

    const background = document.querySelector('.background');
    background.style.zIndex = '9';
    background.style.opacity = '.5';

    menu.style.transform = 'scaleX(1)';
    setTimeout(() => {
        menuChildren.forEach((item) => {
            item.style.opacity = '1';
        });
    }, 200);
}

const closeMenu = () => {
    const menu = document.querySelector('.menu');
    const menuChildren = Array.from(document.querySelectorAll('.menu>*'));

    const background = document.querySelector('.background');
    background.style.opacity = '0';

    menuChildren.forEach((item) => {
        item.style.opacity = '0';
    });
    setTimeout(() => {
        background.style.zIndex = '-1';
        menu.style.transform = 'scaleX(0)';
    }, 200);
}

const removePolishChars = (str) => {
    return str
        .toLowerCase()
        .replace(/ą/g, "a")
        .replace(/ć/g, "c")
        .replace(/ę/g, "e")
        .replace(/ł/g, "l")
        .replace(/ń/g, "n")
        .replace(/ó/g, "o")
        .replace(/ś/g, "s")
        .replace(/ź/g, "z")
        .replace(/ż/g, "z");
}

export { openCart, closeCart, openMenu, closeMenu, removePolishChars }
