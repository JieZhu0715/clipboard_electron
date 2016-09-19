'use strict';
import React from 'react';
import ReactDom from 'react-dom'
import SearchBar from './searchbar.js';

// React Bootstrap
import {FormGroup, FormControl} from 'react-bootstrap';

const log = electronRequire('electron-log');
const CommonStack = electronRequire('./common/CommonStack.js');

class ClipItem extends React.Component
{
    render() 
    {   
        return (
            <div className="clipItem">
                <h3>{this.props.focused ? '==> ' : '    '} {this.props.text}</h3>
            </div>
        );
    }
}

class ClipList extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {focusedOn: 0};
        this._handleKeypress = this._handleKeypress.bind(this);
    }

    render()
    {
        let data = this.props.data;
        let focusedOn = this.state.focusedOn;
        // focused index can not be out of scope 
        // this should not happen though
        focusedOn = focusedOn < 0 ? 0 : focusedOn < data.length ? focusedOn : data.length - 1;
        let clipItems = data.map(function(item) {
            let index = data.indexOf(item);
            return (
                <ClipItem key={item.index} text={item.text} focused={focusedOn == index}/>
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
        let focusedOn = this.state.focusedOn;
        let actualSize = this.props.data.length;

        let x = event.which || event.keyCode;
        if (x == 38) // up
        {
            console.log("Up key pressed");
            if (focusedOn == 0)
            {
                this.props.shift(true, actualSize);
            }
            else
            {
                focusedOn = focusedOn - 1;
                this.setState({focusedOn: focusedOn});
            }
        }
        else if (x == 40) // down
        {
            console.log("Down key pressed")
            if (focusedOn == actualSize - 1)
            {
                this.props.shift(false, actualSize);
            }
            else
            {
                focusedOn = focusedOn + 1;
                this.setState({focusedOn: focusedOn});
            }
        } 
        else if (x == 13) // Enter
        {
            console.log("Enter pressed");
            let item = this.props.data[focusedOn];

            let ipc = electronRequire('electron').ipcRenderer;
            ipc.send('copy-clipboard-item', item);
        }
    }
}

const MAX_SHOW_SIZE = 10; // we just display 10 in the view

class Clipboard extends React.Component
{
    constructor()
    {   
        super();
        this.state = {data: new CommonStack(), searchText: '', topIndex: -1};
        // React not autobinding in ES6       
        // manually binding
        this.add = this.add.bind(this);
        this.handleChange = this.handleChange.bind(this);
        // this.shift = this.shift.bind(this,); // Use lambda instead
        this._listenAddMessage();
    }

    add(newText)
    {
        // Add a new item to top
        let size = this.state.data.getSize()
        let stateData = this.state.data;
        stateData.push({index: size, text: newText});

        this.setState({
            data: stateData,
            searchText: '',
            topIndex: size
        });
    }

    // handles search event
    handleChange(event) 
    {
        log.info('handleChange function get triggered');
        let searchText = event.target.value;
        this.setState({data: this.state.data, searchText: searchText, topIndex: this.state.data.getSize() - 1});
    }

    // Overridden
    render() {
        let stateData = this.state.data;
        let searchString = this.state.searchText.trim().toLowerCase();
        let topIndex = this.state.topIndex;

        let selected = [];
        if (searchString.length == 0)
        {
            selected = stateData.getArray().filter((item) =>
            {
                return item.index > topIndex - MAX_SHOW_SIZE && item.index <= topIndex;
            });
        }
        else
        {
            selected = stateData.getArray().filter((item) =>
            {
                return item.text.toLowerCase().includes(searchString);
            });
            // Slice MAX_SHOW_SIZE number item starting from top
            selected = selected.slice(1 + topIndex - MAX_SHOW_SIZE, topIndex + 1);
        }
        // shift function uses lambda to avoid binding
        return (
            <div className="clipboard">
                <SearchBar onChange={this.handleChange}/>
                <ClipList data={selected} shift={(up, actualSize) => {this.shift(up, actualSize)}}/> 
            </div>
        );
    }

    shift(up, actualSize)
    {
        let topIndex = this.state.topIndex;
        let dataSize = this.state.data.getSize();
        if (up && topIndex < dataSize - 1) //shift up
        {   
            topIndex = topIndex + 1;
            this.setState({data: this.state.data, searchText: this.state.searchText, topIndex: topIndex});
        }

        if (!up && topIndex >= actualSize)// shift down
        {
            topIndex = topIndex - 1;
            this.setState({data: this.state.data, searchText: this.state.searchText, topIndex: topIndex});
        }
    }

    push(item) 
    { 
        this.state.data.pushElementToTop(element); 
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