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

const AddProductContent = () => {
    const editorR = useRef(null);

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
    const [gallery, setGallery] = useState([]);
    const [response, setResponse] = useState("");
    const [status, setStatus] = useState(-1);
    const [attribute, setAttribute] = useState('');
    const [attributeValues, setAttributeValues] = useState('');

    const [imagesChanged, setImagesChanged] = useState([false, false, false, false, false]);

    const [img1, setImg1] = useState(null);
    const [img2, setImg2] = useState(null);

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

    const addNewGalleryImage = (e, n) => {
        const galleryWrapper = document.querySelector(`.galleryWrapper--${n}`);
        const input = document.querySelector(`.galleryImageInput--${n}`);

        const temporaryImages = document.querySelectorAll(`.galleryWrapper--${n}>.galleryProductImage`);
        temporaryImages.forEach(item => {
            item.parentElement.removeChild(item);
        });

        let i = 0;

        setImagesChanged(imagesChanged.map((item, index) => {
            if(index === n) return true;
            else return item;
        }));

        Array.prototype.forEach.call(input.files, async (file) => {
            const reader = new FileReader();
            await reader.readAsDataURL(file);

            reader.onload = (e) => {
                const newImg = document.createElement("img");
                newImg.setAttribute("src", e.target.result);
                newImg.setAttribute("class", "galleryProductImage");
                newImg.setAttribute("alt", "zdjecie-galerii");
                galleryWrapper.appendChild(newImg);
                i++;
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
                <main className="admin__addGallery">
                    Galeria zdjęć
                    <RUG
                        onChange={(a) => {
                            console.log('change');
                            console.log(a);
                        }}
                        action="http://localhost:5000/product/add-product" // upload route
                        source={response => response.source} // response image source
                    />
                </main>
                <main className="admin__addGallery">
                    Informacje - ikonki
                    <RUG
                        action="/api/upload" // upload route
                        source={response => response.source} // response image source
                    />
                </main>

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
                <label className="panelContent__filters__label__label panelContent__filters__label__label--category mt-4">
                    <button className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); setRecommendation(!recommendation); }}>
                        <span className={recommendation ? "panelContent__filters__btn--active" : "d-none"} />
                    </button>
                    Pokaż produkt w polecanych
                </label>

                <input className="invisibleInput"
                       value={hidden ? "hidden" : ""}
                       name="hidden" />
                <input className="invisibleInput"
                       value={recommendation ? "true" : ""}
                       name="recommendation" />
            </section>

            <section className="addProduct__btnWrapper">
                <button className="addProduct__btn" type="submit">
                    {update ? "Zaktualizuj produkt" : "Dodaj produkt"}
                </button>
            </section>
        </div> : <h2 className="addMsg">
            {addMsg}
        </h2> }
    </main>
}

export default AddProductContent;
