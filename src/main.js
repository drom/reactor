'use strict';

var React = require('react'),
    ReactDOM = require('react-dom');

var $ = React.createElement;

var width = 100;
var height = 100;
var padding = 10;

var block = React.createClass({
  displayName: 'block',
  getInitialState: function () {
    return { height: 100 };
  },
  handleOnClick: function () {
    this.setState({ height: this.state.height - 10 });
  },
  render: function () {
    return $('rect', {
      onClick: this.handleOnClick,
      x: padding,
      y: padding,
      width: width - 2 * padding,
      height: this.state.height - 2 * padding
    });
  }
});

var createItem = function (item$) {
  if (item$.length) {
    return $('g', null,
      $(block, null),
      $('g', { transform: 'translate(0,100)' },
        createItem(item$.slice(1))
      )
    );
  }
  return null;
};

var block$ = React.createClass({
  displayName: 'block$',
  render: function () {
    return $('svg', {
        viewBox: [width, height * this.props.items.length],
        width: width,
        height: height * this.props.items.length
      },
      createItem(this.props.items)
    );
  }
});

ReactDOM.render(
  $(block$, { items: [1,2,3] }),
  document.getElementById('root')
);
