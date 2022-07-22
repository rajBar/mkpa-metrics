import React, {Component} from 'react';
import './Home-style.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    async sendRequest() {}

    render() {
        return (
            <div>
                <h2><a href="https://raj.bar/">raj.Bar</a> / MKPA Metrics</h2>



                <button onClick={() => this.sendRequest()}>Submit</button>
            </div>
        )
    }
}

export default Home;
