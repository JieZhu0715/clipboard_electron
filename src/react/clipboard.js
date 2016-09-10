'use strict';
const React = require("react");
const ReactDom = require("react-dom");

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
                <ClipItem key={item.id} item={item.text} />
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
        this.state = {data: [], count: 0};
        // React not autobinding in ES6       
        // manually binding
        this.add = this.add.bind(this);
        this._listenAddMessage();
    }

    add(newText) 
    {
        // Add a new item to top
        var count = this.state.data.count;
        var newItem = {id: count, text: newText};
        let stateData = this.state.data;
        stateData.unshift(newItem);
        this.setState({data: stateData, count: count + 1});
    }

    // Overridden
    render() {
        return (
            <div className="clipboard">
                <ClipList data={this.state.data} />
            </div>
        );
    }

    // Overridden
    componentDidMount() 
    {
        console.log("Component did mount"); 
    }

    _listenAddMessage() 
    {   
        let ipc = electronRequire('electron').ipcRenderer;
        let log = electronRequire('electron-log');
        ipc.on('add-to-clipboard', (event, arg) => 
        {
            log.info('Receive message from main process: ' + arg);
            this.add(arg);
        });
    }
};

ReactDom.render(<Clipboard />, document.getElementById('content'));