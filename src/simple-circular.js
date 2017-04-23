'use strict';

const React = require('react'),
    ReactDOM = require('react-dom');

const $ = React.createElement;

class FairyRing extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            w: window.innerWidth,
            h: window.innerHeight
        };
        this.handleResize = this.handleResize.bind(this);
    }

    getInitialState () {
        return {
            w: window.innerWidth,
            h: window.innerHeight
        };
    }

    handleResize (e) {
        this.setState(this.getInitialState());
    }

    componentDidMount () {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.handleResize);
    }

    render () {
        return $('svg', {
            viewBox: [
                this.state.w,
                this.state.h,
                0,
                0
            ],
            width: this.state.w,
            height: this.state.h
        },
            $('g', null)
            // TODO actual ring
        );
    }
};

module.exports = function (root) {
    ReactDOM.render(
        $(FairyRing, { data: {} }), root
    );
}
