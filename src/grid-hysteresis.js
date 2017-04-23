'use strict';

var React = require('react');
var $ = React.createElement;

module.exports = React.createClass({
    displayName: 'grid',
    getInitialState: function () {
        const w0 = window.innerWidth - 2;
        const h0 = window.innerHeight - 2;
        const w1 = w0 & 0xfff0;
        const h1 = h0 & 0xfff0;
        const x0 = (w0 - w1) >> 1;
        const y0 = (h0 - h1) >> 1;
        return { w0: w0, h0: h0, w1: w1, h1: h1, x0: x0, y0: y0 };
    },
    handleResize: function (e) {
        return this.setState(this.getInitialState());
    },
    componentDidMount: function () {
        window.addEventListener('resize', this.handleResize);
    },
    componentWillUnmount: function () {
        window.removeEventListener('resize', this.handleResize);
    },
    render: function () {
        return $('svg', {
            viewBox: [0, 0, this.state.w1, this.state.h1].join(' '),
            width: this.state.w1,
            height: this.state.h1
        },
            $('g', {
              transform: `translate(${this.state.x0},${this.state.y0})`
            },
              Array(10).map(e => $('g', null))
            )
            // TODO actual grid
        );
    }
});
