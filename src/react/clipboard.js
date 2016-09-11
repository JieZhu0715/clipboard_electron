'use strict';
import React from 'react';
import ReactDom from 'react-dom'
import SearchBar from './searchbar.js';
let log = electronRequire('electron-log');

class ClipItem extends React.Component 
{
    render() 
    {
        return (
            <div className="clipItem">
                <h3>{this.props.item}</h3>
            </div>
        );
    }
}

class ClipList extends React.Component
{
    render() 
    {
        var clipItems = this.props.data.map(function(item) {
            return (
                <ClipItem key={item.index} item={item.text} />
            );
        });

        return (
            <div className="clipList">
                {clipItems}
            </div>
        );
    }
};

class Clipboard extends React.Component
{
    constructor() 
    {   
        super();
        this.state = {data: [], searchText: ''};
        // React not autobinding in ES6       
        // manually binding
        this.add = this.add.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this._listenAddMessage();
    }

    add(newText) 
    {
        // Add a new item to top
        var newItem = {index: this.state.data.length, text: newText};
        let stateData = this.state.data;
        stateData.unshift(newItem);
        this.setState({data: stateData, searchText: ''});
    }

    handleChange(event) 
    {
        log.info('handleChange function get triggered');
        var searchText = event.target.value;
        this.setState({data: this.state.data, searchText: event.target.value})
    }

    // Overridden
    render() {
        let stateData = this.state.data;
        let searchString = this.state.searchText.trim().toLowerCase();

        if (searchString.length > 0) 
        {
            stateData = stateData.filter((item) => 
            {
                return item.text.toLowerCase().includes(searchString);
            });
        }
        return (
            <div className="clipboard">
                <SearchBar onChange={this.handleChange}/>
                <ClipList data={stateData} />
            </div>
        );
    }

    // Overridden 
    // TODO get history items from file
    componentDidMount() 
    {
        console.log("Component did mount"); 
    }

    _listenAddMessage() 
    {   
        let ipc = electronRequire('electron').ipcRenderer;
        ipc.on('add-to-clipboard', (event, args) => 
        {
            log.info('Receive message from main process: ' + args);
            if (args.length > 0) 
            {
                this.add(args[0]);
            }
        });
    }
};

ReactDom.render(<Clipboard />, document.getElementById('content'));