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

const Homepage = () => {
    const [fields, setFields] = useState([]);

    const getCustomField = (key) => {
        return fields.find((item) => {
            return item.custom_key === key;
        })?.custom_value;
    }

    useEffect(() => {
        getCustomFields()
            .then(res => {
                setFields(res?.data?.result);
            })
    }, []);

    return <div className="container w">
        <Header />
        <TopMenu />
        <Slider
            slider1={getCustomField('image1')}
            slider2={getCustomField('image2')}
            slider3={getCustomField('image3')} />
        <AfterSlider
            img1={getCustomField('image4')}
            img2={getCustomField('image5')} />
        <HomepageFirstRow />
        <HomepageInfoSection1 img={getCustomField('image6')} article={getCustomField('article1')} />
        <HomepageNewProducts />
        <HomepagePopular />
        <HomepageInfoSection2 img={getCustomField('image7')} article={getCustomField('article2')} />
        <AboutUs />
        <HomepageInfoSection3 img={getCustomField('image8')} article={getCustomField('article3')} />
        <Merits />
        <Newsletter />
        <Footer />
    </div>
};

export default Homepage;
