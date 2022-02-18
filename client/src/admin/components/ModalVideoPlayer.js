import React, {useEffect} from 'react'
import { Player, ControlBar } from 'video-react'
import 'video-react/dist/video-react.css'
import closeIcon from "../static/img/close.png"

const ModalVideoPlayer = ({source, closeModal}) => {
    useEffect(() => {
        document.addEventListener("keyup", (e) => {
            if(e.key === "Escape") {
                closeModal();
            }
        });
    }, []);

    return <main className="modalVideoPlayer">
        <main className="modalVideoPlayer__video">
            <button className="registerModal__closeBtn" onClick={() => { closeModal(); }}>
                <img className="registerModal__closeBtn__img" src={closeIcon} alt="zamknij" />
            </button>

            <Player src={source} playsInline autoPlay={true} controls={false} >
                <source src={source} />
                <ControlBar autoHide={false} />
            </Player>
        </main>
    </main>
}

export default ModalVideoPlayer;
