import React, {useEffect, useState} from 'react';
import Header from "../components/Header";
import TopMenu from "../components/TopMenu";
import Slider from "../components/Slider";
import HomepageFirstRow from "../components/HomepageFirstRow";
import HomepageNewProducts from "../components/HomepageNewProducts";
import HomepagePopular from "../components/HomepagePopular";
import HomepageInfoSection1 from "../components/HomepageInfoSection1";
import HomepageInfoSection2 from "../components/HomepageInfoSection2";
import AboutUs from "../components/AboutUs";
import HomepageInfoSection3 from "../components/HomepageInfoSection3";
import Merits from "../components/Merits";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import {getCustomFields} from "../admin/helpers/settingsFunctions";
import AfterSlider from "../components/AfterSlider";
import settings from "../helpers/settings";

const Homepage = () => {
    const [fields, setFields] = useState([]);

    const getCustomField = (key) => {
        return fields.find((item) => {
            return item.custom_key === key;
        })?.custom_value;
    }

    useEffect(() => {
        setTimeout(() => {
            const s = new URLSearchParams(window.location.search).get('s');
            if(s) {
                document.querySelector(`#${s}`).scrollIntoView({
                    behavior: 'smooth',
                    top: 0
                });
            }
        }, 1000);

        getCustomFields()
            .then(res => {
                setFields(res?.data?.result);
            })
    }, []);

    return <div className="container w">
        <Header />
        <TopMenu homepage={true} />
        <Slider
            slider1={getCustomField('image1')}
            slider2={getCustomField('image2')}
            slider3={getCustomField('image3')}
            video1={`${settings.API_URL}/video/get?url=/media/videos/${getCustomField('video1')}`}
            video2={`${settings.API_URL}/video/get?url=/media/videos/${getCustomField('video2')}`}
            video3={`${settings.API_URL}/video/get?url=/media/videos/${getCustomField('video3')}`}
            mediaType1={getCustomField('mediaType1')}
            mediaType2={getCustomField('mediaType2')}
            mediaType3={getCustomField('mediaType3')}
            link1={getCustomField('link1')}
            link2={getCustomField('link2')}
            link3={getCustomField('link3')}
        />
        <AfterSlider
            img1={getCustomField('image4')}
            img2={getCustomField('image5')}
            video1={`${settings.API_URL}/video/get?url=/media/videos/${getCustomField('video4')}`}
            video2={`${settings.API_URL}/video/get?url=/media/videos/${getCustomField('video5')}`}
            mediaType1={getCustomField('mediaType4')}
            mediaType2={getCustomField('mediaType5')}
            link1={getCustomField('link4')}
            link2={getCustomField('link5')}
        />
        <HomepageFirstRow />
        <HomepageInfoSection1 img={getCustomField('image6')}
                              video={`${settings.API_URL}/video/get?url=/media/videos/${getCustomField('video6')}`}
                              mediaType={getCustomField('mediaType6')}
                              article={getCustomField('article1')} />
        <HomepageNewProducts />
        <HomepagePopular />
        <HomepageInfoSection2 img={getCustomField('image7')}
                              video={`${settings.API_URL}/video/get?url=/media/videos/${getCustomField('video7')}`}
                              mediaType={getCustomField('mediaType7')}
                              article={getCustomField('article2')} />
        <AboutUs />
        <HomepageInfoSection3 img={getCustomField('image8')}
                              video={`${settings.API_URL}/video/get?url=/media/videos/${getCustomField('video8')}`}
                              mediaType={getCustomField('mediaType8')}
                              article={getCustomField('article3')} />
        <Merits />
        <Newsletter />
        <Footer homepage={true} />
    </div>
};

export default Homepage;
