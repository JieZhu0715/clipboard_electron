'use strict';
import React from 'react';
import ReactDom from 'react-dom'
import SearchBar from './searchbar.js';

const log = electronRequire('electron-log');
const CommonStack = electronRequire('./common/CommonStack.js');


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

const MAX_SHOW_SIZE = 10; // we just display 10 in the view

class Clipboard extends React.Component
{
    constructor()
    {   
        super();
        this.state = {data: new CommonStack(), searchText: '', startIndex: 0, size: 0};
        // React not autobinding in ES6       
        // manually binding
        this.add = this.add.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this._listenAddMessage();
    }

    static MAX_SHOW_SIZE()
    {
        return MAX_SHOW_SIZE;
    }

    add(newText) 
    {
        // Add a new item to top
        var newItem = {index: this.state.data.getSize(), text: newText};
        let stateData = this.state.data;
        // stateData.unshift(newItem);
        stateData.push(newItem)
        this.setState({data: stateData, searchText: '', startIndex: this.state.startIndex, size: this.state.size + 1});
    }

    // handles search event
    handleChange(event) 
    {
        log.info('handleChange function get triggered');
        let searchText = event.target.value;
        this.setState({data: this.state.data, searchText: searchText, startIndex: this.state.startIndex, size: this.state.size});
    }

    // Overridden
    render() {
        let stateData = this.state.data;
        let searchString = this.state.searchText.trim().toLowerCase();
        let startIndex = this.state.startIndex;
        let selected = [];

        if (searchString.length == 0)
        {
            selected = stateData.getArray().filter((item) =>
            {
                return item.index >= startIndex && item.index < startIndex + Clipboard.MAX_SHOW_SIZE;
            });
        }
        else
        {
            selected = stateData.getArray().filter((item) =>
            {
                return item.text.toLowerCase().includes(searchString);
            });
        }
        return (
            <div className="clipboard">
                <SearchBar onChange={this.handleChange}/>
                <ClipList data={selected} />
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