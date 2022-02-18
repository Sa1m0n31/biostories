import React, {useEffect, useState} from 'react';
import img1 from '../static/assets/igm3.png'
import arrowIcon from '../static/assets/arrow-right.svg'
import {stateToHTML} from "draft-js-export-html";
import {convertFromRaw} from "draft-js";
import settings from "../helpers/settings";

const HomepageInfoSection3 = ({img, video, mediaType, article}) => {
    const [desc, setDesc] = useState('');

    useEffect(() => {
        let options = {
            entityStyleFn: (entity) => {
                const entityType = entity.get('type');
                if (entityType === "EMBEDDED_LINK") {
                    const data = entity.getData();
                    return {
                        element: 'iframe',
                        attributes: {
                            width: 500,
                            height: 250,
                            src: data.src,
                        },
                    };
                }
                return null;
            }
        }
        if(article) setDesc(stateToHTML((convertFromRaw(JSON.parse(article))), options));
    }, [article]);

    return <>
        <section className="infoSection infoSection--3 flex">
            <span className="anchor" id="o-nas"></span>
            <div className="infoSection__imgWrapper infoSection__imgWrapper--3" data-aos-offset="1600" data-aos="fade-right">
                {mediaType === 'image' ? <img className="btn__img" src={`${settings.API_URL}/image?url=/media/fields/${img}`} alt="info" /> :
                    <iframe src={video} controls="" autoplay={true}>

                    </iframe>
                }
            </div>
            <article className="infoSection__content" data-aos="fade-left" data-aos-offset="1600">
                <main className="infoSection__content__main" dangerouslySetInnerHTML={{__html: desc}}>

                </main>
            </article>
        </section>
    </>
};

export default HomepageInfoSection3;
