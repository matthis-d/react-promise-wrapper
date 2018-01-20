# React promise wrapper.

[![Build Status](https://travis-ci.org/matthis-d/react-promise-wrapper.svg?branch=master)](https://travis-ci.org/matthis-d/react-promise-wrapper)
## Usage

Install via NPM or Yarn
```
npm install --save react-promise-wrapper
````

```
yarn add react-promise-wrapper
```

Write a component that will receive several props :
- `loading`: a boolean to indicate if promises are done.
- `error`: an error thrown if any of the promises fails
- Your promises names.

```js
// MyComponent.js

const MyComponent = ({ loading, error, promiseData, anotherPromise }) => {
  if (loading) {
    return <span>Loading...</span>
  }

  if (error) {
    return <span>Oups! Something went wrong</span>
  }

  return <div>
    <span>{promiseData.id}</span>
    <span>{anotherPromise}</span>
  </div>
}
```

### Use `withPromises` higher order component

Then write a wrapper that will inject the promises thanks to the `withPromises` helper.

`withPromises` take an object as a first argument. This object's keys are the name of the props that will be injected into the wrapped component and their values are the promises that are to be resolved.

```js
// WithPromiseComponent.js

// import the lib
import { withpromises } from 'react-promise-wrapper';

// import your component
import MyComponent from './MyComponent';

const WrappedComponent = withPromises({
  // `promiseData` will be injected as prop into MyComponent
  // when all promises will be resolved.
  promiseData: fetch('/data').then(res => res.json()),

  // Same for `anotherPromiseData`
  anotherPromiseData: Promise.resolve('random data'),
})(MyComponent);
```

### Use `PromisesWrapper`component

You can also use the `PromisesWrapper`component.

This component awaits 2 props:
- `render`: a function that returns the component to render. This function has one argument : an object filled with the follwing properties: 
  - `loading`: a boolean to indicate if promises are done.
  - `error`: an error thrown if any of the promises fails
  - Your promises names and the resolved datas.
- `promisesMap`: an object containing the promises names and the function to execute to get the data.

Example: 

```js
// WithPromiseComponent.js

// import the lib
import PromisesWrapper from 'react-promise-wrapper';
// import your component
import MyComponent from './MyComponent';

const WrappedComponent = <PromisesWrapper
  promisesMap={{
  // `promiseData` will be injected as prop into MyComponent
  // when all promises will be resolved.
    promiseData: fetch('/data').then(res => res.json())
  
    // Same for `anotherPromiseData`
    anotherPromiseData: Promise.resolve('random data'),
  }}
  render={
    ({loading, error, promiseData, anotherPromiseData}) =>
      <MyComponent
        loading={loading}
        error={error}
        promiseData={promiseData}
        anotherPromiseData={anotherPromiseData}
      />}
    )
  }
/>;
```