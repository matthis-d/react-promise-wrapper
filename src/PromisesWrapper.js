import React from 'react';
import PropTypes from 'prop-types';

class PromisesWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    return Promise.all(Object.values(this.props.promisesMap))
      .then(datas => {
        const state = Object.keys(this.props.promisesMap).reduce(
          (acc, key, index) => ({ ...acc, [key]: datas[index] }),
          {},
        );
        this.setState({
          loading: false,
          error: null,
          ...state,
        });
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

  render() {
    const { loading, error, ...state } = this.state;
    return this.props.render({ loading, error, ...state });
  }
}

PromisesWrapper.propTypes = {
  promisesMap: PropTypes.shape({}),
  render: PropTypes.func.isRequired,
};

PromisesWrapper.defaultProps = {
  promisesMap: {},
};

export default PromisesWrapper;
