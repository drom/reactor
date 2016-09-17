'use strict';

var React = require('react');
var $ = React.createElement;

module.exports = React.createClass({
    displayName: 'grid',
    getInitialState: function () {
        return {
            w: window.innerWidth,
            h: window.innerHeight
        };
    },
    handleResize: function (e) {
        this.setState(this.getInitialState());
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
                this.state.w,
                this.state.h
            ],
            width: this.state.w,
            height: this.state.h
        },
            $('g', null)
            // TODO actual grid
        );
    }
});
