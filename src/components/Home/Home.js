import React, {Component} from 'react';
import { metricCalulator } from '../../utils/getMetrics';
import './Home-style.css';

class Home extends Component {
    state = {
        selectedFile: null
    };

    // On file select (from the pop up)
    onFileChange = event => {
        // Update the state
        this.setState({ selectedFile: event.target.files[0] });
    };

    getMetrics = () => {
        const csvFile = this.state.selectedFile;
        console.log(csvFile);
        metricCalulator(csvFile);
    }

    // File content to be displayed after
    // file upload is complete
    fileData = () => {
        if (this.state.selectedFile) {

            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {this.state.selectedFile.name}</p>
                    <p>File Type: {this.state.selectedFile.type}</p>
                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose before Pressing the Upload button</h4>
                </div>
            );
        }
    };

    render() {
        return (
            <div>
                <h1>
                    MKPA Metrics
                </h1>
                <h3>
                    Select csv file here
                </h3>
                <div>
                    <input type="file" accept={".csv"} onChange={this.onFileChange} />
                    <button onClick={this.getMetrics}>
                        Get Metrics!
                    </button>
                </div>
                {this.fileData()}
            </div>
        );
    }
}

export default Home;
