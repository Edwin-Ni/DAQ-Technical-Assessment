import React, { useState, useRef, useEffect } from "react";
import LiveValue from "./live_value";
import RedbackLogo from "./redback_logo.jpg";
import "./App.css";
import Chart from "./Chart.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [temperature, setTemperature] = useState<number>(0);

    type DataItem = {
        battery_temperature: number;
        timestamp: number;
    };

    const [data, setData] = useState<DataItem[]>([]);

    const ws: any = useRef(null);

    useEffect(() => {
        // using the native browser WebSocket object
        const socket: WebSocket = new WebSocket("ws://localhost:8080");

        socket.onopen = () => {
            console.log("opened");
        };

        socket.onclose = () => {
            console.log("closed");
        };
        socket.onmessage = (event) => {
            console.log("got message", event.data);
            console.log(data);
            let message_obj = JSON.parse(event.data);
            setTemperature(message_obj["battery_temperature"].toPrecision(3));
            if (
                message_obj["battery_temperature"] < 200 &&
                message_obj["battery_temperature"] > 0
            ) {
                setData((prevData) => {
                    // Append the new data
                    const updatedData = [...prevData, message_obj];

                    // Filter out items older than 10 seconds
                    return updatedData.filter(
                        (item) => Date.now() - item.timestamp <= 10000
                    );
                });
            } else {
                const date = new Date();
                toast.error(
                    `Potential invalid data: Temp. was ${message_obj["battery_temperature"]}, Timestamp was ${date}`,
                    {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: 0,
                        theme: "dark",
                    }
                );
            }
        };

        ws.current = socket;

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className="App">
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            {/* Same as */}
            <ToastContainer />
            <header className="App-header">
                <img
                    src={RedbackLogo}
                    className="redback-logo"
                    alt="Redback Racing Logo"
                />
                <p className="value-title">Live Battery Temperature</p>
                <LiveValue temp={temperature} />
            </header>
            <Chart data={data} />
        </div>
    );
}

export default App;
