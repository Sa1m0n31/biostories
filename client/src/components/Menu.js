import React, {useEffect, useState} from 'react';
import {closeCart, closeMenu} from "../helpers/others";
import closeIcon from "../static/img/close.png";
import {getAllCategories} from "../helpers/categoryFunctions";
import searchIcon from '../static/assets/search-icon.svg'
import {searchProducts} from "../helpers/productFunctions";
import convertToURL from "../helpers/convertToURL";
import settings from "../helpers/settings";

const Menu = () => {
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [searchResult, setSearchResult] = useState(null);
    const [start, setStart] = useState(true);

    useEffect(() => {
        getAllCategories()
            .then((res) => {
                setCategories(res?.data?.result);
            });
    }, []);

    useEffect(() => {
        if(categories) {
            const parents = categories.filter((item) => {
                return !item.parent_name;
            });
            let childrenArrays = [];
            parents.forEach((item) => {
                childrenArrays.push(categories.filter((itemChild) => {
                    return itemChild.parent_name === item.name;
                }));
            });
            setCategoryList(parents.map((item, index) => {
                return {
                    parent: item,
                    children: childrenArrays[index]
                }
            }));
        }
    }, [categories]);

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
            const searchWrapper = document.querySelector('.menu__search');
            const menuWrapper = document.querySelector('.menu__main');
            searchWrapper.style.opacity = '1';
            searchWrapper.style.height = 'auto';
            menuWrapper.style.opacity = '0';
        }
        else if(search === '') {
            const searchWrapper = document.querySelector('.menu__search');
            const menuWrapper = document.querySelector('.menu__main');
            searchWrapper.style.opacity = '0';
            searchWrapper.style.height = '0';
            if(!start) {
                menuWrapper.style.opacity = '1';
            }
            setStart(false);
        }
    }, [search, searchResult]);

    return <div className="menu">
        <div className="menu__top flex">
            <button className="cart__close cart__close--menu" onClick={() => { setSearch(''); setSearchResult(null); closeMenu(); }}>
                <img className="btn__img" src={closeIcon} alt="close"/>
            </button>
            <label className="d-desktop label--search">
                <input className="searchInput"
                       name="search"
                       value={search}
                       onChange={(e) => { setSearch(e.target.value); }}
                       placeholder="Wyszukaj produkt..." />
            </label>
        </div>
        <h2 className="page__header">
            BIO STORIES
        </h2>
        <main className="menu__main">
            {categoryList.map((mainItem, index) => {
                return <div className="menu__main__categoryBlock" key={index}>
                    <a className="menu__main__category" href={`/sklep/${mainItem.parent.permalink}`}>
                        {mainItem.parent.name}
                    </a>
                    {mainItem.children?.map((item, index) => {
                        return <ul key={index}>
                            <li>
                                <a className="menu__main__subcategory" href={`/sklep/${mainItem.parent.permalink}/${item.permalink}`}>
                                    {item.name}
                                </a>
                            </li>
                        </ul>
                    })}
                </div>
            })}
        </main>
        <section className="menu__search d-desktop">
            {searchResult ? searchResult.map((item, index) => {
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
            }) : ''}
        </section>
    </div>
};

export default Menu;
