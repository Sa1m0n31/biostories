import React, { useEffect, useState } from 'react'
import exit from "../static/img/exit.svg";
import trash from "../static/img/trash.svg";
import {deleteShippingMethod, getAllShippingMethods} from "../helpers/shippingFunctions";
import {useLocation} from "react-router";
import Modal from 'react-modal'
import closeImg from "../static/img/close.png";
import settings from "../helpers/settings";
import JoditEditor from "jodit-react";
import axios from "axios";

const PanelShippingContent = () => {
    const [addedMsg, setAddedMsg] = useState("");
    const [update, setUpdate] = useState(false);
    const [id, setId] = useState(0);
    const [modal, setModal] = useState(false);
    const [candidate, setCandidate] = useState(-1);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [methods, setMethods] = useState([]);
    const [deleted, setDeleted] = useState(false);
    const [deleteMsg, setDeleteMsg] = useState("");
    const [description, setDescription] = useState('');

    const location = useLocation();

    useEffect(() => {
        // Get shipping methods
        axios.get(`${settings.API_URL}/shipping/get-info`)
            .then(res => {
                if(res.data.result) {
                    const result = res.data.result;
                    if(result) {
                        setMethods(result);
                    }
                }
            });

        // Check if update mode
        const param = parseInt(new URLSearchParams(location.search).get("id"));
        if(param) {
            // Get shipping method by id
            setId(param);
            axios.post(`${settings.API_URL}/shipping/get-shipping-method`, { id: param })
                .then(res => {
                    const result = res.data?.result;
                    console.log(result);
                    if(result) {
                        setUpdate(true);
                        setName(result.name);
                        setDescription(result.description);
                        setPrice(result.price);
                    }
                })
        }

    }, [deleted, addedMsg]);

    useEffect(() => {
        if(addedMsg !== "") {
            setTimeout(() => {
                setAddedMsg("");
            }, 3000);
        }
    }, [addedMsg]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(update) {
            axios.post(`${settings.API_URL}/shipping/update`, {
                id, name, price, description
            })
                .then(res => {
                    if(res.data.result) setAddedMsg("Metoda wysy??ki zosta??a zaktualizowana");
                    else setAddedMsg("Co?? posz??o nie tak... Prosimy spr??bowa?? p????niej");
                })
        }
        else {
            axios.post(`${settings.API_URL}/shipping/add`, {
                name, price, description
            })
                .then(res => {
                    if(res.data.result) {
                        setAddedMsg("Metoda wysy??ki zosta??a dodana");
                        setName('');
                        setDescription('');
                        setPrice(null);
                    }
                    else setAddedMsg("Co?? posz??o nie tak... Prosimy spr??bowa?? p????niej");
                });
        }
    }

    const openModal = (id) => {
        setCandidate(id);
        setModal(true);
    }

    const closeModal = () => {
        setCandidate(-1);
        setModal(false);
    }

    const deleteShippingMethodById = () => {
        deleteShippingMethod(candidate)
            .then(res => {
                if(res.data.result) {
                    setDeleted(true);
                }
                else {
                    setDeleteMsg("Co?? posz??o nie tak... Prosimy spr??bowa?? p????niej.");
                }
            });
    }

    useEffect(() => {
        if(deleteMsg !== "") {
            setTimeout(() => {
                setDeleteMsg("");
                setDeleted(false);
            }, 2000);
        }
    }, [deleteMsg]);

    return <main className="panelContent">

        <Modal
            isOpen={modal}
            portalClassName="panelModal"
        >

            {!deleted ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usun???? t?? metod?? wysy??ki?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deleteShippingMethodById() }}>
                        Tak
                    </button>
                    <button className="modalQuestion__btn" onClick={() => { closeModal() }}>
                        Nie
                    </button>
                </section>
            </> : <h2 className="modalQuestion">
                {deleteMsg === "" ? "Metoda wysy??ki zosta??a usuni??ta" : deleteMsg}
            </h2>}

            <button className="modalClose" onClick={() => { closeModal() }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>
        </Modal>

        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Metody wysy??ki
            </h1>
        </header>
        <section className="panelContent__frame">
            <section className="panelContent__frame__section">
                <h1 className="panelContent__frame__header">
                    {update ? "Edytuj metod?? wysy??ki" : "Dodaj metode wysy??ki"}
                </h1>

                {addedMsg === "" ? <form className="panelContent__frame__form categoriesForm shippingForm"
                                         onSubmit={(e) => { handleSubmit(e) }}
                >
                    <label className="addProduct__label addProduct__label--frame addShipping__input">
                        <input className="addProduct__input"
                               name="name"
                               value={name}
                               onChange={(e) => { setName(e.target.value) }}
                               type="text"
                               placeholder="Nazwa metody wysy??ki" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame addShipping__input">
                        <textarea className="addProduct__input addProduct__input--textarea"
                               name="description"
                               value={description}
                               onChange={(e) => { setDescription(e.target.value) }}
                               placeholder="Opis">
                        </textarea>
                    </label>
                    <label className="addProduct__label addProduct__label--frame addShipping__input">
                        <input className="addProduct__input"
                               name="price"
                               value={price}
                               step={0.01}
                               onChange={(e) => { setPrice(e.target.value) }}
                               type="number"
                               placeholder="Cena" />
                    </label>

                    <button className="addProduct__btn btn--maxWidth btn--shipping" type="submit">
                        {update ? 'Aktualizuj metod?? wysy??ki' : 'Dodaj metod?? wysy??ki'}
                    </button>
                </form> : <section className="addedMsgWrapper">
                    <h2 className="addedMsgWrapper">
                        {addedMsg}
                    </h2>
                </section>}
            </section>

            <section className="panelContent__frame__section categoryList">
                <h1 className="panelContent__frame__header">
                    Lista metod wysy??ki
                </h1>

                {methods.map((item, index) => {
                    return <section className="panelContent__item productItem">
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
                                Cena
                            </h4>
                            <h3 className="panelContent__column__value">
                                {item.price} PLN
                            </h3>
                        </section>

                        <section className="panelContent__column">
                            <h4 className="panelContent__column__label">
                                Dzia??ania
                            </h4>
                            <div className="panelContent__column__value">
                                <div className="panelContent__column__value panelContent__column__value--buttons">
                                    <button className="panelContent__column__btn">
                                        <a className="panelContent__column__link" href={`?id=${item.id}`}>
                                            <img className="panelContent__column__icon" src={exit} alt="przejdz" />
                                        </a>
                                    </button>

                                    <button className="panelContent__column__btn" onClick={() => { openModal(item.id) }}>
                                        <img className="panelContent__column__icon" src={trash} alt="usu??" />
                                    </button>
                                </div>
                            </div>
                        </section>
                    </section>
                })}
            </section>
        </section>
    </main>
}

export default PanelShippingContent;
