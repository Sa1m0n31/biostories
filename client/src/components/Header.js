import React from 'react';
import menuIcon from '../static/assets/nasz-sklep.png'
import loginIcon from '../static/assets/zaloguj-sie.png'
import cartIcon from '../static/assets/twoje-zakupy.png'
import logo from '../static/assets/logo.png'

const Header = () => {
    return <header className="siteHeader flex">
        <button className="siteHeader__menuBtn trans">
            <img className="btn__img" src={menuIcon} alt="menu" />
        </button>
        <a className="siteHeader__logoWrapper" href="#">
            <img className="btn__img" src={logo} alt="bio-stories" />
        </a>
        <section className="siteHeader__right flex">
            <a className="siteHeader__right__item" href="/zaloguj-sie">
                <img className="btn__img" src={loginIcon} alt="zaloguj-sie" />
            </a>
            <button className="siteHeader__right__item trans">
                <img className="btn__img" src={cartIcon} alt="zaloguj-sie" />
            </button>
        </section>
    </header>
};

export default Header;
