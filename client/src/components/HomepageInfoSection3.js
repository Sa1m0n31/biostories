import React, {useEffect, useState} from 'react';
import img1 from '../static/assets/igm3.png'
import arrowIcon from '../static/assets/arrow-right.svg'
import {stateToHTML} from "draft-js-export-html";
import {convertFromRaw} from "draft-js";
import settings from "../helpers/settings";

const HomepageInfoSection3 = ({img, article}) => {
    const [desc, setDesc] = useState('');

    useEffect(() => {
        if(article) setDesc(stateToHTML((convertFromRaw(JSON.parse(article)))));
    }, [article]);

    return <>
        <section className="infoSection infoSection--3 flex">
            <span className="anchor" id="o-nas"></span>
            <figure className="infoSection__imgWrapper infoSection__imgWrapper--3" data-aos-offset="1600" data-aos="fade-right">
                <img className="btn__img" src={`${settings.API_URL}/image?url=/media/fields/${img}`} alt="info" />
            </figure>
            <article className="infoSection__content" data-aos="fade-left" data-aos-offset="1600">
                <main className="infoSection__content__main" dangerouslySetInnerHTML={{__html: desc}}>

                </main>
            </article>
        </section>
    </>
};

export default HomepageInfoSection3;
