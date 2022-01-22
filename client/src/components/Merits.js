import React from 'react';
import icon1 from '../static/assets/search.svg'
import icon2 from '../static/assets/search.svg'
import icon3 from '../static/assets/fast-delivery.svg'
import icon4 from '../static/assets/safe.svg'
import icon5 from '../static/assets/communicate.svg'

const Merits = () => {
    const merits = [
        {
            title: 'Najwyższa jakość',
            subtitle: 'Najpierw #czytamyskład, później wprowadzamy do oferty',
            icon: icon1
        },
        {
            title: 'Dbamy o planetę',
            subtitle: 'Opakowania maksymalnie przyjazne środowisku',
            icon: icon2
        },
        {
            title: 'Ekspresowa wysyłka',
            subtitle: 'Zamówienia wysyłamy w następnym dniu roboczym',
            icon: icon3
        },
        {
            title: 'Bezpieczne płatności',
            subtitle: 'Przelewy 24, BLIK, przelew tradycyjny, płatność za pobraniem',
            icon: icon4
        },
        {
            title: 'Łatwy kontakt',
            subtitle: 'Masz pytanie? Napisz bądź zadzwoń - pomożemy!',
            icon: icon5
        },
    ]

    return <aside className="merits flex">
        {merits.map((item, index) => {
            return <section className="merits__item center">
                <img className="merits__icon" src={item.icon} alt={item.title} />
                <h4 className="merits__header">
                    {item.title}
                </h4>
                <p className="merits__text">
                    {item.subtitle}
                </p>
            </section>
        })}
    </aside>
};

export default Merits;
