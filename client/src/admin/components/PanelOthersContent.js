import React, { useState, useEffect } from 'react'
import settings from "../helpers/settings";
import JoditEditor from "jodit-react";
import { useLocation } from "react-router";
import {getPagesContent, updatePages} from "../../helpers/pagesFunctions";
import {Editor} from "react-draft-wysiwyg";
import {convertFromRaw, EditorState} from "draft-js";

const PanelOthersContent = () => {
    const [terms, setTerms] = useState("");
    const [policy, setPolicy] = useState("");
    const [complaints, setComplaints] = useState("");
    const [returns, setReturns] = useState("");
    const [shippingAndPayment, setShippingAndPayment] = useState("");
    const [aboutUs, setAboutUs] = useState("");
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState(-1);

    const [addMsg, setAddMsg] = useState("");

    const location = useLocation();

    useEffect(() => {
            /* Get pages content */
            getPagesContent()
                .then(res => {
                    if(res.data.result) {
                        const result = res.data.result[0];
                        if(result) {
                            if(result.terms_of_service) setTerms(EditorState.createWithContent(convertFromRaw(JSON.parse(result.terms_of_service))));
                            if(result.privacy_policy) setPolicy(EditorState.createWithContent(convertFromRaw(JSON.parse(result.privacy_policy))));
                            if(result.returns) setReturns(EditorState.createWithContent(convertFromRaw(JSON.parse(result.returns))));
                            if(result.shipping_and_payment) setShippingAndPayment(EditorState.createWithContent(convertFromRaw(JSON.parse(result.shipping_and_payment))));
                        }
                    }
                })
        }, []);

    useEffect(() => {
        if(addMsg !== "") {
            setTimeout(() => {
                setAddMsg("");
            }, 3000);
        }
    }, [addMsg]);

    const handleSubmit = (e) => {
        e.preventDefault();
        updatePages(terms, policy, returns, shippingAndPayment)
            .then((res) => {
                if(res?.data?.result) {
                    setResponse("Treści zostały zaktualizowane");
                    setStatus(1);
                }
                else {
                    setResponse("Wystąpił błąd. Prosimy spróbować później");
                    setStatus(0);
                }
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
    }

    return <main className="panelContent">
        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Pozostałe
            </h1>
        </header>
        <section className="panelContent__frame">
            <h1 className="panelContent__frame__header">
                Edycja podstron
                {response ? <span className={status ? "response response--positive" : "response response--negative"}>
                        {response}
                    </span> : ""}
            </h1>

            {addMsg === "" ? <form className="panelContent__frame__form panelContent--others"
                                   onSubmit={(e) => { handleSubmit(e); }}
            >
                <main className="admin__editorWrapper">
                    Regulamin
                    <Editor
                        editorState={terms}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor"
                        onEditorStateChange={(text) => { setTerms(text); }}
                    />
                </main>

                <main className="admin__editorWrapper">
                    Polityka prywatności
                    <Editor
                        editorState={policy}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor"
                        onEditorStateChange={(text) => { setPolicy(text); }}
                    />
                </main>

                <main className="admin__editorWrapper">
                    Zwroty i płatności
                    <Editor
                        editorState={returns}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor"
                        onEditorStateChange={(text) => { setReturns(text); }}
                    />
                </main>

                <main className="admin__editorWrapper">
                    Dostawa
                    <Editor
                        editorState={shippingAndPayment}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor"
                        onEditorStateChange={(text) => { setShippingAndPayment(text); }}
                    />
                </main>

                <button className="addProduct__btn marginTop10" type="submit">
                    Aktualizuj treści podstron
                </button>
            </form> : <h1 className="addedMsgWrapper">
                {addMsg}
            </h1> }
        </section>
    </main>
}

export default PanelOthersContent;
