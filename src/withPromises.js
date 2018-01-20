import React from 'react';
import PromisesWrapper from './PromisesWrapper';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const withPromises = mapPromisesToProps => WrappedComponent => {
  const WithPromises = props => (
    <PromisesWrapper
      promisesMap={mapPromisesToProps}
      render={datas => <WrappedComponent {...datas} {...props} />}
    />
  );

  WithPromises.displayName = `withPromises(${getDisplayName(
    WrappedComponent,
  )})`;

  return WithPromises;
};

export default withPromises;
