import React from 'react';
import settings from "../helpers/settings";

const AfterSlider = ({img1, img2, video1, video2, mediaType1, mediaType2, link1, link2}) => {
    return <div className="afterSlider flex">
        <a className="afterSlider__imgWrapper" href={link1}>
            {mediaType1 === 'image' ? <img className="btn__img" src={`${settings.API_URL}/image?url=/media/fields/${img1}`} alt="bio-stories" />
            : <video src={video1} controls={false} autoPlay={true} muted={true}>

                </video>}
        </a>
        <a className="afterSlider__imgWrapper" href={link2}>
            {mediaType2 === 'image' ? <img className="btn__img" src={`${settings.API_URL}/image?url=/media/fields/${img2}`} alt="bio-stories" />
                : <video src={video2} controls={false} autoPlay={true} muted={true}>

                </video>}
        </a>
    </div>
};

export default AfterSlider;
