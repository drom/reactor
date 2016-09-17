'use strict';
var React = require('react');
var $ = React.createElement;

module.exports = React.createClass({
    displayName: 'block',
    getInitialState: function () {
        return { open: false };
    },
    handleOnClick: function () {
        this.setState({ open: !this.state.open });
    },
    render: function () {
        if (this.props.items.length === 0) {
            return null;
        }
        var h = this.state.open ? height : (height / 2);
        return $('g', null,
            $('rect', {
                onClick: this.handleOnClick,
                x: padding,
                y: padding,
                width: width - 2 * padding,
                height: h - 2 * padding
            }),
            $('g', {
                transform: 'translate(0,' + h + ')'
            },
                $(block, { items: this.props.items.slice(1) })
            )
        );
    }
});
