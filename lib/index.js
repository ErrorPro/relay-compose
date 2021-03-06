'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSubscription = exports.createMutation = exports.refetchContainer = exports.queryRenderer = exports.paginationContainer = exports.fragment = exports.setEnvironment = exports.setEnviroment = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRelay = require('react-relay');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var environment = void 0;

var invariant = function invariant() {
  if (!environment) {
    throw new Error('Relay environment has not been declared.');
  }
};

// leave this one because by the time we found this typo the lib had been installed by many people.
// So to not break peoples' apps just leave this for noe.
var setEnviroment = exports.setEnviroment = function setEnviroment(env) {
  return environment = env;
};
var setEnvironment = exports.setEnvironment = function setEnvironment(env) {
  return environment = env;
};

var fragment = exports.fragment = function fragment(query) {
  return function (Component) {
    return (0, _reactRelay.createFragmentContainer)(function (props) {
      return _react2.default.createElement(Component, props);
    }, query);
  };
};

var paginationContainer = exports.paginationContainer = function paginationContainer(query, connectionConfig) {
  return function (Component) {
    return (0, _reactRelay.createPaginationContainer)(Component, query, connectionConfig);
  };
};

var queryRenderer = exports.queryRenderer = function queryRenderer(rootQuery, variables, LoadingComponent) {
  var loadingComponentProps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return function (Component) {
    var _class, _temp;

    return _temp = _class = function (_React$Component) {
      _inherits(RelayRoot, _React$Component);

      function RelayRoot() {
        _classCallCheck(this, RelayRoot);

        return _possibleConstructorReturn(this, (RelayRoot.__proto__ || Object.getPrototypeOf(RelayRoot)).apply(this, arguments));
      }

      _createClass(RelayRoot, [{
        key: 'render',
        value: function render() {
          var _this2 = this;

          invariant();

          var vars = typeof variables === 'function' ? variables(this.props) : variables;

          return _react2.default.createElement(_reactRelay.QueryRenderer, {
            environment: environment,
            query: rootQuery,
            variables: vars,
            render: function render(_ref) {
              var error = _ref.error,
                  props = _ref.props,
                  retry = _ref.retry;

              if (!props && !error) {
                var toRenderDuringLoading = LoadingComponent ? _react2.default.createElement(LoadingComponent, loadingComponentProps) : null;

                return toRenderDuringLoading;
              }

              return _react2.default.createElement(Component, _extends({}, props, _this2.props, {
                error: error,
                retry: retry
              }));
            }
          });
        }
      }]);

      return RelayRoot;
    }(_react2.default.Component), _class.displayName = 'RelayRoot(' + Component.displayName + ')', _temp;
  };
};

var refetchContainer = exports.refetchContainer = function refetchContainer(renderVariables, query) {
  return function (Component) {
    return (0, _reactRelay.createRefetchContainer)(Component, renderVariables, query);
  };
};

var createMutation = exports.createMutation = function createMutation(mutation, config) {
  return new Promise(function (res, rej) {
    invariant();

    (0, _reactRelay.commitMutation)(environment, _extends({
      mutation: mutation,
      onCompleted: function onCompleted(result, errors) {
        if (errors) {
          return rej(errors);
        }

        res(result);
      },
      onError: rej
    }, config));
  });
};

var createSubscription = exports.createSubscription = function createSubscription(subscription, variables, config) {
  return new Promise(function (res, rej) {
    invariant();

    (0, _reactRelay.requestSubscription)(environment, _extends({
      subscription: subscription,
      variables: variables,
      onCompleted: function onCompleted(result, errors) {
        if (errors) {
          return rej(errors);
        }

        res(result);
      },
      onError: rej
    }, config));
  });
};