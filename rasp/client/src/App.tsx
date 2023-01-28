import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";

function App() {
    const BACKEND_URI = process.env.REACT_APP_BACKEND_URI;

    const [requestDataToogle, setRequestDataToogle] = useState<boolean | null>(
        null
    );
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
            url: `${BACKEND_URI}/setDelayTime/${delayTime}`,
        }).then((resp) => {
            console.log(resp.data);
        });
    };

    return (
        <>
            <p>
                Request Data Status:{" "}
                <span>{requestDataToogle ? "true" : "false"}</span>
            </p>
            <button onClick={handleOnClick}>Toogle</button>
            <form onSubmit={handleDelayForm}>
                <label htmlFor="delayTime">
                    Delay Time <span>{delayTime}</span>
                </label>
                <input
                    type="range"
                    min="500"
                    max="8000"
                    step="100"
                    name="delayTime"
                    value={delayTime}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setDelayTime(Number.parseInt(event.target.value));
                    }}
                />
                <button>Change Delay Time</button>
            </form>
        </>
    );
}

export default App;
