import React, { useState, useEffect } from 'react'
import {
    addCategory,
    deleteCategory,
    getAllCategories,
    getCategory,
    updateCategory
} from "../helpers/categoriesFunctions";
import exit from "../static/img/exit.svg";
import trash from "../static/img/trash.svg";

import Modal from 'react-modal'
import closeImg from "../static/img/close.png";
import {useLocation} from "react-router";
import convertToURL from "../../helpers/convertToURL";
import {logoutUser} from "../../helpers/userFunctions";

const PanelAddCategoryContent = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [priority, setPriority] = useState(0);
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
    const [response, setResponse] = useState("");
    const [status, setStatus] = useState(-1);

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
                        setPriority(result.priority);
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

    const resetFields = () => {
        setName("");
        setParentId(null);
        setPriority(0);
        setHidden(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(update) {
            updateCategory(id, name, parentId, priority, hidden)
                .then((res) => {
                    if(res?.data?.result) {
                        setResponse("Kategoria została zaktualizowana");
                        setStatus(1);
                    }
                    else {
                        setResponse("Wystąpił błąd. Prosimy spróbować później");
                        setStatus(0);
                    }
                });
        }
        else {
            addCategory(name, parentId, priority, hidden)
                .then((res) => {
                    if(res?.data?.result) {
                        setResponse("Kategoria została dodana");
                        setStatus(1);
                    }
                    else {
                        setResponse("Wystąpił błąd. Prosimy spróbować później");
                        setStatus(0);
                    }
                    resetFields();
                });
        }
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
                Witaj w Panelu - tu możesz zarządzać swoim sklepem
            </h1>
            <button className="logoutBtn" onClick={() => { logoutUser(); }}>
                Wyloguj się
            </button>
        </header>
        <section className="panelContent__frame">
            <section className="panelContent__frame__section">
                <h1 className="panelContent__frame__header">
                    Dodaj kategorię
                    {response ? <span className={status ? "response response--positive" : "response response--negative"}>
                        {response}
                    </span> : ""}
                </h1>

                {addedMsg === "" ? <form className="panelContent__frame__form categoriesForm"
                                         method="POST"
                                         onSubmit={(e) => { handleSubmit(e) }}
                >
                    <input className="invisibleInput"
                           name="id"
                           value={id} />

                    <input className="invisibleInput"
                           name="permalink"
                           value={convertToURL(name)} />

                    <input className="invisibleInput"
                           name="hidden"
                           value={hidden ? "hidden" : ""} />

                    <label className="addProduct__label addProduct__label--frame">
                        Nazwa kategorii
                        <input className="addProduct__input"
                               name="name"
                               value={name}
                               onChange={(e) => { setName(e.target.value) }}
                               type="text"
                               placeholder="Nazwa kategorii" />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Rodzic
                        <select className="addProduct__categorySelect"
                                name="parentId"
                                value={parentId}
                                onChange={(e) => { setParentId(e.target.value); }}
                        >
                            <option value={0}>Brak rodzica</option>
                            {categories?.map((item, index) => (
                                <option value={item.id} key={index}>{item.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Priorytet (im większy, tym kategoria wyświetla się wyżej)
                        <input className="addProduct__input"
                               name="priority"
                               type="number"
                               value={priority}
                               onChange={(e) => { setPriority(e.target.value) }}
                               placeholder="Priorytet" />
                    </label>

                    <label className="panelContent__filters__label__label panelContent__filters__label__label--frame panelContent__filters__label__label--category">
                        <button className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); setHidden(!hidden); }}>
                            <span className={hidden ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        Ukryj kategorię
                    </label>

                    <button className="addProduct__btn" type="submit">
                        Dodaj kategorię
                    </button>
                </form> : <section className="addedMsgWrapper">
                    <h2 className="addedMsg">
                        {addedMsg}
                    </h2>
                </section>}
            </section>
        </section>
    </main>
}

export default PanelAddCategoryContent;
