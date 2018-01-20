import React from 'react';
import { shallow } from 'enzyme';

import PromisesWrapper from './PromisesWrapper';

describe('withPromises wrapper', () => {
  let WrappedComponent;
  let wrapperBuilder;
  let wrapper;
  let render;
  let promisesMap;

  beforeEach(() => {
    WrappedComponent = () => <div />;
    render = data => <WrappedComponent {...data} />;
    wrapperBuilder = map =>
      shallow(<PromisesWrapper promisesMap={map} render={render} />);
  });

  it('should render the WrappedComponent', () => {
    promisesMap = {
      myPromise: Promise.resolve('some data'),
    };

    wrapper = wrapperBuilder(promisesMap);

    expect(wrapper.find(WrappedComponent)).toBePresent();
  });

  it('should set loading prop to WrappedComponent', () => {
    promisesMap = {
      myPromise: Promise.resolve('some data'),
    };

    wrapper = wrapperBuilder(promisesMap);

    expect(wrapper.find(WrappedComponent)).toHaveProp('loading', true);
  });

  it('should set myPromise prop to WrappedComponent when promise is resolved', async () => {
    const myPromise = Promise.resolve('some data');
    promisesMap = { myPromise };

    wrapper = wrapperBuilder(promisesMap);

    await wrapper.instance().componentDidMount();
    //  State was updated, but not re-rendered yet.
    wrapper.update();

    expect(wrapper.find(WrappedComponent)).toHaveProp('myPromise', 'some data');
    expect(wrapper.find(WrappedComponent)).toHaveProp('loading', false);
  });

  it('should set allPromises into WrappedComponent props when promises are resolved', async () => {
    const myPromise1 = Promise.resolve('some data 1');
    const myPromise2 = Promise.resolve('some data 2');
    const myPromise3 = Promise.resolve('some data 3');
    const myPromise4 = Promise.resolve('some data 4');
    const myPromise5 = Promise.resolve('some data 5');
    promisesMap = {
      myPromise1,
      myPromise2,
      myPromise3,
      myPromise4,
      myPromise5,
    };

    wrapper = wrapperBuilder(promisesMap);

    await wrapper.instance().componentDidMount();
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

  it('should set error field into WrappedComponent props when a promise is rejected', async () => {
    const myPromise1 = Promise.resolve('some data 1');
    const myPromise2 = Promise.resolve('some data 2');
    const myPromise3 = Promise.resolve('some data 3');
    const myPromise4 = Promise.reject('error');
    const myPromise5 = Promise.resolve('some data 5');
    promisesMap = {
      myPromise1,
      myPromise2,
      myPromise3,
      myPromise4,
      myPromise5,
    };

    wrapper = wrapperBuilder(promisesMap);

    try {
      await wrapper.instance().componentDidMount();
    } catch (err) {
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
    }
  });

  it('should set myValue prop to WrappedComponent when it is only a value', async () => {
    const myValue = 'A value';
    promisesMap = { myValue };

    wrapper = wrapperBuilder(promisesMap);

    await wrapper.instance().componentDidMount();

    //  State was updated, but not re-rendered yet.
    wrapper.update();

    expect(wrapper.find(WrappedComponent)).toHaveProp('myValue', 'A value');
    expect(wrapper.find(WrappedComponent)).toHaveProp('loading', false);
  });
});
