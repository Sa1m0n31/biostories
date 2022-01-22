import React from 'react';
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

const Homepage = () => {
    return <div className="container w">
        <Header />
        <TopMenu />
        <Slider />
        <HomepageFirstRow />
        <HomepageInfoSection1 />
        <HomepageNewProducts />
        <HomepagePopular />
        <HomepageInfoSection2 />
        <AboutUs />
        <HomepageInfoSection3 />
        <Merits />
        <Newsletter />
        <Footer />
    </div>
};

export default Homepage;
