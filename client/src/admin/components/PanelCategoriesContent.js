import React, { useState, useEffect } from 'react'
import {deleteCategory, getAllCategories, getCategory} from "../helpers/categoriesFunctions";
import exit from "../static/img/trash-can.svg";
import trash from "../static/img/edit.svg";
import addIcon from '../static/img/add.svg'
import Modal from 'react-modal'
import closeImg from "../static/img/close.png";
import {useLocation} from "react-router";
import convertToURL from "../../helpers/convertToURL";

const PanelCategoriesContent = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [header, setHeader] = useState("");
    const [subheader, setSubheader] = useState("");
    const [modal, setModal] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [candidate, setCandidate] = useState(-1);
    const [deleteMsg, setDeleteMsg] = useState("");
    const [addedMsg, setAddedMsg] = useState("");
    const [update, setUpdate] = useState(false);
    const [id, setId] = useState(0);
    const [parentId, setParentId] = useState(0);
    const [hidden, setHidden] = useState(false);
    const [nameEn, setNameEn] = useState("");
    const [headerEn, setHeaderEn] = useState("");
    const [subheaderEn, setSubheaderEn] = useState("");

    const location = useLocation();

    useEffect(() => {
        /* Check if update mode */
        const param = parseInt(new URLSearchParams(location.search).get("id"));
        if(param) {
            getCategory(param)
                .then(res => {
                    const result = res.data.result;
                    if(result) {
                        setId(param);
                        setUpdate(true);
                        setName(result.name);
                        setHeader(result.header);
                        setSubheader(result.subheader);
                        setParentId(result.parent_id);
                        setHidden(result.hidden);
                        setNameEn(result.name_en);
                        setHeaderEn(result.header_en);
                        setSubheaderEn(result.subheader_en);
                    }
                });
        }
    }, []);

    useEffect(() => {
        getAllCategories()
            .then(res => {
                setCategories(res.data.result);
            });

        if(sessionStorage.getItem('sec-category-added')) {
            const added = new URLSearchParams(location.search).get("added");
            sessionStorage.removeItem('sec-category-added');

            if(added === "1") setAddedMsg("Kategoria została dodana");
            else if(added === "0") setAddedMsg("Kategoria nie może być pusta");
            else if(added === "-1") setAddedMsg("Kategoria o podanej nazwie już istnieje");
            else if(added === "2") setAddedMsg("Kategoria została zaktualizowana");
        }
    }, [modal]);

    useEffect(() => {
        setTimeout(() => {
            setAddedMsg("");
        }, 3000);
    }, [addedMsg]);

    const deleteCategoryById = () => {
        deleteCategory(candidate)
            .then(res => {
                setDeleted(true);
                if(res.data.result === 0) {
                    /* Can't delete category, becouse it has children */
                    setDeleteMsg("Nie można usunąć podanej kategorii. Najpierw usuń wszystkie kategorie - dzieci podanej kategorii");
                }
                else if(res.data.result === -1) {
                    /* Database error */
                    setDeleteMsg("Coś poszło nie tak... Prosimy spróbować później");
                }
            });
    }

    const openModal = id => {
        setCandidate(id);
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
        setDeleted(false);
    }

    return <main className="panelContent">

        <Modal
        isOpen={modal}
        portalClassName="panelModal"
        >

        {!deleted ? <>
            <h2 className="modalQuestion">
                Czy na pewno chcesz usunąć tę kategorię?
            </h2>

            <section className="modalQuestion__buttons">
                <button className="modalQuestion__btn" onClick={() => { deleteCategoryById() }}>
                    Tak
                </button>
                <button className="modalQuestion__btn" onClick={() => { closeModal() }}>
                    Nie
                </button>
            </section>
        </> : <h2 className="modalQuestion">
            {deleteMsg === "" ? "Kategoria została usunięta" : deleteMsg}
        </h2>}

        <button className="modalClose" onClick={() => { closeModal() }}>
            <img className="modalClose__img" src={closeImg} alt="zamknij" />
        </button>
    </Modal>

        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Kategorie
            </h1>
        </header>
        <section className="panelContent__frame">
            <section className="panelContent__frame__section categoryList">
                <h1 className="panelContent__frame__header">
                    Lista kategorii
                    <section className="panelContent__buttons">
                        <a className="panelContent__btn" href="/panel/dodaj-kategorie">
                            Dodaj nową kategorię
                            <img className="panelContent__btn__icon" src={addIcon} alt="dodaj" />
                        </a>
                    </section>
                </h1>

                <main className="panelContent__content">
                    {categories?.map((item, index) => (
                        <section className="panelContent__item productItem">
                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Id kategorii
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.id}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Nazwa
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.name}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Priorytet wyświetlania
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.priority ? item.priority: "BRAK"}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Rodzic
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.parent_name ? item.parent_name : "BRAK"}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Działania
                                </h4>
                                <div className="panelContent__column__value">
                                    <div className="panelContent__column__value panelContent__column__value--buttons">
                                        <button className="panelContent__column__btn">
                                            <a className="panelContent__column__link" href={`/panel/dodaj-kategorie?id=${item.id}`}>
                                                <img className="panelContent__column__icon" src={trash} alt="przejdz" />
                                            </a>
                                        </button>
                                        <button className="panelContent__column__btn" onClick={() => { openModal(item.id) }}>
                                                <img className="panelContent__column__icon" src={exit} alt="usuń" />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </section>
                        ))}
                </main>
            </section>
        </section>
    </main>
}

export default PanelCategoriesContent;
