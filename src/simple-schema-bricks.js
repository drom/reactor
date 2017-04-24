'use strict';

const React = require('react'),
    Form = require('react-jsonschema-form').default,
    ReactDOM = require('react-dom');

const $ = React.createElement;

const log = (type) => console.log.bind(console, type);

const schema = {
    title: "Wall",
    type: "object",
    properties: {
        bricks: {
            type: 'array',
            title: 'Bricks',
            items: {
                type: 'string'
            }
        }
    }
};

var data = {
    bricks: ['a0', 'a1']
};

class Bd extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let blocks = this.props.data;
    return $('svg', {
      viewBox: [0, 0, 1024, 1024],
      width: 1024,
      height: 1024
    },
      $('g', {},
        blocks.map((e, i) =>
          $('g',
            {
              transform: `translate(${100},${i * 100})`,
              key: i
            },
            $('rect', { width: 90, height: 90 })
          )
        )
      )
    );
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.onFormDataChange = this.onFormDataChange.bind(this);
    this.state = {
      data: data.bricks
    }
  }


  onFormDataChange(e) {
    this.setState({ data: e.formData.bricks });
  }

  render() {
    return $('div', {className: 'container-fluid'},
      $('div', {className: 'col-sm-8', id: 'left'},
        $(Bd, { data: this.state.data })
      ),
      $('div', {className: 'col-sm-4', id: 'right'},
        $(Form, {
          schema: schema,
          formData: data,
          onChange: this.onFormDataChange,
          onSubmit: log('submitted'),
          onError: log('errors')
        })
      )
    );
  }
}

module.exports = function (root) {
    ReactDOM.render($(App, {}), root);
}
