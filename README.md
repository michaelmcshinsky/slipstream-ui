<p align="center">
  <a href="https://slipstreamui.com" target="_blank">
    <img src="https://github.com/michaelmcshinsky/slipstream-ui/raw/main/slipstream-banner-2.png" alt="Slipstream UI">
  </a>
</p>
<p align="center">
  Component library combining React and Tailwindcss, built with TypeScript
</p>
<p align="center">
  <a href="https://slipstreamui.com" target="_blank">Documentation</a> | <a href="https://www.npmjs.com/package/slipstream-ui" target="_blank">NPM</a> | <a href="https://github.com/michaelmcshinsky/slipstream-ui" target="_blank">Github</a> | <a href="https://github.com/michaelmcshinsky/slipstream-ui/projects/1" target="_blank">Roadmap</a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/slipstream-ui" target="_blank">
    <img src="https://img.shields.io/npm/v/slipstream-ui?style=flat-square"/>
  </a>
</p>
<hr/>

## Installation

```
npm i slipstream-ui
# or
yarn add slipstream-ui
```

## Usage

Slipstream UI is a wrapper for Tailwindcss as well as a component library built using React. You will first need to add the wrapper to your tailwind.config.js file.

```javascript
const slipstream = require('slipstream-ui/config')

// Tailwind 3.x

module.exports = slipstream({
  content: [
    "./node_modules/slipstream-ui/dist/**/*"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
})
```

You now have access to all Slipstream components inside your React app.

### Example

``` jsx
import { Button } from 'slipstream-ui';

function Example () {
  return (
    <Button>Click me!</Button>
  )
}
```

## License

This project is licensed under the terms of the MIT license.