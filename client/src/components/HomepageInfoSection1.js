import React, {useEffect, useState} from 'react';
import img1 from '../static/assets/info1.png'
import arrowIcon from '../static/assets/arrow-right.svg'
import {stateToHTML} from "draft-js-export-html";
import {convertFromRaw} from "draft-js";
import settings from "../helpers/settings";
import {Player} from "video-react";

const HomepageInfoSection1 = ({img, video, mediaType, article}) => {
    const [desc, setDesc] = useState('');
    const [up, setUp] = useState(false);

    useEffect(() => {
        setUp(!up);
    }, [img, video, mediaType, article]);

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

    return <section className="infoSection flex">
        <div className="infoSection__imgWrapper">
            {mediaType === 'image' ? <img className="btn__img" src={`${settings.API_URL}/image?url=/media/fields/${img}`} alt="info" /> :
                <iframe src={video} controls="" autoplay={true} width={1000} height={500}>

                </iframe>
            }
        </div>
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
