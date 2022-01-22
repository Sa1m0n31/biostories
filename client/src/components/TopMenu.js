import React from 'react';

const TopMenu = () => {
    const menu = [
        {
            name: 'Strona główna',
            link: '/'
        },
        {
            name: 'Sklep',
            link: '/sklep'
        },
        {
            name: 'Nowości',
            link: '/nowosci'
        },
        {
            name: 'Najczęściej wybierane',
            link: '/najczesciej-wybierane'
        },
        {
            name: 'O nas',
            link: '/o-nas'
        },

    ]

    return <menu className="topMenu center">
        <ul className="topMenu__list flex">
            {menu.map((item, index) => {
                return <li className="topMenu__list__item" key={index}>
                    <a className="topMenu__list__link" href={item.link}>
                        {item.name}
                    </a>
                </li>
            })}
        </ul>
    </menu>
};

export default TopMenu;
