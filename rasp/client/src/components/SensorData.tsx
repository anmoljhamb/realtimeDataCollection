import React, { useEffect, useMemo } from "react";
import io from "socket.io-client";

const SensorData = () => {
    const BACKEND_URI = process.env.REACT_APP_BACKEND_URI;
    const socket = useMemo(() => {
        return io(BACKEND_URI!, {
            reconnection: true,
            reconnectionDelay: 500,
        });
    }, [BACKEND_URI]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("user connected.");
        });

        socket.on("dataStreamUpdated", (data) => {
            console.log(data);
        });

        return () => {
            socket.off("connect");
            socket.off("dataStreamUpdated");
        };
    }, [socket]);

    return <div>Sensor Data Here</div>;
};

export default SensorData;
