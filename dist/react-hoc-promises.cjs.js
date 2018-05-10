'use strict';

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var React = _interopDefault(require('react'));
var PropTypes = _interopDefault(require('prop-types'));

var asyncGenerator = (function() {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function(resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null,
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(
            function(arg) {
              resume('next', arg);
            },
            function(arg) {
              resume('throw', arg);
            },
          );
        } else {
          settle(result.done ? 'return' : 'normal', result.value);
        }
      } catch (err) {
        settle('throw', err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case 'return':
          front.resolve({
            value: value,
            done: true,
          });
          break;

        case 'throw':
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false,
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== 'function') {
      this.return = undefined;
    }
  }

  if (typeof Symbol === 'function' && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function(arg) {
    return this._invoke('next', arg);
  };

  AsyncGenerator.prototype.throw = function(arg) {
    return this._invoke('throw', arg);
  };

  AsyncGenerator.prototype.return = function(arg) {
    return this._invoke('return', arg);
  };

  return {
    wrap: function(fn) {
      return function() {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function(value) {
      return new AwaitValue(value);
    },
  };
})();

var classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
};

var createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var defineProperty = function(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

var inherits = function(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass,
    );
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
};

var objectWithoutProperties = function(obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  }

  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
};

var PromisesWrapper = (function(_React$Component) {
  inherits(PromisesWrapper, _React$Component);

  function PromisesWrapper(props) {
    classCallCheck(this, PromisesWrapper);

    var _this = possibleConstructorReturn(
      this,
      (
        PromisesWrapper.__proto__ || Object.getPrototypeOf(PromisesWrapper)
      ).call(this, props),
    );

    _this.state = { loading: true };
    _this._mounted = false;
    return _this;
  }

  createClass(PromisesWrapper, [
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        this._mounted = true;
        return Promise.all(Object.values(this.props.promisesMap))
          .then(function(datas) {
            if (_this2._mounted) {
              var state = Object.keys(_this2.props.promisesMap).reduce(function(
                acc,
                key,
                index,
              ) {
                return _extends({}, acc, defineProperty({}, key, datas[index]));
              },
              {});
              _this2.setState(
                _extends(
                  {
                    loading: false,
                    error: null,
                  },
                  state,
                ),
              );
            }
            return datas;
          })
          .catch(function(err) {
            _this2.setState({
              loading: false,
              error: err,
            });
            return err;
          });
      },
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._mounted = false;
      },
    },
    {
      key: 'render',
      value: function render() {
        var _state = this.state,
          loading = _state.loading,
          error = _state.error,
          state = objectWithoutProperties(_state, ['loading', 'error']);

        return this.props.render(
          _extends({ loading: loading, error: error }, state),
        );
      },
    },
  ]);
  return PromisesWrapper;
})(React.Component);

PromisesWrapper.propTypes = {
  promisesMap: PropTypes.shape({}),
  render: PropTypes.func.isRequired,
};

PromisesWrapper.defaultProps = {
  promisesMap: {},
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

var withPromises = function withPromises(mapPromisesToProps) {
  return function(WrappedComponent) {
    var WithPromises = function WithPromises(props) {
      return React.createElement(PromisesWrapper, {
        promisesMap: mapPromisesToProps,
        render: function render(datas) {
          return React.createElement(
            WrappedComponent,
            _extends({}, datas, props),
          );
        },
      });
    };

    WithPromises.displayName =
      'withPromises(' + getDisplayName(WrappedComponent) + ')';

    return WithPromises;
  };
};

module.exports = withPromises;
