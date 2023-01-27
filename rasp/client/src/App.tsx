import React, { useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";

function App() {
    const BACKEND_URI = process.env.REACT_APP_BACKEND_URI;

    const [requestDataToogle, setRequestDataToogle] = useState<boolean | null>(
        null
    );

    useEffect(() => {
        console.log("Fetching the current status of request data.");
        axios({ method: "GET", url: `${BACKEND_URI}/getRequestData` }).then(
            (resp) => {
                setRequestDataToogle(resp.data);
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

    return (
        <>
            <p>
                Request Data Status:{" "}
                <span>{requestDataToogle ? "true" : "false"}</span>
            </p>
            <button onClick={handleOnClick}>Toogle</button>
        </>
    );
}

export default App;
