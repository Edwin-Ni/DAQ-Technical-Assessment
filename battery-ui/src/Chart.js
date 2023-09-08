import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Label,
} from "recharts";

export default function Chart({ data }) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 20,
                }}
            >
                <XAxis
                    dataKey=""
                    label={{
                        value: "Past X*500 ms",
                        position: "insideBottom",
                        offset: -10,
                    }}
                />
                <YAxis
                    dataKey="battery_temperature"
                    label={{
                        value: "Temperature (C)",
                        angle: -90,
                        position: "insideLeft",
                    }}
                    domain={[0, 120]}
                    clamp="true"
                />
                <Tooltip />
                <Line
                    type="linear"
                    dataKey="battery_temperature"
                    fill="#8884d8"
                />
                <ReferenceLine y={80} stroke="red" />
                <ReferenceLine y={20} stroke="red" />
            </LineChart>
        </ResponsiveContainer>
    );
}
