import React, {useState, useEffect} from 'react'
import Header from "../components/Header";
import Footer from "../components/Footer";
import settings from "../helpers/settings";
import TopMenu from "../components/TopMenu";
import {stateToHTML} from "draft-js-export-html";
import {convertFromRaw} from "draft-js";

const Page = ({title, content, extra}) => {
    const [filename, setFilename] = useState("");
    const [text, setText] = useState('');

    useEffect(() => {
        if(title === "Zwroty") {
            setFilename("formularz-zwrotu-towaru.pdf");
        }
        else if(title === "Reklamacje") {
            setFilename("formularz-reklamacji-towaru.pdf");
        }
        else if(title === "Konkurs") {
            setFilename("regulamin-konkursu.pdf");
        }
    }, []);

    useEffect(() => {
        if(content) {
            setText(stateToHTML((convertFromRaw(JSON.parse(content)))));
        }
    }, [content]);

    return <div className="container">
        <Header topSmall={true} />
        <TopMenu />
        <main className="page page--terms">
            <h1 className="cart__header">
                {title}
            </h1>
            <main className="page__text">
                <article className="page__content" dangerouslySetInnerHTML={{__html: text}}>

                </article>
            </main>

            {extra ? <img className="paymentMethodsImg" src={extra} alt="metody-platnosci" /> : ""}
        </main>
        <Footer />
    </div>
}

export default Page;
