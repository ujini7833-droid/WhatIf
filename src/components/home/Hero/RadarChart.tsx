import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart as RechartsRadarChart, ResponsiveContainer } from "recharts";
import './DecisionPreview.css';

const data = [
    {
        subject: '비용',
        강릉: 4,
        춘천: 2,
        부산: 3,
    },

    {
        subject: '볼거리',
        강릉: 3,
        춘천: 4,
        부산: 2,
    },

    {
        subject: '먹거리',
        강릉: 5,
        춘천: 3,
        부산: 4,
    },

    {
        subject: '숙박',
        강릉: 4,
        춘천: 3,
        부산: 5,
    },
];

const RadarChart = () => {
    return (
        <div className="radar-chart">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsRadarChart data={data}>
                    <PolarGrid
                    stroke="rgba(255, 255, 255, 0.2)"
                    />
                    <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                        fill: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 12,
                    }}
                    />

                    <PolarRadiusAxis
                    angle={90}
                    domain={[0,5]}
                    tick={false}
                    axisLine={false}
                    />

                    <Radar
                    name="강릉"
                    dataKey="강릉"
                    stroke="#9B5CFF"
                    fill="#9B5CFF"
                    fillOpacity={0.6}
                    />

                    <Radar
                    name="춘천"
                    dataKey="춘천"
                    stroke="#5C9BFF"
                    fill="#5C9BFF"
                    fillOpacity={0.6}
                    />

                    <Radar
                    name="부산"
                    dataKey="부산"
                    stroke="#FF5C5C"
                    fill="#FF5C5C"
                    fillOpacity={0.6}
                    />

                </RechartsRadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RadarChart;