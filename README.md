# @banjoanton/utils

[![NPM version](https://img.shields.io/npm/v/@banjoanton/utils?color=%23c53635&label=%20)](https://www.npmjs.com/package/@banjoanton/utils)

A collection of some of my most used JavaScript / TypeScript utility functions.

-   :palm_tree: - Three shakable ESM modules.
-   :speech_balloon: - Fully typed TSDocs with examples
-   :star: - No dependencies
-   :file_folder: - Small size
-   :zap: - Import for node or browser
-   :bookmark: - Own well-tested utilities or imported from large open source projects.

The package is designed to be used as `devDependencies` and bundled into your dist.

## Install

```bash
# npm
npm install @banjoanton/utils -D

# yarn
yarn add @banjoanton/utils -D

#pnpm
pnpm install @banjoanton/utils -D
```

## Import

There are utils specifically for node and a browser environment. The default one can be used in node, but you need to append `browser` to use it in the browser to due dependencies.

```ts
import { isArray, fetchJson } from "@banjoanton/utils";
// or
const { isArray, fetchJson } = require("@banjoanton/utils");
```

## Docs

Auto generated from TSDocs.

<!-- DOCS START -->

### Array

Utility functions for working with arrays.

---

**isEmptyArray**

> Check if the given value is an empty array.

```ts
isEmptyArray([]); // returns true
isEmptyArray([1, 2, 3]); // returns false
```

---

**toArray**

> Convert a single value or array of values into an array.

```ts
toArray(1); // returns [1]
toArray([1, 2, 3]); // returns [1, 2, 3]
```

---

**uniq**

> Remove duplicate values from an array.

```ts
uniq([1, 2, 2, 3, 4, 4]); // returns [1, 2, 3, 4]
uniq(["a", "a", "b", "c"]); // returns ['a', 'b', 'c']
```

---

**last**

> Return the last element of an array.

```ts
last([1, 2, 3]); // returns 3
last(["a", "b", "c"]); // returns 'c'
```

---

**first**

> Return the first element of an array.

```ts
first([1, 2, 3]); // returns 1
first(["a", "b", "c"]); // returns 'a'
```

---

**range**

> Generate an array of numbers in a given range.

```ts
range(5); // returns [0, 1, 2, 3, 4]
range(2, 5); // returns [2, 3, 4]
range(2, 10, 2); // returns [2, 4, 6, 8]
```

---

**move**

> Move an element of an array from one position to another.

```ts
move([1, 2, 3, 4], 0, 2); // returns [2, 3, 1, 4]
move(["a", "b", "c", "d"], 1, 3); // returns ['a', 'c', 'd', 'b']
```

---

**sample**

> Return a random element from an array.

```ts
sample([1, 2, 3, 4]); // returns a random element from the array
sample(["a", "b", "c", "d"]); // returns a random element from the array
```

---

**remove**

> Remove an element from an array.

```ts
remove([1, 2, 3, 4], 2); // returns [1, 3, 4]
remove(["a", "b", "c", "d"], "b"); // returns ['a', 'c', 'd']
```

---

**compact**

> Remove falsy values (`null`, `undefined`, `""`, `0`, `false`, `NaN`) from an array.

```ts
compact([1, 2, 3, 4, 0, null, undefined, false]); // returns [1, 2, 3, 4]
```

---

### Fetch

Utlilties that uses the fetch API to fetch data. Smaller implementations that basically saves time.

---

**fetchJson**

> Fetches a JSON response from a URL. Returns null if the response is not ok.
> Can pass normal fetch options as well as custom options for the wrapper.

```ts
await fetchJson("https://example.com/api");
await fetchJson("https://example.com/api", { throws: true });
await fetchJson("https://example.com/api", { debug: true });
await fetchJson("https://example.com/api", { method: "POST" });
```

---

### Function

Utilities for working with functions.

---

**debounce**

> Created a debounced version of the provided function. The function is a wrapper around the "throttle-debounce" library.

```ts
const debounced = debounce(() => console.log("hello world"), 1000);
debounced(); // logs 'hello world' after 1000ms
debounced(); // does nothing if called within 1000ms of the previous call
```

---

**throttle**

> Created a throttled version of the provided function. The function is a wrapper around the "throttle-debounce" library.

```ts
// invokes the function not more than once per second
const throttled = throttle(() => console.log("hello world"), 1000);
element.addEventListener("mousemove", throttled);

// cancel the throttled function
throttled.cancel();
```

---

### Is

Utility functions for checking the type of a value.

---

**isBoolean**

> Check if the given value is a boolean.

```ts
isBoolean(true); // true
isBoolean("hello world"); // false
```

---

**isNumber**

> Check if the given value is a number.

```ts
isNumber(1); // true
isNumber("hello world"); // false
```

---

**isString**

> Check if the given value is a string.

```ts
isString("hello world"); // true
isString(1); // false
```

---

**isFunction**

> Check if the given value is a function.

```ts
isFunction(() => {}); // true
isFunction("hello world"); // false
isFunction(1); // false
```

---

**isObject**

> Check if the given value is an object.

```ts
isObject({}); // true
isObject("hello world"); // false
isObject(1); // false
```

---

**isDateObject**

> Check if the given value is a Date object. Cannot be used to check if a value is a valid date.

```ts
isDateObject(new Date()); // true
isDateObject("hello world"); // false
isDateObject(1); // false
isDateObject(new Date("hello world")); // true
```

---

**isDate**

> Check if the given value is a valid date. Cannot be used to check if a value is a Date object.
> Can pass strings, numbers, or Date objects. Notice that dates might works differently in different browsers.
> Passing in "1" will return true in Chrome, but false in Firefox.

```ts
isDate(new Date()); // true
isDate("hello world"); // false
isDate(1); // true or false depending on the browser
isDate(new Date("hello world")); // false
isDate("2022-12-24"); // true
```

---

**isRegExp**

> Check if the given value is a RegExp.

```ts
isRegExp(/hello world/); // true
isRegExp("hello world"); // false
isRegExp(1); // false
isRegExp(new RegExp("hello world")); // true
```

---

**isNull**

> Check if the given value is null.

```ts
isNull(null); // true
isNull("hello world"); // false
isNull(1); // false
isNull(undefined); // false
```

---

**isUndefined**

> Check if the given value is undefined.

```ts
isUndefined(undefined); // true
isUndefined("hello world"); // false
isUndefined(1); // false
isUndefined(null); // false
```

---

**isNil**

> Check if the given value is null or undefined.

```ts
isNil(null); // true
isNil(undefined); // true
isNil("hello world"); // false
isNil(1); // false
```

---

**exists**

> Check if the given value exists (is not null or undefined).

```ts
exists(null); // false
exists(undefined); // false
exists("hello world"); // true
exists(1); // true
exists(false); // true
exists([]); // true
```

---

**isPrimitive**

> Check if the given value is a primitive type (string, number, boolean).

```ts
isPrimitive("hello world"); // true
isPrimitive(1); // true
isPrimitive(false); // true
isPrimitive({}); // false
isPrimitive([]); // false
```

---

**isArray**

> Check if the given value is an array.

```ts
isArray([1, 2, 3]); // true
isArray("hello world"); // false
isArray(1); // false
isArray(new Array(1, 2, 3)); // true
```

---

**isElement**

> Check if the value is a DOM element.

```ts
isElement(document.body); // true
isElement("hello world"); // false
```

---

### Object

Utility functions for working with objects. Both wrappers and custom functions.

---

**getProperty**

> Returns the value at path of object. If the resolved value is undefined, the defaultValue is returned in its place. Undefined will be returned if the path is not found or on failure. Wrapper around the "dot-prop" library.

```ts
const obj = { a: { b: { c: "d" } } };

getProperty(obj, "a.b.c"); // => "d"
getProperty(obj, "a.b"); // => { c: "d" }

getProperty({ a: [{ b: "c" }] }, "a[0].b"); // => "c"
getProperty({ a: [{ b: "c" }] }, "a[1].b"); // => undefined
```

---

**hasProperty**

> Checks if object has a property at path. If the resolved value is undefined, false is returned. Wrapper around the "dot-prop" library.

```ts
const obj = { a: { b: { c: "d" } } };
hasProperty(obj, "a.b.c"); // => true
hasProperty(obj, "a.b"); // => true
hasProperty(obj, "a.b.c.d"); // => false
```

---

**deleteProperty**

> Deletes the property at path of object. Wrapper around the "dot-prop" library.

```ts
const obj = { a: { b: { c: "d" } } };

deleteProperty(obj, "a.b.c"); // => true
deleteProperty(obj, "a.b"); // => true
deleteProperty(obj, "a.b.c.d"); // => false
```

---

**objectKeys**

> Strictly typed version of Object.keys. Returns an array of keys of the object.

```ts
const obj = { a: 1, b: 2, c: 3 };
objectKeys(obj); // => ["a", "b", "c"]
objectKeys({}); // => []
```

---

**objectValues**

> Strictly typed version of Object.values. Returns an array of values of the object.

```ts
const obj = { a: 1, b: 2, c: 3 };
objectValues(obj); // => [1, 2, 3]
objectValues({}); // => []
```

---

**objectEntries**

> Strictly typed version of Object.entries. Returns an array of key-value pairs of the object.

```ts
const obj = { a: 1, b: 2, c: 3 };
objectEntries(obj); // => [["a", 1], ["b", 2], ["c", 3]]
objectEntries({}); // => []
```

---

**merge**

> Deeply merges two or more objects. The last object in the arguments list overwrites previous values.

```ts
const obj1 = { a: 1 };
const obj2 = { a: 2 };
merge(obj1, obj2); // => { a: 2 }

const obj1 = { a: { b: 1 } };
const obj2 = { a: { c: 2 } };
merge(obj1, obj2); // => { a: { b: 1, c: 2 } }

const obj1 = { a: { b: 1 } };
const obj2 = { a: { b: 2 } };
const obj3 = { a: { b: 3 } };
merge(obj1, obj2, obj3); // => { a: { b: 3 } }
```

---

### Select

Utility for selecting elements from the DOM. Simplifies the process of working with the DOM.

---

**select**

> Selects a single element from the DOM,
> or returns null if no element is found. Can search a parent as well.
> Can also be used to check if element exists or fetch an array of elements.

```ts
select("#test"); // returns element
select("#test", parent); // returns element if it exists within parent
select.exists("#test"); // returns true if element exists
select.all(".test"); // returns array of elements
```

---

**select.exists**

> Check if an element exists in the DOM. Will default to search in the document.

```ts
select.exists("#test"); // returns true if element exists
select.exists("#test", parent); // returns true if element exists within parent
```

---

**select.all**

> Selects all elements from the DOM as an array, or returns an empty array if no elements are found.
> Can search a parent as well.

```ts
select.all(".test"); // [element1, element2, ...]
select.all(".test", parent); // [element1, element2, ...]
```

---

### String

Utilities for working with strings.

---

**capitalize**

> Capitalizes the first letter of a given string and converts the rest of the letters to lowercase.

```ts
capitalize("hello"); // returns 'Hello'
capitalize("HELLO"); // returns 'Hello'
```

---

**isEmptyString**

> Check if the given value is an empty string.

```ts
isEmptyString(""); // returns true
isEmptyString("hello"); // returns false
```

---

**camelCase**

> Convert a string to camelCase using the "change-case" library.

```ts
camelCase("hello world"); // returns 'helloWorld'
```

---

**pathCase**

> Convert a string to path/case using the "change-case" library.

```ts
pathCase("hello world"); // returns 'hello/world'
```

---

**capitalCase**

> Convert a string to Capital Case using the "change-case" library.

```ts
capitalCase("hello world"); // returns 'Hello World'
```

---

**dotCase**

> Convert a string to dot.case using the "change-case" library.

```ts
dotCase("hello world"); // returns 'hello.world'
```

---

**pascalCase**

> Convert a string to PascalCase using the "change-case" library.

```ts
pascalCase("hello world"); // returns 'HelloWorld'
```

---

**snakeCase**

> Convert a string to snake_case using the "change-case" library.

```ts
snakeCase("hello world"); // returns 'hello_world'
```

---

**randomString**

> Generate a random string with the length provided, defaults to 10.

```ts
randomString(); // returns 'Fwf4552Dd2'
randomString(5); // return 'f5l32'
```

---

**wildcardMatch**

> Check if a string matches a wildcard pattern. Uses the "wildcard-match" library.

```ts
wildcardMatch("/foo/bar", "/foo/*"); // returns true
wildcardMatch("/foo/bar", "/foo/bar"); // returns true
wildcardMatch("/foo/bar", "/foo/bar/*"); // returns false
```

---

<!-- DOCS END -->
