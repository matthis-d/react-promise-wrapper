import React from 'react';
import { shallow } from 'enzyme';

import withPromises from '../dist/react-hoc-promises';

describe('withPromises wrapper', () => {
  let WrappedComponent;
  let WithPromisesComponent;
  let wrapper;

  beforeEach(() => {
    WrappedComponent = () => <div />;
  });

  it('should contain the WrappedComponent', () => {
    WithPromisesComponent = withPromises({
      myPromise: Promise.resolve('some data'),
    })(WrappedComponent);

    wrapper = shallow(<WithPromisesComponent />);

    expect(wrapper.find(WrappedComponent)).toBePresent();
  });

  it('should set loading prop to WrappedComponent', () => {
    WithPromisesComponent = withPromises({
      myPromise: Promise.resolve('some data'),
    })(WrappedComponent);

    wrapper = shallow(<WithPromisesComponent />);

    expect(wrapper.find(WrappedComponent)).toHaveProp('loading', true);
  });

  it('should set myPromise prop to WrappedComponent when promise is resolved', () => {
    const myPromise = Promise.resolve('some data');
    WithPromisesComponent = withPromises({ myPromise })(WrappedComponent);
    wrapper = shallow(<WithPromisesComponent />);

    return wrapper
      .instance()
      .componentDidMount()
      .then(() => {
        //  State was updated, but not re-rendered yet.
        wrapper.update();

        expect(wrapper.find(WrappedComponent)).toHaveProp(
          'myPromise',
          'some data',
        );
        expect(wrapper.find(WrappedComponent)).toHaveProp('loading', false);
      });
  });

  it('should set allPromises into WrappedComponent props when promises are resolved', () => {
    const myPromise1 = Promise.resolve('some data 1');
    const myPromise2 = Promise.resolve('some data 2');
    const myPromise3 = Promise.resolve('some data 3');
    const myPromise4 = Promise.resolve('some data 4');
    const myPromise5 = Promise.resolve('some data 5');
    WithPromisesComponent = withPromises({
      myPromise1,
      myPromise2,
      myPromise3,
      myPromise4,
      myPromise5,
    })(WrappedComponent);
    wrapper = shallow(<WithPromisesComponent />);

    return wrapper
      .instance()
      .componentDidMount()
      .then(() => {
        //  State was updated, but not re-rendered yet.
        wrapper.update();

        expect(wrapper.find(WrappedComponent)).toHaveProp(
          'myPromise1',
          'some data 1',
        );
        expect(wrapper.find(WrappedComponent)).toHaveProp(
          'myPromise2',
          'some data 2',
        );
        expect(wrapper.find(WrappedComponent)).toHaveProp(
          'myPromise3',
          'some data 3',
        );
        expect(wrapper.find(WrappedComponent)).toHaveProp(
          'myPromise4',
          'some data 4',
        );
        expect(wrapper.find(WrappedComponent)).toHaveProp(
          'myPromise5',
          'some data 5',
        );
        expect(wrapper.find(WrappedComponent)).toHaveProp('loading', false);
      });
  });

  it('should set error field into WrappedComponent props when a promise is rejected', () => {
    const myPromise1 = Promise.resolve('some data 1');
    const myPromise2 = Promise.resolve('some data 2');
    const myPromise3 = Promise.resolve('some data 3');
    const myPromise4 = Promise.reject('error');
    const myPromise5 = Promise.resolve('some data 5');
    WithPromisesComponent = withPromises({
      myPromise1,
      myPromise2,
      myPromise3,
      myPromise4,
      myPromise5,
    })(WrappedComponent);
    wrapper = shallow(<WithPromisesComponent />);

    return wrapper
      .instance()
      .componentDidMount()
      .catch(() => {
        //  State was updated, but not re-rendered yet.
        wrapper.update();

        expect(wrapper.find(WrappedComponent)).not.toHaveProp(
          'myPromise1',
          'some data 1',
        );
        expect(wrapper.find(WrappedComponent)).not.toHaveProp(
          'myPromise2',
          'some data 2',
        );
        expect(wrapper.find(WrappedComponent)).not.toHaveProp(
          'myPromise3',
          'some data 3',
        );
        expect(wrapper.find(WrappedComponent)).not.toHaveProp(
          'myPromise5',
          'some data 5',
        );
        expect(wrapper.find(WrappedComponent)).toHaveProp('loading', false);
        expect(wrapper.find(WrappedComponent)).toHaveProp('error', 'error');
      });
  });

  it('should set myValue prop to WrappedComponent when it is only a value', () => {
    const myValue = 'A value';
    WithPromisesComponent = withPromises({ myValue })(WrappedComponent);
    wrapper = shallow(<WithPromisesComponent />);

    return wrapper
      .instance()
      .componentDidMount()
      .then(() => {
        //  State was updated, but not re-rendered yet.
        wrapper.update();

        expect(wrapper.find(WrappedComponent)).toHaveProp('myValue', 'A value');
        expect(wrapper.find(WrappedComponent)).toHaveProp('loading', false);
      });
  });
});
