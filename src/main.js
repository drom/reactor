'use strict';

var React = require('react'),
    grid = require('./grid'),
    block = require('./clicky-block'),
    ReactDOM = require('react-dom');

var $ = React.createElement;

var width = 100;
var height = 100;
var padding = 10;

var block$ = React.createClass({
    displayName: 'block$',
    getInitialState: function () {
        return { windowWidth: window.innerWidth };
    },
    handleResize: function (e) {
        this.setState({ windowWidth: window.innerWidth });
    },
    componentDidMount: function () {
        window.addEventListener('resize', this.handleResize);
    },
    componentWillUnmount: function () {
        window.removeEventListener('resize', this.handleResize);
    },
    render: function () {
        return $('svg', {
            viewBox: [
                this.state.windowWidth,
                height * this.props.items.length
            ],
            width: this.state.windowWidth,
            height: height * this.props.items.length
        },
        $(block, this.props));
    }
});

ReactDOM.render(
  $(grid, {}),
  // $(block$, { items: [1,2,3] }),
  document.getElementById('root')
);
