import React, { useEffect, useState, useRef } from 'react'

import {
    addAllergens,
    getNewId,
    getProductCategories,
    getProductDetails,
    getProductGallery
} from "../helpers/productFunctions";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useLocation } from "react-router";
import {getAllCategories} from "../helpers/categoriesFunctions";
import Dropzone from "react-dropzone-uploader";
import settings from "../helpers/settings";
import axios from "axios";
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import {logoutUser} from "../../helpers/userFunctions";
import RUG from 'react-upload-gallery'
import 'react-upload-gallery/dist/style.css'
import trashIcon from '../static/img/trash-can.svg'
import {addProduct} from "../../helpers/productFunctions";

const AddProductContent = () => {
    const [update, setUpdate] = useState(false);
    const [name, setName] = useState("");
    const [subtitle, setSubtitle] = useState('');
    const [stock, setStock] = useState(0);
    const [id, setId] = useState(0);
    const [product, setProduct] = useState([]);
    const [categories, setCategories] = useState([]);
    const [hidden, setHidden] = useState(false);
    const [recommendation, setRecommendation] = useState(false);
    const [choosenCategories, setChoosenCategories] = useState([]);
    const [response, setResponse] = useState("");
    const [status, setStatus] = useState(-1);
    const [attribute, setAttribute] = useState('');
    const [attributeValues, setAttributeValues] = useState('');
    const [updateMode, setUpdateMode] = useState(false);
    const [top, setTop] = useState(false);

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

    const [description2, setDescription2] = useState(null);
    const [description3, setDescription3] = useState(null);
    const [description4, setDescription4] = useState(null);

    const [gallery, setGallery] = useState([]);
    const [infoIcons, setInfoIcons] = useState([]);

    const [imagesChanged, setImagesChanged] = useState([false, false, false, false, false]);

    /* Prices */
    const [price, setPrice] = useState(0);

    /* Descriptions */
    const [shortDescription, setShortDescription] = useState(null);

    const [addMsg, setAddMsg] = useState("");

    const location = useLocation();

    /* Initialize categories */
    const initializeCategories = (categoryList) => {
        setChoosenCategories(categoryList.map(item => {
           return {
               id: item.category_id,
               selected: true
           }
        }));
    }

    useEffect(() => {
        /* PRODUCT ADDED */
        const added = parseInt(new URLSearchParams(location.search).get("add"));
        if(added) {
            if(added === 1) {
                setAddMsg("Produkt został dodany");
                /* Add allergens */
                addAllergens(parseInt(localStorage.getItem('sec-product-id')), JSON.parse(localStorage.getItem('sec-allergens-to-add')))
                    .then(res => {
                        localStorage.removeItem('sec-product-id');
                        localStorage.removeItem('sec-allergens-to-add');
                    });
            }
            else if(added === 0) {
                setAddMsg("Nie udało się dodać produktu. Prosimy spróbować później lub skontaktować się z administratorem systemu");
            }
        }

        /* Get all categories */
        getAllCategories()
            .then(res => {
                setCategories(res.data.result);
                setChoosenCategories(res.data.result.map((item) => {
                    return {
                        id: item.id,
                        selected: false
                    }
                }));
            });

        /* UPDATE PRODUCT MODE */
        const param = parseInt(new URLSearchParams(location.search).get("id"));
        if(param) {
            setId(param);
            setUpdate(true);

            getProductDetails(param)
                .then(async res => {
                    await setProduct(res.data.result[0]);
                    await setInitialValues(res.data.result[0]);
                });

            getProductGallery(param)
                .then(res => {
                    setGallery(res.data?.result);
                });

            getProductCategories(param)
                .then(res => {
                    if(res.data.result) {
                        initializeCategories(res.data.result);
                    }
                });
        }
        else {
            getNewId()
                .then(res => {
                   setId(res.data.result+1);
                });
        }
    }, []);

    const setInitialValues = (productData) => {
        setName(productData.name);

        setPrice(productData.price);

        setHidden(productData.hidden);
        setRecommendation(productData.recommendation);

        setShortDescription(productData.description);
    }

    const isInArray = (categoryId) => {
        return choosenCategories.filter(item => {
            return item.id === categoryId;
        }).length > 0;
    }

    const handleCategories = (categoryToToggle) => {
        if(isInArray(categoryToToggle)) {
            setChoosenCategories(choosenCategories.map((item) => {
                return {
                    id: item.id,
                    selected: item.id === categoryToToggle ? !item.selected : item.selected
                }
            }));
        }
        else {
            setChoosenCategories([...choosenCategories, { id: categoryToToggle, selected: true }]);
        }
    }

    const isCategoryChoosen = (categoryId) => {
        return choosenCategories.filter((item) => {
            return item.id === categoryId && item.selected;
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

    const handleSubmit = () => {
        addProduct(name, subtitle, price, stock, attribute, attributeValues,
                shortDescription, description2, description3, description4,
                img, img2, img3, img4, img5,
                gallery, infoIcons, categories
            )
            .then((res) => {
                if(res?.data?.result) {
                    setResponse("Produkt został dodany");
                    setStatus(1);
                }
                else {
                    setResponse("Wystąpił błąd. Prosimy spróbować później");
                    setStatus(0);
                }
            });
    }

    return <main className="panelContent">
        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Witaj w Panelu - tu możesz zarządzać swoim sklepem
            </h1>
            <button className="logoutBtn" onClick={() => { logoutUser(); }}>
                Wyloguj się
            </button>
        </header>
        {addMsg === "" ? <div className="addProduct__form addProduct__form--addProduct panelContent__frame">
            <h1 className="panelContent__frame__header">
                Dodaj produkt
                {response ? <span className={status ? "response response--positive" : "response response--negative"}>
                        {response}
                    </span> : ""}
            </h1>
            <section className="addProduct__form__section">
                <input className="invisibleInput"
                       name="id"
                       value={id} />
                <input className="invisibleInput"
                       name="img1Changed"
                       value={imagesChanged[0]} />
                <input className="invisibleInput"
                       name="img2Changed"
                       value={imagesChanged[1]} />
                <input className="invisibleInput"
                       name="img3Changed"
                       value={imagesChanged[2]} />
                <input className="invisibleInput"
                       name="img4Changed"
                       value={imagesChanged[3]} />
                <input className="invisibleInput"
                       name="img5Changed"
                       value={imagesChanged[4]} />


                <label className="addProduct__label">
                    Nazwa produktu
                    <input className="addProduct__input"
                           name="name"
                           value={name}
                           onChange={(e) => { setName(e.target.value) }}
                           placeholder="Nazwa produktu" />
                </label>
                <label className="addProduct__label">
                    Podtytuł
                    <input className="addProduct__input"
                           name="name"
                           value={subtitle}
                           onChange={(e) => { setSubtitle(e.target.value) }}
                           placeholder="Podtytuł produktu" />
                </label>
                <label className="addProduct__label">
                    Cena
                    <input className="addProduct__input"
                           name="price"
                           type="number"
                           step={0.01}
                           value={price}
                           onChange={(e) => { setPrice(e.target.value) }}
                           placeholder="Cena" />
                </label>
                <label className="addProduct__label">
                    Stan magazynowy
                    <input className="addProduct__input"
                           name="stock"
                           type="number"
                           value={stock}
                           onChange={(e) => { setStock(e.target.value) }}
                           placeholder="Na stanie" />
                </label>
                <main className="admin__editorWrapper">
                    Opis na górze strony
                    <Editor
                        editorState={shortDescription}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor"
                        onEditorStateChange={(text) => { setShortDescription(text); }}
                    />
                </main>
                <label className="addProduct__label">
                    Nazwa atrybutu (np. smak/gramatura)
                    <input className="addProduct__input"
                           name="stock"
                           value={attribute}
                           onChange={(e) => { setAttribute(e.target.value) }}
                           placeholder="Nazwa atrybutu" />
                </label>
                <label className="addProduct__label">
                    Wartości atrybutu (po przecinku, np: malinowa,traskawkowa)
                    <input className="addProduct__input"
                           name="attributeValues"
                           value={attributeValues}
                           onChange={(e) => { setAttributeValues(e.target.value) }}
                           placeholder="Wartości atrybutów (po przecinku)" />
                </label>

                <div className="flex">
                    <label className="admin__label admin__flex admin__label--imgUpload">
                        Dodaj obrazek wyróżniający
                        <span className="admin__label__imgUpload">
                            {updateImage ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/${updateImage}`} alt="foto" />
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
                    <label className="admin__label admin__flex admin__label--imgUpload">
                        Dodaj obrazek po najechaniu myszką
                        <span className="admin__label__imgUpload">
                            {updateImage2 ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/${updateImage2}`} alt="foto" />
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
                </div>
                <main className="admin__addGallery">
                    Galeria zdjęć
                    <RUG
                        onChange={(images) => {
                            setGallery(images);
                        }}
                        autoUpload={false}
                        action="http://localhost:5000/product/add-product" // upload route
                        source={response => response.source} // response image source
                    />
                </main>
                <main className="admin__addGallery">
                    Informacje - ikonki
                    <RUG
                        onChange={(images) => {
                            setInfoIcons(images);
                        }}
                        autoUpload={false}
                        action="/api/upload" // upload route
                        source={response => response.source} // response image source
                    />
                </main>

                <div className="flex alignTop">
                    <label className="admin__label admin__flex admin__label--imgUpload admin__label--imgUpload--section">
                        Zdjęcie w sekcji 2.
                        <span className="admin__label__imgUpload">
                            {updateImage3 ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/${updateImage3}`} alt="foto" />
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
                    <main className="admin__editorWrapper">
                        Opis w sekcji 2.
                        <Editor
                            editorState={description2}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editor"
                            onEditorStateChange={(text) => { setDescription2(text); }}
                        />
                    </main>
                </div>

                <div className="flex alignTop">
                    <label className="admin__label admin__flex admin__label--imgUpload admin__label--imgUpload--section">
                        Zdjęcie w sekcji 3.
                        <span className="admin__label__imgUpload">
                            {updateImage4 ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/${updateImage4}`} alt="foto" />
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
                    <main className="admin__editorWrapper">
                        Opis w sekcji 3.
                        <Editor
                            editorState={description3}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editor"
                            onEditorStateChange={(text) => { setDescription3(text); }}
                        />
                    </main>
                </div>

                <div className="flex alignTop">
                    <label className="admin__label admin__flex admin__label--imgUpload admin__label--imgUpload--section">
                        Zdjęcie w sekcji 4.
                        <span className="admin__label__imgUpload">
                            {updateImage5 ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/${updateImage5}`} alt="foto" />
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
                    <main className="admin__editorWrapper">
                        Opis w sekcji 4.
                        <Editor
                            editorState={description4}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editor"
                            onEditorStateChange={(text) => { setDescription4(text); }}
                        />
                    </main>
                </div>

                <section className="addProduct__categorySelect">
                    Kategorie
                    {categories?.map((item, index) => {
                        if(!item.parent_id) {
                            return <><label className="panelContent__filters__label__label" key={index}>
                                <button value={item.id} className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); handleCategories(item.id); }}>
                                    <span className={isCategoryChoosen(item.id) ? "panelContent__filters__btn--active" : "d-none"} />
                                </button>
                                {item.name}
                            </label>
                                <input className="invisibleInput"
                                       name={`category-${item.id}`}
                                       value={isCategoryChoosen(item.id)} />


                                {categories?.map((itemChild, indexChild) => {
                                    if(itemChild.parent_id === item.id) {
                                        return <><label className="panelContent__filters__label__label pl-5 d-block" key={index}>
                                            <button value={itemChild.id} className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); handleCategories(itemChild.id); }}>
                                                <span className={isCategoryChoosen(itemChild.id) ? "panelContent__filters__btn--active" : "d-none"} />
                                            </button>
                                            {itemChild.name}
                                        </label>
                                            <input className="invisibleInput"
                                                   name={`category-${itemChild.id}`}
                                                   value={isCategoryChoosen(itemChild.id)} />
                                        </>
                                    }
                                })}
                            </>
                        }
                    })}
                </section>
            </section>

            <section className="addProduct__form__section">
                <label className="panelContent__filters__label__label panelContent__filters__label__label--category">
                    <button className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); setHidden(!hidden); }}>
                        <span className={hidden ? "panelContent__filters__btn--active" : "d-none"} />
                    </button>
                    Ukryj produkt
                </label>
                <label className="panelContent__filters__label__label panelContent__filters__label__label--category">
                    <button className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); setRecommendation(!recommendation); }}>
                        <span className={recommendation ? "panelContent__filters__btn--active" : "d-none"} />
                    </button>
                    Pokaż produkt w polecanych
                </label>
                <label className="panelContent__filters__label__label panelContent__filters__label__label--category">
                    <button className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); setTop(!top); }}>
                        <span className={top ? "panelContent__filters__btn--active" : "d-none"} />
                    </button>
                    Pokaż produkt w idealne połączenie
                </label>

                <input className="invisibleInput"
                       value={hidden ? "hidden" : ""}
                       name="hidden" />
                <input className="invisibleInput"
                       value={recommendation ? "true" : ""}
                       name="recommendation" />
            </section>

            <section className="addProduct__btnWrapper">
                <button className="addProduct__btn" onClick={() => { handleSubmit(); }}>
                    {update ? "Zaktualizuj produkt" : "Dodaj produkt"}
                </button>
            </section>
        </div> : <h2 className="addMsg">
            {addMsg}
        </h2> }
    </main>
}

export default AddProductContent;
