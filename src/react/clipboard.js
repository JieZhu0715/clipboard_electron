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
                <h3>{this.props.focus} : {this.props.text}</h3>
            </div>
        );
    }
}

class ClipList extends React.Component
{
    constructor(props)
    {
        super(props);
        let length = this.props.data.length;
        this.state = {focusedOn: 0, actualSize: length};
        this._handleKeypress = this._handleKeypress.bind(this);
    }

    render()
    {
        let data = this.props.data;
        let focusedOn = this.state.focusedOn;
        let clipItems = data.map(function(item) {
            let index = data.indexOf(item);
            return (
                <ClipItem key={item.index} text={item.text} focus={focusedOn == index}/>
            );
        });

        return (
            <div className="clipList">
                {clipItems}
            </div>
        );
    }

    // Overridden
    // TODO get history items from file
    componentDidMount()
    {
        console.log("Component did mount");
        window.addEventListener("keydown", this._handleKeypress);
    }

    componentWillUnmount()
    {
        console.log("Component will unmount");
        window.removeEventListener("keydown", this._handleKeypress);
    }

    _handleKeypress(event)
    {
        console.log("handle key press event.");
        let focusedOn = this.state.focusedOn;
        let actualSize = this.state.actualSize;

        let x = event.which || event.keyCode;
        if (x == 38) // up
        {
            console.log("Up key pressed");
            if (focusedOn == 0)
            {
                this.props.shift(true);
            }
            else
            {
                focusedOn = focusedOn - 1;
                this.setState({focusedOn: focusedOn, actualSize: this.state.actualSize});
            }
        }
        else if (x == 40) // down
        {
            console.log("Down key pressed")
            if (focusedOn == actualSize - 1)
            {
                this.props.shift(false);
            }
            else
            {
                focusedOn = focusedOn + 1;
                this.setState({focusedOn: focusedOn, actualSize: this.state.actualSize});
            }
        }
    }
}

const MAX_SHOW_SIZE = 10; // we just display 10 in the view

class Clipboard extends React.Component
{
    constructor()
    {   
        super();
        this.state = {data: new CommonStack(), searchText: '', startIndex: 0};
        // React not autobinding in ES6       
        // manually binding
        this.add = this.add.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.shift = this.shift.bind(this);
        this._listenAddMessage();
    }

    add(newText)
    {
        // Add a new item to top
        let size = this.state.data.getSize()
        let stateData = this.state.data;
        stateData.push({index: size, text: newText});

        let startIndex = size - MAX_SHOW_SIZE;

        this.setState({
            data: stateData,
            searchText: '',
            startIndex: startIndex < 0 ? 0 : startIndex
        });
    }

    // handles search event
    handleChange(event) 
    {
        log.info('handleChange function get triggered');
        let searchText = event.target.value;
        this.setState({data: this.state.data, searchText: searchText, startIndex: this.state.startIndex});
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
                return item.index >= startIndex && item.index < (startIndex + MAX_SHOW_SIZE);
            });
        }
        else
        {
            selected = stateData.getArray().filter((item) =>
            {
                return item.text.toLowerCase().includes(searchString);
            }).slice(0, MAX_SHOW_SIZE);
        }
        return (
            <div className="clipboard">
                <SearchBar onChange={this.handleChange}/>
                <ClipList data={selected} shift={this.shift}/>
            </div>
        );
    }

    shift(up)
    {
        let startIndex = this.state.startIndex;
        if (up) //shift up
        {
            startIndex = startIndex + 1;
            this.setState({data: this.state.data, searchText: this.state.searchText, startIndex: startIndex});
        }
        else // shift down
        {
            startIndex = startIndex - 1;
            this.setState({data: this.state.data, searchText: this.state.searchText, startIndex: startIndex});
        }
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