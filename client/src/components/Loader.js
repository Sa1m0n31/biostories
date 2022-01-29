import React from 'react';
import logo from '../static/assets/logo.png'

const Loader = () => {
    return <div className="loader">
        <img className="loader__img" src={logo} alt="bio-stories" />
    </div>
};

export default Loader;
