import React, {useEffect} from 'react';
import menuIcon from '../static/assets/nasz-sklep.png'
import loginIcon from '../static/assets/zaloguj-sie.png'
import cartIcon from '../static/assets/twoje-zakupy.png'
import logo from '../static/assets/logo.png'
import Cart from "./Cart";
import {openCart, openMenu} from "../helpers/others";
import Menu from "./Menu";

const Header = ({topSmall}) => {
    const changeTopStyle = () => {
        const y = window.pageYOffset;
        if(y > 5) {
            document.querySelector('.siteHeader__logoWrapper').style.transform = 'scale(.4)';
            document.querySelector('.siteHeader').style.height = '90px';
            document.querySelector('.siteHeader').style.paddingTop = '15px';
            document.querySelector('.siteHeader').style.alignItems = 'center';
        }
        else if(y < 5) {
            document.querySelector('.siteHeader__logoWrapper').style.transform = 'scale(1)';
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
            document.querySelector('.siteHeader__logoWrapper').style.transform = 'scale(.4)';
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
            <button className="siteHeader__menuBtn trans" onClick={() => { openMenu(); }}>
                <img className="btn__img" src={menuIcon} alt="menu" />
            </button>
            <a className="siteHeader__logoWrapper" href="/">
                <img className="btn__img" src={logo} alt="bio-stories" />
            </a>
            <section className="siteHeader__right flex">
                <a className="siteHeader__right__item" href="/logowanie">
                    <img className="btn__img" src={loginIcon} alt="zaloguj-sie" />
                </a>
                <button className="siteHeader__right__item trans" onClick={() => { openCart(); }}>
                    <img className="btn__img" src={cartIcon} alt="zaloguj-sie" />
                </button>
            </section>
        </header>
    </>
};

export default Header;
