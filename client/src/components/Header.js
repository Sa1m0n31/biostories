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
import searchIcon from '../static/assets/search-icon.svg'
import convertToURL from "../helpers/convertToURL";
import settings from "../helpers/settings";
import {searchProducts} from "../helpers/productFunctions";

const Header = ({topSmall, restricted}) => {
    const [isAuth, setIsAuth] = useState(false);
    const [render, setRender] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        auth()
            .then((res) => {
                setRender(true);
                setIsAuth(res?.data?.result === 1);
                if(!res?.data?.result && restricted) window.location = '/';
            });
    }, []);

    const showSearch = () => {
        const searchMobile = document.querySelector('.searchMobile');
        const searchResultsElement = document.querySelector('.menu__search--mobile')
        searchMobile.style.opacity = '1';
        searchMobile.style.zIndex = '2';
        searchResultsElement.style.zIndex = '3';
        searchResultsElement.style.visibility = 'visible';
        searchMobile.focus();
    }

    const hideSearch = () => {
        const searchMobile = document.querySelector('.searchMobile');
        const searchResultsElement = document.querySelector('.menu__search--mobile');
        searchMobile.style.opacity = '0';
        searchMobile.style.zIndex = '-1';
        searchResultsElement.style.zIndex = '-2';
        searchResultsElement.style.visibility = 'hidden';
    }

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

    useEffect(() => {
        if(search) {
            searchProducts(search)
                .then((res) => {
                    setSearchResult(res?.data?.result);
                });
        }
    }, [search]);

    useEffect(() => {
        if(searchResult !== null && search !== '') {
            const searchWrapper = document.querySelector('.menu__search--mobile');
            searchWrapper.style.opacity = '1';
            searchWrapper.style.height = '150px';
            searchWrapper.style.zIndex = '10';
        }
        else if(search === '') {
            const searchWrapper = document.querySelector('.menu__search--mobile');
            searchWrapper.style.opacity = '0';
            searchWrapper.style.height = '0';
            searchWrapper.style.zIndex = '-2';
        }
    }, [search, searchResult]);

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
            <button className="mobileBar__btn" onClick={() => { showSearch(); }}>
                <img className="btn__img" src={searchIcon} alt="szukaj" />
            </button>
            <a className="mobileBar__btn" href={isAuth ? "/moje-konto" : "/logowanie"}>
                <img className="btn__img" src={loginIcon} alt="szukaj" />
            </a>
            <button className="mobileBar__btn" onClick={() => { openCart(); }}>
                <img className="btn__img" src={cartIcon} alt="szukaj" />
            </button>
            <label className="searchMobile">
                <input className="searchInput"
                       name="search"
                       value={search}
                       onBlur={() => { hideSearch(); }}
                       onChange={(e) => { setSearch(e.target.value); }}
                       placeholder="Wyszukaj produkt..." />
            </label>
        </menu>
        <section className="menu__search d-mobile menu__search--mobile">
            {searchResult?.length ? searchResult.map((item, index) => {
                return <a className="searchResult" href={`/produkt/${convertToURL(item.name)}`}>
                    <div className="cart__item__firstCol flex">
                        <figure className="cart__item__imgWrapper">
                            <img className="cart__item__img" src={`${settings.API_URL}/image?url=/media/products/${item.main_image}`} alt={item.title} />
                        </figure>
                        <h4 className="cart__item__title">
                            {item.name}
                        </h4>
                        <h5 className="search__price">
                            {item.price} zł
                        </h5>
                    </div>
                </a>
            }) : <h4 className="noProducts">
                Brak produktów spełniających kryteria wyszukiwania
            </h4>}
        </section>
    </>
};

export default Header;
