import React, {useEffect, useRef, useState} from 'react';
import ReactSiema from 'react-siema';
import example from '../static/assets/landing.png'
import arrowIcon from '../static/img/arrow-white.svg'
import settings from "../admin/helpers/settings";
import Loader from "./Loader";

const Slider = ({slider1, slider2, slider3}) => {
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
        {slider1 ? <ReactSiema perPage={1}
                               ref={siema => { slider = siema; }}
                               loop={true}
        >
            <div className="banner">
                <img onLoad={() => { sliderInterval(slider); }} className="banner__img" src={`${settings.API_URL}/image?url=/media/fields/${slider1}`} alt="baner" />
            </div>
            <div className="banner">
                <img className="banner__img" src={`${settings.API_URL}/image?url=/media/fields/${slider2}`} alt="baner" />
            </div>
            <div className="banner">
                <img className="banner__img" src={`${settings.API_URL}/image?url=/media/fields/${slider3}`} alt="baner" />
            </div>
        </ReactSiema> : <Loader />}
        <button className="hero__btn hero__btn--next" onClick={() => { nextSlide(); }}>
            <img className="hero__btn__img" src={arrowIcon} alt="nastepny" />
        </button>
    </div>
};

export default Slider;
