import React from 'react';
import logo from '../static/assets/logo.png'

const Footer = () => {
    return <footer className="footer">
        <section className="footer__main flex">
            <section className="footer__col flex">
                <a className="footer__col__logoWrapper" href="/">
                    <img className="btn__img" src={logo} alt="bio-stories" />
                </a>
                <section className="footer__col__content">
                    <h4 className="footer__header">
                        BIO Stories
                    </h4>
                    <span className="footer__text">
                        Sklep stacjonarny:
                    </span>
                    <span className="footer__text">
                        ul. Pocztowa 4,
                    </span>
                    <span className="footer__text">
                        59-100 Polkowice
                    </span>
                    <span className="footer__text">
                        Czynne:
                    </span>
                    <span className="footer__text">
                        poniedziałek - piątek 10:00-18:00
                    </span>
                    <span className="footer__text">
                        sobota 10:00-14:00
                    </span>
                </section>
            </section>
            <section className="footer__col">
                <h4 className="footer__header">
                    Informacje
                </h4>
                <span className="footer__text">
                    <a href="/regulamin">
                        Regulamin
                    </a>
                </span>
                <span className="footer__text">
                    <a href="/polityka-prywatnosci">
                        Polityka prywatności
                    </a>
                </span>
                <span className="footer__text">
                    <a href="/zwroty-i-platnosci">
                        Zwroty i płatności
                    </a>
                </span>
                <span className="footer__text">
                    <a href="/dostawa">
                        Dostawa
                    </a>
                </span>
            </section>
            <section className="footer__col">
                <h4 className="footer__header">
                    Produkty
                </h4>
                <span className="footer__text">
                    <a href="/sklep">
                        Sklep
                    </a>
                </span>
                <span className="footer__text">
                    <a href="/idealne-polaczenie">
                        Idealne połączenie
                    </a>
                </span>
                <span className="footer__text">
                    <a href="/nowosci">
                        Nowości
                    </a>
                </span>
                <span className="footer__text">
                    <a href="/najczesciej-wybierane">
                        Najczęściej wybierane
                    </a>
                </span>
            </section>
            <section className="footer__col">
                <h4 className="footer__header">
                    Dane kontaktowe
                </h4>
                <span className="footer__text">
                   Telefon kontaktowy:
                </span>
                <span className="footer__text footer__text--big">
                    <a href="tel:+48609143152">
                        +48 609 143 152
                    </a>
                </span>
                <span className="footer__text">
                    Adres e-mail:
                </span>
                <span className="footer__text footer__text--big">
                    <a href="mailto:kontakt@biostories.pl">
                        kontakt@biostories.pl
                    </a>
                </span>
            </section>
        </section>
        <aside className="footer__bottom">
            <h5 className="footer__bottom__header">
                &copy; { new Date().getFullYear() } BIO Stories. Wszystkie prawa zastrzeżone
            </h5>
            <h6 className="footer__bottom__header">
                <a href="https://skylo.pl" target="_blank">
                    Skylo.pl - Agencja Interaktywna
                </a>
            </h6>
        </aside>
    </footer>
};

export default Footer;
