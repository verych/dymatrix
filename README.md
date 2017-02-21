# Dynamic matrix control
### Description:
The control is a realization of mandatory access table using Javascript.
It's absolutely standalone and it doesn't require to include additional libraries.
![example of dynamic matrix control - dymatrix](https://verych.github.io/dymatrix/example.png)
### How to use:
```html
<script type="text/javascript" src="bin/dymatrix.min.js"></script>
```
and then:
```javascript
dymatrix.init(selector, data, settings, onCreatedCallback);
```
### Parameters:
*selector* - jQuery selector to append rendered control into

*data* - init data (see demo source)

*settings* - ```{headerPopup: true|false, cellPopup: true|false}```

*onCreatedCallback* - callback when document is loaded and control is created.


### Demo page:
https://verych.github.io/dymatrix/

### Tested web-browsers:
IE11, Edge, Firefox, Chrome, Safari.

### Tests coverage:
```
Dynamic Matrix Tests
    Level 0 (async) - object creating
      √ Creating matrix object (without container) (316ms)

  Level 1 - structure
    √ Number of created groups
    √ Number of created columns
    √ Number of created rows
    √ Number of created group headers
    √ Number of created bulk actions
    √ Number of created value cells

  Level 2 - values
    √ Initialization
    √ Bulk init state

  Level 3 - behaviour
    √ Simple click (202ms)
    √ Cycle click (587ms)
    √ Bulk click


  12 passing (1s)
  ```
  
### Used technologies:
* node.js
* webpack
* babel
* jquery
* mocha
* chai

see all of them in the package file
