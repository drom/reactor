'use strict';

let React = require('react'),
    update = require('immutability-helper'),
    Form = require('react-jsonschema-form').default,
    DefaultErrorList = require('react-jsonschema-form/lib/components/ErrorList').default,
    {
      getDefaultFormState,
      shouldRender,
      toIdSchema,
      setState,
      getDefaultRegistry
    } = require('react-jsonschema-form/lib/utils'),
    validateFormData = require('react-jsonschema-form/lib/validate').default,
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
                type: 'integer'
            }
        },
        total: {
            type: 'integer',
            title: 'Total',
            minimum: 5,
            maximum: 10
        }
    }
};

var data = {
    bricks: ['3', '3']
};

// React components

function genDerive (_Child) {
    return function Derive (props) {
        var newProps = update(props, {
            appState: {
                formData: {
                    total: {
                        $set: props.appState.formData.bricks
                        .map(e => parseInt(e, 10))
                        .reduce((acc, e) => acc + e, 0)
                    }
                }
            }
        });
        return $(_Child, newProps);
    }
}

function Form1 (props) {
    const {
        appProps, appState, appRegistry, appHandlers
    } = props;

    const {
        children,
        safeRenderCompletion,
        id,
        className,
        name,
        method,
        target,
        action,
        autocomplete,
        enctype,
        acceptcharset,
        noHtml5Validate,
    } = appProps;

    const { schema, uiSchema, formData, errorSchema, idSchema } = appState;
    const _SchemaField = appRegistry.fields.SchemaField;

    return $('form',
      {
        className: className ? className : 'rjsf',
        id: id,
        name: name,
        method: method,
        target: target,
        action: action,
        autoComplete: autocomplete,
        encType: enctype,
        acceptCharset: acceptcharset,
        noValidate: noHtml5Validate,
        onSubmit: appHandlers.onSubmit
      },
      appHandlers.renderErrors(),
      $(_SchemaField, {
        schema: schema,
        uiSchema: uiSchema,
        errorSchema: errorSchema,
        idSchema: idSchema,
        formData: formData,
        onChange: appHandlers.onChange,
        onBlur: appHandlers.onBlur,
        registry: appRegistry,
        safeRenderCompletion: safeRenderCompletion
      })
  );
}

function Bd (props) {
  return $('svg', {
    viewBox: [0, 0, 1024, 1024],
    width: 1024,
    height: 1024
  },
    $('g', {},
      props.data.bricks.map((e, i) =>
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

function Tree (props) {
  return (
      $('div', {className: 'container'},
          $('div', {className: 'col-sm-4', id: 'left'},
              $(Bd, {
                  data: props.appState.formData
              })
          ),
          $('div', {className: 'col-sm-8', id: 'right'},
              $(Form1, props)
          )
      )
  );
}

function re(Master) {

  let Res = class Res extends React.Component {

    constructor(props) {
      super(props);

      this.propTypes = Master.propTypes;
      // this.handleChange = this.handleChange.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onBlur = this.onBlur.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.renderErrors = this.renderErrors.bind(this),
      this.state = this.getStateFromProps(props);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(this.getStateFromProps(nextProps));
    }

    getStateFromProps(props) {
      const state = this.state || {};
      const schema = "schema" in props ? props.schema : this.props.schema;
      const uiSchema = "uiSchema" in props ? props.uiSchema : this.props.uiSchema;
      const edit = typeof props.formData !== "undefined";
      const liveValidate = props.liveValidate || this.props.liveValidate;
      const mustValidate = edit && !props.noValidate && liveValidate;
      const { definitions } = schema;
      const formData = getDefaultFormState(schema, props.formData, definitions);
      const { errors, errorSchema } = mustValidate
        ? this.validate(formData, schema)
        : {
            errors: state.errors || [],
            errorSchema: state.errorSchema || {},
          };
      const idSchema = toIdSchema(
        schema,
        uiSchema["ui:rootFieldId"],
        definitions
      );
      return {
        status: "initial",
        schema,
        uiSchema,
        idSchema,
        formData,
        edit,
        errors,
        errorSchema,
      };
    }

    shouldComponentUpdate(nextProps, nextState) {
      return shouldRender(this, nextProps, nextState);
    }

    validate(formData, schema) {
      const { validate, transformErrors } = this.props;
      return validateFormData(
        formData,
        schema || this.props.schema,
        validate,
        transformErrors
      );
    }

    renderErrors() {
      const { status, errors } = this.state;
      const { ErrorList, showErrorList } = this.props;

      if (status !== "editing" && errors.length && showErrorList != false) {
        return $(ErrorList, { errors: errors });
      }
      return null;
    }

    onChange (formData, options = { validate: false }) {
      const mustValidate =
        !this.props.noValidate && (this.props.liveValidate || options.validate);
      let state = { status: "editing", formData };
      if (mustValidate) {
        const { errors, errorSchema } = this.validate(formData);
        state = update(state, { $merge: { errors, errorSchema }});
      }
      setState(this, state, () => {
        if (this.props.onChange) {
          this.props.onChange(this.state);
        }
      });
    }

    onBlur (...args) {
      if (this.props.onBlur) {
        this.props.onBlur(...args);
      }
    }

    onSubmit (event) {
      event.preventDefault();
      this.setState({ status: "submitted" });

      if (!this.props.noValidate) {
        const { errors, errorSchema } = this.validate(this.state.formData);
        if (Object.keys(errors).length > 0) {
          setState(this, { errors, errorSchema }, () => {
            if (this.props.onError) {
              this.props.onError(errors);
            } else {
              console.error("Form validation failed", errors);
            }
          });
          return;
        }
      }

      if (this.props.onSubmit) {
        this.props.onSubmit(this.state);
      }
      this.setState({ status: "initial", errors: [], errorSchema: {} });
    }

    getRegistry() {
      // For BC, accept passed SchemaField and TitleField props and pass them to
      // the "fields" registry one.
      let { fields, widgets } = getDefaultRegistry();
      let props = this.props;
      Object.assign(fields, props.fields);
      Object.assign(widgets, props.widgets);
      return {
        fields: fields,
        widgets: widgets,
        // fields: { ...fields, ...this.props.fields },
        // widgets: { ...widgets, ...this.props.widgets },
        ArrayFieldTemplate: props.ArrayFieldTemplate,
        FieldTemplate: props.FieldTemplate,
        definitions: props.schema.definitions || {},
        formContext: props.formContext || {},
      };
    }

    render () {
        return $(genDerive(Tree), {
            appProps: this.props,
            appState: this.state,
            appRegistry: this.getRegistry(),
            appHandlers: {
                onSubmit: this.onSubmit,
                onChange: this.onChange,
                onBlur: this.onBlur,
                renderErrors: this.renderErrors
            }
        });
    }
  }

  Res.defaultProps = {
    uiSchema: {},
    noValidate: false,
    liveValidate: false,
    safeRenderCompletion: false,
    noHtml5Validate: false,
    ErrorList: DefaultErrorList,
  };

  return Res;

}

module.exports = function (root) {
  ReactDOM.render(
    $(re(Form), {
      schema: schema,
      formData: data,
      onChange: log('changed'),
      onSubmit: log('submitted'),
      onError: log('errors')
    }), root);
}
