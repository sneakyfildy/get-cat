import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import './main.css';

class AppContentBody extends React.Component {
    constructor (props){
        super(props);
    }

    render (){
        return (
            <b>Status: {this.props.status}</b>
        );
    }
}

class AppControls extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            inputValue: ''
        }
    }

    onAddClick (e) {
        this.props.afterAddClick(this.state.inputValue);
    }

    handleChange (e) {
        this.setState({ inputValue: e.target.value });
    }

    render (){
        return (
            <div>
                <button className="btn btn-default" onClick={() => this.onAddClick()}>Send</button>
                <input className="add-input" type="text"
                    value={this.state.inputValue}
                    onChange={this.handleChange.bind(this)} />
            </div>
        );
    }
}

class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            status: 'offline'
        };

        setInterval(() => {
            this.setState({
                status: Math.random()
            })
        }, 10000)
    }

    afterAddClick (inputValue) {
        axios.post('/add', {data: inputValue})
            .then(res => {
                console.log(res);
                //this.setState({})
            });
    }

    componentDidMount (){
        this.getRecords();
    }

    componentWillUnmount (){
    }

    getRecords () {
        axios.get('/read')
            .then(res => console.log(res));
    }

    render (){
        return (
            <div>
                <AppControls
                    afterAddClick={(text) => this.afterAddClick(text)}/>
                <AppContentBody status={this.state.status}/>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <App />,
    document.getElementById('index')
);
