import React, { useState } from 'react';
import ReactJson from 'react-json-view'
import { metricCalulator } from '../../utils/getMetrics';
import './Home-style.css';
import Papa from 'papaparse';

const Home = () => {

    const [allData, setAllData] = useState([]);
    const [showData, setShowData] = useState(false);

    const changeHandler = (event) => {
        setShowData(false);
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        Papa.parse(event.target.files[0], {
            header: true,
            transformHeader: e => e.replace(/\s+/g, '').replace('?', '').replace(',', '').toLowerCase(),
            skipEmptyLines: true,
            complete: async function (results) {
                setAllData(await metricCalulator(results.data));
            },
        });
    };

    return (
        <div>
            <h1>
                MKPA Metrics
            </h1>
            <h3>
                Select csv file here
            </h3>
            <br />
            <div>
                <input
                    type="file"
                    name="file"
                    accept=".csv"
                    onChange={changeHandler}
                />
            </div>
            <br />
            <button onClick={() => setShowData(true)}>Print Data</button>
            <br />
            <div className={"leftAlign"}>
                {showData && allData.length > 0 ?
                    <ReactJson
                        src={allData}
                        theme={"hopscotch"}
                        displayDataTypes={false}
                    />
                    : <p> </p>
                }
            </div>
        </div>
    );
};

export default Home;
