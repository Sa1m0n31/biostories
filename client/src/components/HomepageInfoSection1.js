import React, {useEffect, useState} from 'react';
import img1 from '../static/assets/info1.png'
import arrowIcon from '../static/assets/arrow-right.svg'
import {stateToHTML} from "draft-js-export-html";
import {convertFromRaw} from "draft-js";
import settings from "../helpers/settings";

const HomepageInfoSection1 = ({img, article}) => {
    const [desc, setDesc] = useState('');

    useEffect(() => {
        if(window.innerWidth < 1200) {
            Array.from(document.querySelectorAll('.infoSection>*')).forEach((item) => {
                item.removeAttribute('data-aos');
            });
        }
        else {
            window.addEventListener('resize', (event) => {
                if(window.innerWidth < 1200) {
                    Array.from(document.querySelectorAll('.infoSection>*')).forEach((item) => {
                        item.removeAttribute('data-aos');
                    });
                }
            });
        }
    }, []);

    useEffect(() => {
        if(article) setDesc(stateToHTML((convertFromRaw(JSON.parse(article)))));
    }, [article]);

    return <section className="infoSection flex">
        <figure className="infoSection__imgWrapper" data-aos="fade-right">
            <img className="btn__img" src={`${settings.API_URL}/image?url=/media/fields/${img}`} alt="info" />
        </figure>
        <article className="infoSection__content" data-aos="fade-left" data-aos-offset="500">
            <main className="infoSection__content__main" dangerouslySetInnerHTML={{__html: desc}}>

            </main>
            <a className="infoSection__btn mt-4" href="/sklep">
                Sprawdź nasze wszystkie produkty
                <img className="arrowIcon" src={arrowIcon} alt="dalej" />
            </a>
        </article>
    </section>
};

export default HomepageInfoSection1;
