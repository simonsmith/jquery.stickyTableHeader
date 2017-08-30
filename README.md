# jquery.stickyTableHeader [![Build Status](https://travis-ci.org/simonsmith/jquery.stickyTableHeader.svg?branch=master)](https://travis-ci.org/simonsmith/jquery.stickyTableHeader)

A small and accessible jQuery plugin for adding sticky headers to large data tables.

## Demo

https://simonsmith.io/jquery.stickyTableHeader/test/

## Features

* Supports multiple tables on one page
* Uses `position: fixed` that allows smooth scrolling and a wide range of browser
  support
* Screenreader support
* Minimal DOM updates in scroll event

## Installation

### npm

It's recommended to `require`/`import` the plugin as part of an existing webpack or browserify setup:

```
npm install jquery jquery-sticky-table-header --save
```

```js
// index.js
const $ = require('jquery');
require('jquery-sticky-table-header');
$('.table-container').stickyTableHeader();
```

Relies on jQuery as a `peerDependency` so ensure it is installed in your
application.

### Manual

Clone the repository and run `npm install && npm run build`. This will generate
a UMD version of the plugin in `./build` that can be dropped into a project
however you want.

```html
<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="jquery.stickyTableHeader.js"></script>
```

## Usage

There are some HTML requirements for the plugin to function correctly:

* The table *must* be inside a containing element
* There *must* be a `thead` element
* There *must* be a `tbody` element

### Example

```html
<div class="table-container">
  <table>
    <thead>
      <!-- content -->
    </thead>
    <tbody>
      <!-- content -->
    </tbody>
  </table>
</div>
```

```js
$('.table-container').stickyTableHeader();
```

It's recommended that you apply a background colour to the header to mask the
real table header beneath it. 

## Options

* **outsideViewportOnly** - _(boolean)_ Only run the plugin if the table is
  larger than the viewport _default_ `true`
* **scrollThrottle** - _(number)_ Maximum number of times the scroll handler
  can be called over time in milliseconds _default_ `50`
* **zIndex** - _(number)_ Added to the header to control stacking _default_ `2`
* **css** _(object)_  Classes applied to the HTML structure
  * **header** _(string)_ - Added to the header that scrolls with the table _default_ `StickyTableHeader`
  * **scrolling** _(string)_ - Added to the header when it is scrolling with the viewport _default_ `is-scrolling`
  * **active** _(string)_ - Added to the original table when plugin is active _default_ `is-stickyTableHeaderActive`

## Development

1. Clone the repository
1. `npm install`
1. `npm start`

Run the tests with `npm test` and view the demo at `http://localhost:3002/test`
