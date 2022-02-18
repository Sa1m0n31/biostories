import React, {useEffect, useRef, useState} from 'react';
import ReactSiema from 'react-siema';
import example from '../static/assets/landing.png'
import arrowIcon from '../static/img/arrow-white.svg'
import settings from "../admin/helpers/settings";
import Loader from "./Loader";

const Slider = ({slider1, slider2, slider3, video1, video2, video3, mediaType1, mediaType2, mediaType3, link1, link2, link3}) => {
    let slider = useRef({currentSlide: 0});

    const [slide, setSlide] = useState(0);

    const sliderInterval = (slider) => {
        // setInterval(() => {
        //     if(slider) {
        //         slider.next();
        //         setSlide(slider.currentSlide);
        //     }
        // }, 5000);
    }

    const nextSlide = () => {
        slider.next();
        setSlide(slider.currentSlide);
    }

    const prevSlide = () => {
        slider.prev();
        setSlide(slider.currentSlide);
    }

    return <div className="slider">
        <button className="hero__btn hero__btn--prev" onClick={() => { prevSlide(); }}>
            <img className="hero__btn__img" src={arrowIcon} alt="poprzedni" />
        </button>
        {slider1 || video1 ? <ReactSiema perPage={1}
                               ref={siema => { slider = siema; }}
                               loop={true}
        >
            <a className="banner" href={link1}>
                {mediaType1 === 'image' ?
                    <img onLoad={() => { sliderInterval(slider); }} className="banner__img" src={`${settings.API_URL}/image?url=/media/fields/${slider1}`} alt="baner" /> :
                    <video src={video1} controls={false} autoPlay={true} muted={true}>

                    </video>
                }
            </a>
            <a className="banner" href={link2}>
                {mediaType2 === 'image' ?
                    <img className="banner__img" src={`${settings.API_URL}/image?url=/media/fields/${slider2}`} alt="baner" />
                    : <video src={video2} controls={false} autoPlay={true} muted={true}>

                    </video>
                }
            </a>
            <a className="banner" href={link3}>
                {mediaType3 === 'image' ?
                    <img className="banner__img" src={`${settings.API_URL}/image?url=/media/fields/${slider3}`} alt="baner" /> :
                    <video src={video3} controls={false} autoPlay={true} muted={true}>

                    </video>
                }
            </a>
        </ReactSiema> : <Loader />}
        <button className="hero__btn hero__btn--next" onClick={() => { nextSlide(); }}>
            <img className="hero__btn__img" src={arrowIcon} alt="nastepny" />
        </button>
    </div>
};

export default Slider;
