import React, { useRef, useEffect, useState } from 'react'
import closeIcon from "../static/img/close.png";
import uploadIcon from '../static/img/edit.svg'
import Dropzone from "react-dropzone-uploader";
import Loader from "../../components/Loader";
import axios from "axios";
import settings from "../helpers/settings";
import { removePolishChars } from "../../helpers/others";

const VideoUploader = ({setVideoUpload, videoUpload, closeUploader, key}) => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(-1);
    const [progress, setProgress] = useState(0);
    const [fileToLarge, setFileToLarge] = useState(false);

    const getUploadParams = ({file, meta}) => {
        setLoading(true);
        const config = {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
            },
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        let formData = new FormData();
        formData.append('file', file);
        formData.append('key', key);

       return axios.post(`${settings.API_URL}/video/upload`, formData, config)
           .then((res) => {
               setLoading(false);
               setVideoUpload(videoUpload+1);
               if(res?.data?.result) setResponse(1);
               else setResponse(0);
           });
    }

    return <main className="videoUploaderWrapper">
        <main className="videoUploader">
            <button className="registerModal__closeBtn" onClick={() => { closeUploader(); }}>
                <img className="registerModal__closeBtn__img" src={closeIcon} alt="zamknij" />
            </button>

            <h2 className="player__header player__header--videoUploader">
                Prześlij filmik
            </h2>

            {!loading && response === -1 ? <>
                <Dropzone
                    onChangeStatus={(a, b, c) => {
                        if(b === 'error_file_size') {
                            setFileToLarge(true);
                        }
                    }}
                    getUploadParams={getUploadParams}
                    accept="video/mp4,video/x-m4v,video/*"
                    maxSizeBytes={500000000}
                    maxFiles={1} />

                <figure className="videoUploader__imgWrapper">
                    <img className="videoUploader__img" src={uploadIcon} alt="dodaj-filmik" />
                </figure>
                {!fileToLarge ? <>
                    <h3 className="videoUploader__text">
                        Przeciągnij i upuść pliki wideo, które chcesz przesłać
                    </h3>
                    <h4 className="videoUploader__smallText">
                        Akceptowane są pliki z rozszerzeniem .mp4, .webm oraz .mov. Postaraj się, aby Twój plik nie ważył więcej niż 100 MB. Pliki powyżej 500 MB nie będą akceptowane.
                    </h4>
                    <button className="button button--hover button--videoUploader">
                        <img className="btn__img" src={wybierzPlikBtn} alt="wybierz-plik" />
                    </button>
                </> : <h4 className="videoUploader__text">
                    Wysłane video jest za duże. Skompresuj swój plik do maksymalnie 500MB i ponów próbę.
                </h4>}
            </> : (loading ? <div className="videoLoadingWrapper">
                <span className="progressBar">
                    <span className="progressBar__inner" style={{
                        width: progress + '%'
                    }}></span>
                </span>

                <span className="progressBar__percent">
                    {progress} %
                </span>
            </div> : (response === 1 ? <>
                <h2 className="videoUploader__responseHeader">
                    Filmik został dodany
                </h2>
            </> : <>
                <h2 className="videoUploader__responseHeader">
                    Coś poszło nie tak... Prosimy spróbować później
                </h2>
            </>))}
        </main>
    </main>
}

export default VideoUploader;
