import React, { useEffect, useMemo, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import io from "socket.io-client";
import axios from "axios";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SensorData = () => {
    const BACKEND_URI = process.env.REACT_APP_BACKEND_URI;
    const socket = useMemo(() => {
        return io(BACKEND_URI!, {
            reconnection: true,
            reconnectionDelay: 500,
        });
    }, [BACKEND_URI]);

    const [sensorData, setSensorData] = useState<
        { sensor1: string; time: string }[]
    >([]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Line Chart",
            },
        },
    };

    const data = {
        labels: sensorData.map((data) => data.time),
        datasets: [
            {
                label: "Sensor 1",
                data: sensorData.map((data) => Number.parseInt(data.sensor1)),
                borderColor: "#674188",
                backgroundColor: "#c3acd0",
            },
        ],
    };

    useEffect(() => {
        axios({ method: "GET", url: `${BACKEND_URI}/getData` }).then((resp) => {
            setSensorData(resp.data);
        });
    }, [BACKEND_URI]);

    useEffect(() => {
        console.log(sensorData);
    }, [sensorData]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("user connected.");
        });

        socket.on("dataStreamUpdated", (data) => {
            setSensorData(data);
        });

        return () => {
            socket.off("connect");
            socket.off("dataStreamUpdated");
        };
    }, [socket]);

    return (
        <div className="chart">
            <Line options={options} data={data} />
        </div>
    );
};

export default SensorData;
