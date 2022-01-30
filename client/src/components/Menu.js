import React, {useEffect, useState} from 'react';
import {closeCart, closeMenu} from "../helpers/others";
import closeIcon from "../static/img/close.png";
import {getAllCategories} from "../helpers/categoryFunctions";

const Menu = () => {
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

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

    return <div className="menu">
        <div className="menu__top flex">
            <button className="cart__close cart__close--menu" onClick={() => { closeMenu(); }}>
                <img className="btn__img" src={closeIcon} alt="close"/>
            </button>
            <label className="d-desktop">
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
    </div>
};

export default Menu;
