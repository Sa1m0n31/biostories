import React from 'react';
import settings from "../helpers/settings";

const AfterSlider = ({img1, img2}) => {
    return <div className="afterSlider flex">
        <figure className="afterSlider__imgWrapper">
            <img className="btn__img" src={`${settings.API_URL}/image?url=/media/fields/${img1}`} alt="bio-stories" />
        </figure>
        <figure className="afterSlider__imgWrapper">
            <img className="btn__img" src={`${settings.API_URL}/image?url=/media/fields/${img2}`} alt="bio-stories" />
        </figure>
    </div>
};

export default AfterSlider;
