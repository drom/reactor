'use strict';

const React = require('react'),
    Form = require('react-jsonschema-form').default,
    ReactDOM = require('react-dom');

const $ = React.createElement;

const schema = {
    title: "Todo",
    type: "object",
    required: ["title"],
    properties: {
        title: {
            type: 'string',
            title: 'Title',
            default: 'A new task'
        },
        done: {
            type: 'boolean',
            title: 'Done?',
            default: false
        },
        tasks: {
            type: 'array',
            title: 'Tasks',
            items: {
                type: 'string'
            }

        }
    }
};

const log = (type) => console.log.bind(console, type);

module.exports = function (root) {
    ReactDOM.render(
        $(Form, {
            schema: schema,
            onChange: log('changed'),
            onSubmit: log('submitted'),
            onError: log('errors')
        }), root
    );
}
