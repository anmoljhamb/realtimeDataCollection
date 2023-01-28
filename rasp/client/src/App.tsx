import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";
import { SensorData } from "./components";

function App() {
    const BACKEND_URI = process.env.REACT_APP_BACKEND_URI;

    const [requestDataToogle, setRequestDataToogle] = useState<boolean | null>(
        null
    );
    const [displayDelayTime, setDisplayDelayTime] = useState<number>(2000);
    const [delayTime, setDelayTime] = useState<number>(2000);

    useEffect(() => {
        console.log("Fetching the current status of request data.");
        axios({ method: "GET", url: `${BACKEND_URI}/getRequestData` }).then(
            (resp) => {
                setRequestDataToogle(resp.data);
            }
        );
        axios({ method: "GET", url: `${BACKEND_URI}/getDelayTime` }).then(
            (resp) => {
                setDisplayDelayTime(resp.data);
                setDelayTime(resp.data);
            }
        );
    }, [BACKEND_URI]);

    useEffect(() => {
        if (requestDataToogle === true) {
            axios({
                method: "GET",
                url: `${BACKEND_URI}/startRequestData`,
            }).then((resp) => {
                console.log(resp.data);
            });
        } else if (requestDataToogle === false) {
            axios({
                method: "GET",
                url: `${BACKEND_URI}/stopRequestData`,
            }).then((resp) => {
                console.log(resp.data);
            });
        }
    }, [requestDataToogle, BACKEND_URI]);

    const handleOnClick = () => {
        setRequestDataToogle((oldVal) => !oldVal);
    };

    const handleDelayForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        axios({
            method: "GET",
            url: `${BACKEND_URI}/setDelayTime/${displayDelayTime}`,
        }).then((resp) => {
            console.log(resp.data);
            setDelayTime(displayDelayTime);
        });
    };

    return (
        <div className="App">
            <div className="boardControl">
                <form onSubmit={handleDelayForm}>
                    <label htmlFor="delayTime">
                        Delay Time{" "}
                        <span>
                            {displayDelayTime}
                            {displayDelayTime !== delayTime && "*"}
                        </span>
                    </label>
                    <input
                        type="range"
                        min="500"
                        max="8000"
                        step="100"
                        name="delayTime"
                        value={displayDelayTime}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setDisplayDelayTime(
                                Number.parseInt(event.target.value)
                            );
                        }}
                        className="slider"
                    />
                    <button>Change Delay Time</button>
                </form>
                <div className="requestData">
                    <p>
                        Getting Data:{" "}
                        <span className={requestDataToogle ? "true" : "false"}>
                            {requestDataToogle ? "true" : "false"}
                        </span>
                    </p>
                    <button onClick={handleOnClick}>
                        Turn {requestDataToogle ? "off" : "on"}
                    </button>
                </div>
            </div>
            <SensorData />
        </div>
    );
}

export default App;
