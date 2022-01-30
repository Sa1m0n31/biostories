import React, {useEffect, useState} from 'react';
import menuIcon from '../static/assets/nasz-sklep.png'
import loginIcon from '../static/assets/users.svg'
import cartIcon from '../static/assets/shipping-bag.svg'
import logo from '../static/assets/logo.png'
import Cart from "./Cart";
import {openCart, openMenu} from "../helpers/others";
import Menu from "./Menu";
import auth from "../admin/helpers/auth";
import hamburger from '../static/assets/hamburger.svg'
import search from '../static/assets/search.svg'

const Header = ({topSmall, restricted}) => {
    const [isAuth, setIsAuth] = useState(false);
    const [render, setRender] = useState(false);

    useEffect(() => {
        auth()
            .then((res) => {
                setRender(true);
                setIsAuth(res?.data?.result === 1);
                if(!res?.data?.result && restricted) window.location = '/';
            });
    }, [])

    const changeTopStyle = () => {
        const y = window.pageYOffset;
        if(y > 5) {
            document.querySelector('.siteHeader__logoWrapper').style.transform = 'scale(.4) translateX(-50%)';
            document.querySelector('.siteHeader').style.height = '90px';
            document.querySelector('.siteHeader').style.paddingTop = '15px';
            document.querySelector('.siteHeader').style.alignItems = 'center';
        }
        else if(y < 5) {
            document.querySelector('.siteHeader__logoWrapper').style.transform = 'scale(1) translateX(-50%)';
            document.querySelector('.siteHeader').style.height = 'auto';
            document.querySelector('.siteHeader').style.paddingTop = '30px';
            document.querySelector('.siteHeader').style.alignItems = 'flex-start';
        }
    }

    useEffect(() => {
        if(!topSmall) {
            changeTopStyle();
            document.addEventListener('scroll', (e) => {
                changeTopStyle();
            });
        }
        else {
            document.querySelector('.siteHeader__logoWrapper').style.transform = 'scale(.4) translateX(-50%)';
            document.querySelector('.siteHeader').style.height = '90px';
            document.querySelector('.siteHeader').style.paddingTop = '15px';
            document.querySelector('.siteHeader').style.alignItems = 'center';
            document.querySelector('.topMenu').style.marginTop = '80px';
        }
    }, [topSmall]);

    return <>
        <Menu />
        <Cart />
        <header className="siteHeader w flex">
            <button className={render ? "siteHeader__menuBtn trans d-desktop" : "siteHeader__menuBtn trans opacity-0"} onClick={() => { openMenu(); }}>
                <img className="btn__img" src={menuIcon} alt="menu" />
            </button>
            <a className="siteHeader__logoWrapper" href="/">
                <img className="btn__img" src={logo} alt="bio-stories" />
            </a>
            <section className={render ? "siteHeader__right flex d-desktop" : "siteHeader__right opacity-0"}>
                <a className="siteHeader__right__item" href={isAuth ? "/moje-konto" : "/logowanie"}>
                    <img className="btn__img" src={loginIcon} alt="zaloguj-sie" />
                    {isAuth ? 'Moje konto' : 'Zaloguj się'}
                </a>
                <button className="siteHeader__right__item trans" onClick={() => { openCart(); }}>
                    <img className="btn__img" src={cartIcon} alt="zaloguj-sie" />
                    Twoje zakupy
                </button>
            </section>
            <button className="siteHeader__hamburgerMenu d-mobile" onClick={() => { openMenu(); }}>
                <img className="btn__img" src={hamburger} alt="menu" />
            </button>
        </header>
        <menu className="mobileBar d-mobile">
            <button className="mobileBar__btn">
                <img className="btn__img" src={search} alt="szukaj" />
            </button>
            <a className="mobileBar__btn" href={isAuth ? "/moje-konto" : "/logowanie"}>
                <img className="btn__img" src={loginIcon} alt="szukaj" />
            </a>
            <button className="mobileBar__btn" onClick={() => { openCart(); }}>
                <img className="btn__img" src={cartIcon} alt="szukaj" />
            </button>
        </menu>
    </>
};

export default Header;
