import React, {useEffect, useState} from 'react';
import img1 from '../static/assets/info2.png'
import arrowIcon from '../static/assets/arrow-right.svg'
import {stateToHTML} from "draft-js-export-html";
import {convertFromRaw} from "draft-js";
import settings from "../helpers/settings";

const HomepageInfoSection2 = ({img, article}) => {
    const [desc, setDesc] = useState('');

    useEffect(() => {
        if(article) setDesc(stateToHTML((convertFromRaw(JSON.parse(article)))));
    }, [article]);

    return <>
        <section className="infoSection infoSection--2 flex">
            <article className="infoSection__content">
                <main className="infoSection__content__main" dangerouslySetInnerHTML={{__html: desc}}>

                </main>
            </article>
            <figure className="infoSection__imgWrapper infoSection__imgWrapper--2">
                <img className="btn__img" src={`${settings.API_URL}/image?url=/media/fields/${img}`} alt="info" />
            </figure>
        </section>
        <a className="infoSection__btn infoSection__btn--100" href="/sklep">
            Sprawdź nasze wszystkie produkty
            <img className="arrowIcon" src={arrowIcon} alt="dalej" />
        </a>
    </>
};

export default HomepageInfoSection2;
