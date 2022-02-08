import React from 'react';
import instaIcon from '../static/assets/instagram.svg'
import fbIcon from '../static/assets/facebook.svg'

const TopMenu = ({homepage}) => {
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
            link: '/sklep/nowosci'
        },
        {
            name: 'Najczęściej wybierane',
            link: '/sklep/najczesciej-wybierane'
        },
        {
            name: 'O nas',
            link: homepage ? '#o-nas' : '/?s=o-nas'
        }
    ]

    return <menu className="topMenu d-desktop center">
        <ul className="topMenu__list flex">
            {menu.map((item, index) => {
                return <li className="topMenu__list__item" key={index}>
                    <a className="topMenu__list__link" href={item.link}>
                        {item.name}
                    </a>
                </li>
            })}
            <li className="topMenu__list__item">
                <a className="topMenu__list__link" href="https://www.instagram.com/bio_stories/" target="_blank">
                    <img className="topMenu__icon" src={instaIcon} alt="instagram" />
                </a>
            </li>
            <li className="topMenu__list__item">
                <a className="topMenu__list__link" href='https://www.facebook.com/biostories' target="_blank">
                    <img className="topMenu__icon" src={fbIcon} alt="facebook" />
                </a>
            </li>
        </ul>
    </menu>
};

export default TopMenu;
