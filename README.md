# Simple ES6 visual development template

__The goal__: To have a dead simple app template to use for visual development prototypes. Pull a copy, start webpack, and start writing code. Not necessarily intended for production use.

---

## Features
- `zepto` and `lodash` included for convenience
- ES6 transpiling with Babel
- Simple webpack build setup ( _adapted from [wbkd](https://github.com/wbkd/yet-another-webpack-es6-starterkit)'s great setup._ )
- Simple prototypal inheritance
- Base object for common variables, method chaining, and hierarchy management
- Basic SCSS scaffold, including normalize and critical CSS
- Example modules for generic, matrix transform, 2D canvas, THREE.js, and full-page shader (THREE.js).

---

## Install and usage

Ensure you've got [node/npm](https://nodejs.org/en/) installed.

#### 1.
```
npm install
```

#### 2.
```
npm run dev
```

---

#### To make available at your local network IP:
```
npm run host 192.168.X.XXX
```
Where the IP number is your local network IP. Other devices on the same network can then access at `http://192.168.X.XXX:8080`

---

#### When ready for production:
```
npm run build
```
Then you can put the `/dist` directory where you need it

---

## Notes
- Hot reloading is turned *OFF* by default. It can be turned back on in `webpack.config-helper.js` by setting `hot` to `true`.
- Uses `_.create` and `_.assign` rather than native methods for cross-browser support.