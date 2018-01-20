import React from 'react';
import { shallow } from 'enzyme';

import withPromises from './withPromises';

describe('withPromises wrapper', () => {
  let WrappedComponent;
  let WithPromisesComponent;
  let wrapper;

  beforeEach(() => {
    WrappedComponent = () => <div />;
  });

  it('should render a PromisesWrapper', () => {
    WithPromisesComponent = withPromises({
      myPromise: Promise.resolve('some data'),
    })(WrappedComponent);

    wrapper = shallow(<WithPromisesComponent />);
    expect(wrapper.find('PromisesWrapper')).toBePresent();
  });
  it('should have withPromises(WrappedName) as display name', () => {
    WrappedComponent.displayName = 'WrappedName';
    WithPromisesComponent = withPromises({})(WrappedComponent);

    expect(WithPromisesComponent.displayName).toEqual(
      'withPromises(WrappedName)',
    );
  });

  it('should have withPromises(WrappedComponent) as display name when no explicit displayName', () => {
    WithPromisesComponent = withPromises({})(WrappedComponent);

    expect(WithPromisesComponent.displayName).toEqual(
      'withPromises(WrappedComponent)',
    );
  });
});
