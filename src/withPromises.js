import React from 'react';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const withPromises = mapPromisesToProps => WrappedComponent => {
  class WithPromises extends React.Component {
    constructor(props) {
      super(props);
      this.state = { loading: true };
    }

    componentDidMount() {
      return Promise.all(Object.values(mapPromisesToProps))
        .then(datas => {
          const state = Object.keys(mapPromisesToProps).reduce(
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
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  WithPromises.displayName = `withPromises(${getDisplayName(
    WrappedComponent,
  )})`;

  return WithPromises;
};

export default withPromises;
