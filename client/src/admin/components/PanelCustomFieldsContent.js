import React, {useEffect, useState} from 'react';
import {getCustomFields, updateCustomFields} from "../helpers/settingsFunctions";
import {useLocation} from "react-router";
import {getAllCategories} from "../helpers/categoriesFunctions";
import {getProductCategories, getProductDetails} from "../helpers/productFunctions";
import {convertFromRaw, EditorState} from "draft-js";
import settings from "../helpers/settings";
import trashIcon from "../static/img/trash-can.svg";
import Dropzone from "react-dropzone-uploader";
import {Editor} from "react-draft-wysiwyg";

const PanelCustomFieldsContent = () => {
    const [customFields, setCustomFields] = useState([]);
    const [choosenCategories, setChoosenCategories] = useState([]);
    const [response, setResponse] = useState("");
    const [status, setStatus] = useState(-1);
    const [updateMode, setUpdateMode] = useState(true);

    const [updateImage, setUpdateImage] = useState(false);
    const [img, setImg] = useState(false);
    const [imageUpdated, setImageUpdated] = useState(false);
    const [updateImage2, setUpdateImage2] = useState(false);
    const [img2, setImg2] = useState(false);
    const [imageUpdated2, setImageUpdated2] = useState(false);
    const [updateImage3, setUpdateImage3] = useState(false);
    const [img3, setImg3] = useState(false);
    const [imageUpdated3, setImageUpdated3] = useState(false);
    const [updateImage4, setUpdateImage4] = useState(false);
    const [img4, setImg4] = useState(false);
    const [imageUpdated4, setImageUpdated4] = useState(false);
    const [updateImage5, setUpdateImage5] = useState(false);
    const [img5, setImg5] = useState(false);
    const [imageUpdated5, setImageUpdated5] = useState(false);
    const [updateImage6, setUpdateImage6] = useState(false);
    const [img6, setImg6] = useState(false);
    const [imageUpdated6, setImageUpdated6] = useState(false);
    const [updateImage7, setUpdateImage7] = useState(false);
    const [img7, setImg7] = useState(false);
    const [imageUpdated7, setImageUpdated7] = useState(false);
    const [updateImage8, setUpdateImage8] = useState(false);
    const [img8, setImg8] = useState(false);
    const [imageUpdated8, setImageUpdated8] = useState(false);

    const [description1, setDescription1] = useState(null);
    const [description2, setDescription2] = useState(null);
    const [description3, setDescription3] = useState(null);

    const [link1, setLink1] = useState("");
    const [link2, setLink2] = useState("");
    const [link3, setLink3] = useState("");
    const [link4, setLink4] = useState("");
    const [link5, setLink5] = useState("");

    // 0 - image, 1 - video
    const [media1Type, setMedia1Type] = useState(0);
    const [media2Type, setMedia2Type] = useState(0);
    const [media3Type, setMedia3Type] = useState(0);

    const getCustomField = (key) => {
        return customFields.find((item) => {
            return item.custom_key === key;
        })?.custom_value;
    }

    useEffect(() => {
        getCustomFields()
            .then((res) => {
                setCustomFields(res?.data?.result);
            });
    }, []);

    useEffect(() => {
        if(customFields?.length) {
            setUpdateImage(getCustomField('image1'));
            setUpdateImage2(getCustomField('image2'));
            setUpdateImage3(getCustomField('image3'));
            setUpdateImage4(getCustomField('image4'));
            setUpdateImage5(getCustomField('image5'));
            setUpdateImage6(getCustomField('image6'));
            setUpdateImage7(getCustomField('image7'));
            setUpdateImage8(getCustomField('image8'));

            setLink1(getCustomField('link1'));
            setLink2(getCustomField('link2'));
            setLink3(getCustomField('link3'));

            setDescription1(EditorState.createWithContent(convertFromRaw(JSON.parse(getCustomField('article1')))));
            setDescription2(EditorState.createWithContent(convertFromRaw(JSON.parse(getCustomField('article2')))));
            setDescription3(EditorState.createWithContent(convertFromRaw(JSON.parse(getCustomField('article3')))));
        }
    }, [customFields]);

    const isInArray = (categoryId) => {
        return choosenCategories.filter(item => {
            return item.id === categoryId;
        }).length > 0;
    }

    const getUploadImage = (img) => {
        console.log(img);
    }

    const handleChangeStatus = (status) => {
        if(updateMode) {
            setImageUpdated(true);
            setUpdateImage(null);
        }
        setImg(status);
    }

    const deleteImg = () => {
        if(img) {
            img.remove();
            setImg(null);
        }
        if(updateImage) {
            setUpdateImage(null);
        }
        setImageUpdated(true);
    }

    const getUploadImage2 = (img) => {
        console.log(img);
    }

    const handleChangeStatus2 = (status) => {
        if(updateMode) {
            setImageUpdated2(true);
            setUpdateImage2(null);
        }
        setImg2(status);
    }

    const deleteImg2 = () => {
        if(img2) {
            img2.remove();
            setImg2(null);
        }
        if(updateImage2) {
            setUpdateImage2(null);
        }
        setImageUpdated2(true);
    }

    const getUploadImage3 = (img) => {
        console.log(img);
    }

    const handleChangeStatus3 = (status) => {
        if(updateMode) {
            setImageUpdated3(true);
            setUpdateImage3(null);
        }
        setImg3(status);
    }

    const deleteImg3 = () => {
        if(img3) {
            img3.remove();
            setImg3(null);
        }
        if(updateImage3) {
            setUpdateImage3(null);
        }
        setImageUpdated3(true);
    }

    const getUploadImage4 = (img) => {
        console.log(img);
    }

    const handleChangeStatus4 = (status) => {
        if(updateMode) {
            setImageUpdated4(true);
            setUpdateImage4(null);
        }
        setImg4(status);
    }

    const deleteImg4 = () => {
        if(img4) {
            img4.remove();
            setImg4(null);
        }
        if(updateImage4) {
            setUpdateImage4(null);
        }
        setImageUpdated4(true);
    }

    const getUploadImage5 = (img) => {
        console.log(img);
    }

    const handleChangeStatus5 = (status) => {
        if(updateMode) {
            setImageUpdated5(true);
            setUpdateImage5(null);
        }
        setImg5(status);
    }

    const deleteImg5 = () => {
        if(img5) {
            img5.remove();
            setImg5(null);
        }
        if(updateImage5) {
            setUpdateImage5(null);
        }
        setImageUpdated5(true);
    }

    const getUploadImage6 = (img) => {
        console.log(img);
    }

    const handleChangeStatus6 = (status) => {
        if(updateMode) {
            setImageUpdated6(true);
            setUpdateImage6(null);
        }
        setImg6(status);
    }

    const deleteImg6 = () => {
        if(img6) {
            img6.remove();
            setImg6(null);
        }
        if(updateImage6) {
            setUpdateImage6(null);
        }
        setImageUpdated6(true);
    }

    const getUploadImage7 = (img) => {
        console.log(img);
    }

    const handleChangeStatus7 = (status) => {
        if(updateMode) {
            setImageUpdated7(true);
            setUpdateImage7(null);
        }
        setImg7(status);
    }

    const deleteImg7 = () => {
        if(img7) {
            img7.remove();
            setImg7(null);
        }
        if(updateImage7) {
            setUpdateImage7(null);
        }
        setImageUpdated7(true);
    }

    const getUploadImage8 = (img) => {
        console.log(img);
    }

    const handleChangeStatus8 = (status) => {
        if(updateMode) {
            setImageUpdated8(true);
            setUpdateImage8(null);
        }
        setImg8(status);
    }

    const deleteImg8 = () => {
        if(img8) {
            img8.remove();
            setImg8(null);
        }
        if(updateImage8) {
            setUpdateImage8(null);
        }
        setImageUpdated8(true);
    }

    useEffect(() => {
        getCustomFields()
            .then((res) => {
                setCustomFields(res?.data?.result);
            });
    }, []);

    const handleSubmit = () => {
        updateCustomFields(img, img2, img3, img4, img5, img6, img7, img8,
            description1, description2, description3, link1, link2, link3, link4, link5,
            media1Type, media2Type, media3Type)
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

    return <main className="panelContent panelContent--customFields">
        <main className="panelContent__frame">
            <h1 className="panelContent__frame__header">
                Edytuj treść
                {response ? <span className={status ? "response response--positive" : "response response--negative"}>
                        {response}
                    </span> : ""}
            </h1>
            <div className="flex mt-4">
                <div>
                    <label className="admin__label admin__flex admin__label--imgUpload">
                        Pierwsze zdjęcie w górnym sliderze
                        <span className="admin__label__imgUpload">
                            {updateImage ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/fields/${updateImage}`} alt="foto" />
                            </figure> : ""}
                            {img || updateImage ? <button className="admin__label__imgUpload__trashBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImg(); }}>
                                <img className="btn__img" src={trashIcon} alt="usun" />
                            </button> : ""}
                            <Dropzone
                                canRemove={true}
                                getUploadParams={getUploadImage}
                                onChangeStatus={(status) => { handleChangeStatus(status); }}
                                accept="image/*"
                                maxFiles={1} />
                        </span>
                    </label>
                    <label>
                        <input className="addProduct__input"
                               name="link1"
                               value={link1}
                               onChange={(e) => { setLink1(e.target.value) }}
                               placeholder="Link do pierwszego zdjęcia" />
                    </label>
                </div>
                <div>
                    <label className="admin__label admin__flex admin__label--imgUpload">
                        Drugie zdjęcie w górnym sliderze
                        <span className="admin__label__imgUpload">
                            {updateImage2 ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/fields/${updateImage2}`} alt="foto" />
                            </figure> : ""}
                            {img2 || updateImage2 ? <button className="admin__label__imgUpload__trashBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImg2(); }}>
                                <img className="btn__img" src={trashIcon} alt="usun" />
                            </button> : ""}
                            <Dropzone
                                canRemove={true}
                                getUploadParams={getUploadImage2}
                                onChangeStatus={(status) => { handleChangeStatus2(status); }}
                                accept="image/*"
                                maxFiles={1} />
                        </span>
                    </label>
                    <label>
                        <input className="addProduct__input"
                               name="link2"
                               value={link2}
                               onChange={(e) => { setLink2(e.target.value) }}
                               placeholder="Link do drugiego zdjęcia" />
                    </label>
                </div>
                <div>
                    <label className="admin__label admin__flex admin__label--imgUpload">
                        Trzecie zdjęcie w górnym sliderze
                        <span className="admin__label__imgUpload">
                            {updateImage3 ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/fields/${updateImage3}`} alt="foto" />
                            </figure> : ""}
                            {img3 || updateImage3 ? <button className="admin__label__imgUpload__trashBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImg3(); }}>
                                <img className="btn__img" src={trashIcon} alt="usun" />
                            </button> : ""}
                            <Dropzone
                                canRemove={true}
                                getUploadParams={getUploadImage3}
                                onChangeStatus={(status) => { handleChangeStatus3(status); }}
                                accept="image/*"
                                maxFiles={1} />
                        </span>
                    </label>
                    <label>
                        <input className="addProduct__input"
                               name="link3"
                               value={link3}
                               onChange={(e) => { setLink3(e.target.value) }}
                               placeholder="Link do trzeciego zdjęcia" />
                    </label>
                </div>
            </div>
            <div className="flex alignTop twoImages">
                <div>
                    <label className="admin__label admin__flex admin__label--imgUpload admin__label--imgUpload--section">
                        Zdjęcie po lewej stronie
                        <span className="admin__label__imgUpload">
                            {updateImage4 ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/fields/${updateImage4}`} alt="foto" />
                            </figure> : ""}
                            {img4 || updateImage4 ? <button className="admin__label__imgUpload__trashBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImg4(); }}>
                                <img className="btn__img" src={trashIcon} alt="usun" />
                            </button> : ""}
                            <Dropzone
                                canRemove={true}
                                getUploadParams={getUploadImage4}
                                onChangeStatus={(status) => { handleChangeStatus4(status); }}
                                accept="image/*"
                                maxFiles={1} />
                        </span>
                    </label>
                    <label>
                        <input className="addProduct__input mt"
                               name="link4"
                               value={link4}
                               onChange={(e) => { setLink4(e.target.value) }}
                               placeholder="Link do czwartego zdjęcia" />
                    </label>
                </div>
                <div>
                    <label className="admin__label admin__flex admin__label--imgUpload admin__label--imgUpload--section">
                        Zdjęcie po prawej stronie
                        <span className="admin__label__imgUpload">
                            {updateImage5 ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/fields/${updateImage5}`} alt="foto" />
                            </figure> : ""}
                            {img5 || updateImage5 ? <button className="admin__label__imgUpload__trashBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImg5(); }}>
                                <img className="btn__img" src={trashIcon} alt="usun" />
                            </button> : ""}
                            <Dropzone
                                canRemove={true}
                                getUploadParams={getUploadImage5}
                                onChangeStatus={(status) => { handleChangeStatus5(status); }}
                                accept="image/*"
                                maxFiles={1} />
                        </span>
                    </label>
                    <label>
                        <input className="addProduct__input mt"
                               name="link5"
                               value={link5}
                               onChange={(e) => { setLink5(e.target.value) }}
                               placeholder="Link do piątego zdjęcia" />
                    </label>
                </div>
            </div>
            <div className="flex alignTop mt-4">
                <label className="admin__label admin__flex admin__label--imgUpload admin__label--imgUpload--section">
                    Zdjęcie do artykułu 1.
                    <span className="admin__label__imgUpload">
                            {updateImage6 ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/fields/${updateImage6}`} alt="foto" />
                            </figure> : ""}
                        {img6 || updateImage6 ? <button className="admin__label__imgUpload__trashBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImg7(); }}>
                            <img className="btn__img" src={trashIcon} alt="usun" />
                        </button> : ""}
                        <Dropzone
                            canRemove={true}
                            getUploadParams={getUploadImage6}
                            onChangeStatus={(status) => { handleChangeStatus6(status); }}
                            accept="image/*"
                            maxFiles={1} />
                        </span>
                </label>
                <main className="admin__editorWrapper">
                    Artykuł 1.
                    <Editor
                        editorState={description1}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor"
                        onEditorStateChange={(text) => { setDescription1(text); }}
                    />
                </main>
            </div>
            <div className="flex alignTop mt-4">
                <label className="admin__label admin__flex admin__label--imgUpload admin__label--imgUpload--section">
                    Zdjęcie do artykułu 2.
                    <span className="admin__label__imgUpload">
                            {updateImage7 ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/fields/${updateImage7}`} alt="foto" />
                            </figure> : ""}
                        {img7 || updateImage7 ? <button className="admin__label__imgUpload__trashBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImg7(); }}>
                            <img className="btn__img" src={trashIcon} alt="usun" />
                        </button> : ""}
                        <Dropzone
                            canRemove={true}
                            getUploadParams={getUploadImage7}
                            onChangeStatus={(status) => { handleChangeStatus7(status); }}
                            accept="image/*"
                            maxFiles={1} />
                        </span>
                </label>
                <main className="admin__editorWrapper">
                    Artykuł 2.
                    <Editor
                        editorState={description2}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor"
                        onEditorStateChange={(text) => { setDescription2(text); }}
                    />
                </main>
            </div>
            <div className="flex alignTop mt-4">
                <label className="admin__label admin__flex admin__label--imgUpload admin__label--imgUpload--section">
                    Zdjęcie do artykułu 3.
                    <span className="admin__label__imgUpload">
                            {updateImage5 ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/fields/${updateImage8}`} alt="foto" />
                            </figure> : ""}
                        {img8 || updateImage8 ? <button className="admin__label__imgUpload__trashBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImg8(); }}>
                            <img className="btn__img" src={trashIcon} alt="usun" />
                        </button> : ""}
                        <Dropzone
                            canRemove={true}
                            getUploadParams={getUploadImage8}
                            onChangeStatus={(status) => { handleChangeStatus8(status); }}
                            accept="image/*"
                            maxFiles={1} />
                        </span>
                </label>
                <main className="admin__editorWrapper">
                    Artykuł 3.
                    <Editor
                        editorState={description3}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor"
                        onEditorStateChange={(text) => { setDescription3(text); }}
                    />
                </main>
            </div>
            <section className="addProduct__btnWrapper">
                <button className="addProduct__btn" onClick={() => { handleSubmit(); }}>
                    Zaktualizuj treść
                </button>
            </section>
        </main>
    </main>
};

export default PanelCustomFieldsContent;
