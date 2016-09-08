'use strict';
const React = require("react")
const ReactDom = require("react-dom")

var ClipItem = React.createClass({
    render: function() {
        return (
            <div className="clipItem">
                <h3>{this.props.item}</h3>
            </div>
        );
    }
});

var ClipList = React.createClass({
    render: function() {
        var clipItems = this.props.data.map(function(item) {
            return (
                <ClipItem item={item} />
            );
        });

        return (
            <div className="clipList">
                {clipItems}
            </div>
        );
    }
});

var Clipboard = React.createClass({
    // Overridden
    getInitialState: function() {
        // TODO remove test entry
        return {data: ['test, test, test']};
    },

    add: function(newItem) {
        this.state.data.unshift(newItem);
    },

    // Overridden
    render: function() {
        return (
            <div className="clipboard">
                <ClipList data={this.state.data} />
            </div>
        );
    }
});

document.addEventListener("keyup", (event) => {
    let eventObj = event || window.event;
    console.log("Key up: " + eventObj.keyCode);
});

let clipboard_component = ReactDom.render(
    <Clipboard />,
    document.getElementById('content'));

module.exports = clipboard_component;
