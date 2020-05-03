[![NPM Version](https://badge.fury.io/js/defer-map.svg)](https://badge.fury.io/js/defer-map)
![CI](https://github.com/justinlettau/defer-map/workflows/CI/badge.svg)
[![Dependency Status](https://david-dm.org/justinlettau/defer-map.svg)](https://david-dm.org/justinlettau/defer-map)
[![Dev Dependency Status](https://david-dm.org/justinlettau/defer-map/dev-status.svg)](https://david-dm.org/justinlettau/zure-ad-verify-token?type=dev)
[![Codecov](https://codecov.io/gh/justinlettau/defer-map/branch/master/graph/badge.svg)](https://codecov.io/gh/justinlettau/defer-map)

# Defer Map

A small `Map` wrapper with defer and expiry.

# Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)

# Features

- 💥 Configure **expiry** to auto remove items.
- 🐙 Uses **promises** to defer values.
- 🚀 Drop in replacement for **native `Map`**.
- 💪 Written in **TypeScript**.

# Installation

```bash
npm install defer-map --save
```

# Usage

```ts
import { DeferMap } from 'defer-map';

const expiry = 60 * 60 * 1000; // 1 hours
const map = new DeferMap({ expiry });

map.set('hero', 'Luke Skywalker');
const deferred = map.defer('villain');

console.log(map.size);
// => 2

console.log(await map.get('hero').result);
// => Luke Skywalker

deferred.done('Darth Vadar');

console.log(await map.get('villain').result);
// => Darth Vadar

// ... 1 hour later ....

console.log(map.get('hero'), map.get('villain'));
// => undefined, undefined
```

The `defer-map` API follows the native JS [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), with a few key additions.

The constructor (`new DeferMap()`) takes an optional configuration object with the following properties:

| Property | Type     | Description                                      | Default |
| -------- | -------- | ------------------------------------------------ | ------- |
| `expiry` | `number` | Number of milliseconds before items will expire. | n/a     |

If `expiry` is set, expired items are not instantly removed. If you call `get` with a key for an expired item, it will
be removed and `undefined` will be returned. Alternatively, you can call `cleanup` to remove all expired items.

The `get` method returns an object, instead of the set value directly. The `result` property on the object returned
by `get` is a `Promise` that is resolved with the set value.

# Development

```
npm install
npm run build
```
