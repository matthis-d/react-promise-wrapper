import React from 'react';
import PropTypes from 'prop-types';

class PromisesWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
    this._mounted = false;
  }

  _setupPromises(oldProps) {
    const { mapPromisesToProps } = this.props;

    const oldPromisesMap = this._promisesMap;
    const promisesMap =
      typeof mapPromisesToProps === 'function'
        ? mapPromisesToProps(this.props, oldProps, oldPromisesMap)
        : mapPromisesToProps;

    this._promisesMap = promisesMap;

    const promises = Object.values(promisesMap);
    const oldPromises = oldPromisesMap && Object.values(oldPromisesMap);
    if (
      !oldPromises ||
      promises.length !== oldPromises.length ||
      promises.find((p, i) => p !== oldPromises[i])
    ) {
      if (this._mounted) {
        this.setState({
          loading: true,
        });
      }
      this._promise = Promise.all(Object.values(promisesMap))
        .then(datas => {
          // Ignore results if this request has been superceded
          if (this._mounted && promisesMap === this._promisesMap) {
            const state = Object.keys(promisesMap).reduce(
              (acc, key, index) => ({ ...acc, [key]: datas[index] }),
              {},
            );
            this.setState({
              loading: false,
              error: null,
              ...state,
            });
          }
          return datas;
        })
        .catch(err => {
          this.setState({
            loading: false,
            error: err,
          });
          return err;
        });
    }
    return this._promise || Promise.resolve({});
  }

  componentDidUpdate(oldProps) {
    this._setupPromises(oldProps);
  }

  componentDidMount() {
    this._mounted = true;
    return this._setupPromises();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const { loading, error, ...state } = this.state;
    return this.props.render({ loading, error, ...state });
  }
}

PromisesWrapper.propTypes = {
  mapPromisesToProps: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.func,
  ]),
  render: PropTypes.func.isRequired,
};

PromisesWrapper.defaultProps = {
  mapPromisesToProps: {},
};

export default PromisesWrapper;
