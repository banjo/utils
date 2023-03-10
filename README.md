# @banjoanton/utils

A collection of some of my most used JavaScript / TypeScript utility functions.

[![NPM version](https://img.shields.io/npm/v/@banjoanton/utils?color=%23c53635&label=%20)](https://www.npmjs.com/package/@banjoanton/utils)

-   :palm_tree: - Three-shakable ESM modules.
-   :speech_balloon: - Fully typed TSDocs with examples
-   :star: - No dependencies
-   :file_folder: - Small size
-   :bookmark: - Own well-tested utilities or imported from large open source projects.

The package is designed to be used as `devDependencies` and bundled into your dist.

## Install

```bash
# npm
npm install @banjoanton/utils -D

# yarn
yarn add @banjoanton/utils -D

# pnpm
pnpm install @banjoanton/utils -D
```

## Import

```ts
import { isArray, fetchJson } from "@banjoanton/utils";
// or
const { isArray, fetchJson } = require("@banjoanton/utils");
```

## Docs

Auto generated from TSDocs.

<!-- DOCS START -->

### Table of Contents

-   [Array](#array)
    -   [toArray](#toArray)
    -   [uniq](#uniq)
    -   [shuffle](#shuffle)
    -   [chunk](#chunk)
    -   [last](#last)
    -   [first](#first)
    -   [range](#range)
    -   [move](#move)
    -   [sample](#sample)
    -   [remove](#remove)
    -   [compact](#compact)
    -   [difference](#difference)
    -   [intersection](#intersection)
    -   [sortBy](#sortBy)
    -   [includes](#includes)
-   [Cache](#cache)
    -   [cache](#cache)
-   [Date](#date)
    -   [getMonths](#getMonths)
    -   [getDays](#getDays)
    -   [toMilliseconds](#toMilliseconds)
    -   [earliest](#earliest)
    -   [latest](#latest)
    -   [isBetweenDates](#isBetweenDates)
-   [Fetch](#fetch)
    -   [fetchJson](#fetchJson)
-   [Function](#function)
    -   [debounce](#debounce)
    -   [throttle](#throttle)
-   [Is](#is)
    -   [isBoolean](#isBoolean)
    -   [isNumber](#isNumber)
    -   [isString](#isString)
    -   [isFunction](#isFunction)
    -   [isObject](#isObject)
    -   [isDateObject](#isDateObject)
    -   [isDate](#isDate)
    -   [isRegExp](#isRegExp)
    -   [isNull](#isNull)
    -   [isUndefined](#isUndefined)
    -   [isNil](#isNil)
    -   [isDefined](#isDefined)
    -   [isPrimitive](#isPrimitive)
    -   [isArray](#isArray)
    -   [isElement](#isElement)
    -   [isEqual](#isEqual)
    -   [isEmpty](#isEmpty)
-   [Object](#object)
    -   [getProperty](#getProperty)
    -   [hasProperty](#hasProperty)
    -   [deleteProperty](#deleteProperty)
    -   [objectKeys](#objectKeys)
    -   [objectValues](#objectValues)
    -   [objectEntries](#objectEntries)
    -   [merge](#merge)
    -   [flip](#flip)
-   [Select](#select)
    -   [select](#select)
    -   [select.exists](#select.exists)
    -   [select.all](#select.all)
-   [String](#string)
    -   [capitalize](#capitalize)
    -   [randomString](#randomString)
    -   [wildcardMatch](#wildcardMatch)
    -   [ensurePrefix](#ensurePrefix)
    -   [ensureSuffix](#ensureSuffix)
    -   [template](#template)
    -   [escapeHtml](#escapeHtml)
    -   [unescapeHtml](#unescapeHtml)
    -   [escapeRegExp](#escapeRegExp)
    -   [slugify](#slugify)
    -   [truncate](#truncate)

### Array

Utility functions for working with arrays.

---

#### toArray

> Convert a single value or array of values into an array.

```ts
toArray(1); // returns [1]
toArray([1, 2, 3]); // returns [1, 2, 3]
```

---

#### uniq

> Remove duplicate values from an array.

```ts
uniq([1, 2, 2, 3, 4, 4]); // returns [1, 2, 3, 4]
uniq(["a", "a", "b", "c"]); // returns ['a', 'b', 'c']
```

---

#### shuffle

> Shuffle the elements of an array. Creates a new array with the elements of the original array in a random order.

```ts
shuffle([1, 2, 3, 4, 5]); // returns [2, 4, 1, 5, 3]
shuffle(["a", "b", "c", "d", "e"]); // returns ['b', 'd', 'a', 'e', 'c']
```

---

#### chunk

> Create a chunk of an array. A chunk is a new array containing a specified number of elements from the original array.

```ts
chunk([1, 2, 3, 4, 5], 2); // returns [[1, 2], [3, 4], [5]]
chunk(["a", "b", "c", "d", "e"], 3); // returns [['a', 'b', 'c'], ['d', 'e']]
chunk([1, 2, 3, 4, 5], 10); // returns [[1, 2, 3, 4, 5]]
chunk([1, 2, 3, 4, 5], 1); // returns [[1], [2], [3], [4], [5]]
chunk([1, 2, 3, 4, 5], 0); // returns []
```

---

#### last

> Return the last element of an array.

```ts
last([1, 2, 3]); // returns 3
last(["a", "b", "c"]); // returns 'c'
```

---

#### first

> Return the first element of an array.

```ts
first([1, 2, 3]); // returns 1
first(["a", "b", "c"]); // returns 'a'
```

---

#### range

> Generate an array of numbers in a given range.

```ts
range(5); // returns [0, 1, 2, 3, 4]
range(2, 5); // returns [2, 3, 4]
range(2, 10, 2); // returns [2, 4, 6, 8]
```

---

#### move

> Move an element of an array from one position to another.

```ts
move([1, 2, 3, 4], 0, 2); // returns [2, 3, 1, 4]
move(["a", "b", "c", "d"], 1, 3); // returns ['a', 'c', 'd', 'b']
```

---

#### sample

> Return a random element from an array.

```ts
sample([1, 2, 3, 4]); // returns a random element from the array
sample(["a", "b", "c", "d"]); // returns a random element from the array
```

---

#### remove

> Remove an element from an array.

```ts
remove([1, 2, 3, 4], 2); // returns [1, 3, 4]
remove(["a", "b", "c", "d"], "b"); // returns ['a', 'c', 'd']
```

---

#### compact

> Remove falsy values (`null`, `undefined`, `""`, `0`, `false`, `NaN`) from an array.

```ts
compact([1, 2, 3, 4, 0, null, undefined, false]); // returns [1, 2, 3, 4]
```

---

#### difference

> Return the difference between two arrays. Objects are compared by value, meaning that two objects with the same properties will be considered equal. Can also take a custom comparator function.

```ts
// primitives are compared by value
difference([1, 2, 3, 4], [2, 4]); // returns [1, 3]
difference(["a", "b", "c", "d"], ["b", "d"]); // returns ['a', 'c']

// objects are also compared by value by default
const obj = {};
difference([obj], [obj]); // returns []
difference([{ a: 1 }], [{ a: 1 }]); // returns []
difference([{ a: 1 }], [{ a: 2 }]); // returns [{ a: 1 }, { a: 2 }]

// custom comparator
const comparator = (a: any, b: any) => a === b;
difference([1, 2, 3, 4], [2, 4], comparator); // returns [1, 3]
difference(["a", "b", "c", "d"], ["b", "d"], comparator); // returns ['a', 'c']
```

---

#### intersection

> Return the intersection between two arrays. Objects are compared by value, meaning that two objects with the same properties will be considered equal. Can also take a custom comparator function.

```ts
// primitives are compared by value
intersection([1, 2, 3, 4], [2, 4]); // returns [2, 4]
intersection(["a", "b", "c", "d"], ["b", "d"]); // returns ['b', 'd']
intersection([1, 2, 3, 4], [2, 4, 5]); // returns [2, 4]

// objects are also compared by value by default
const obj = {};
intersection([obj], [obj]); // returns [obj]
intersection([{ a: 1 }], [{ a: 1 }]); // returns [{ a: 1 }]
intersection([{ a: 1 }], [{ a: 2 }]); // returns []

// custom comparator
const comparator = (a: any, b: any) => a === b;
intersection([1, 2, 3, 4], [2, 4], comparator); // returns [2, 4]
intersection(["a", "b", "c", "d"], ["b", "d"], comparator); // returns ['b', 'd']
```

---

#### sortBy

> Sort an array. Can sort by a single key or multiple keys. Can also take a custom function that receives the item to choose the value to sort by.

```ts
const a = { name: "Alex", age: 20 };
const b = { name: "Alex", age: 15 };
const c = { name: "Bony", age: 5 };

// sort by a single key
sortBy([a, b, c], "name"); // returns [a, b, c]
sortBy([a, b, c], "age"); // returns [c, b, a]

// sort by multiple keys
sortBy([a, b, c], ["name", "age"]); // returns [b, a, c]

// sort by a custom function
sortBy([a, b, c], item => item.name); // returns [a, b, c]
sortBy([a, b, c], item => item.age); // returns [c, b, a]
```

---

#### includes

> Type guard to check if a value is included in an array. Useful for filtering arrays.

```ts
const values = ["a", "b", "c"] as const;
const valueToCheck: unknown = "a";

includes(values, valueToCheck); // returns true

if (includes(values, valueToCheck)) {
    // valueToCheck is now of type "a" | "b" | "c"
}
```

---

### Cache

Cache utility.

---

#### cache

> Creates a super simple cache with expiration and support for persistance. Can be used with strings and symbols as key. Is generic and can be used with any type.

```ts
const { get, set, has, delete, clear } = cache();

set("key", "value");
get("key"); // "value"
has("key"); // true
delete("key"); // true
clear();

// can be used with generics
const cache = cache<string>();

// can be used with symbols
const cache = cache();
const key = Symbol("key");
cache.set(key, "value");

// can be be persisted in local storage
const cache = cache({ persistant: true });

// can be be persisted in local storage with a custom key
const cache = cache({ persistant: true, key: "my-cache" });

// custom expiration time in ms
const cache = cache({ expires: 1000 });

```

---

### Date

Utility functions for date and time.

---

#### getMonths

> Returns an array of month names. The array is zero-based, so the first month is January.

```ts
getMonths(); // returns ['January', 'February', ...]
getMonths({ month: "short" }); // returns ['Jan', 'Feb', ...]
getMonths({ month: "narrow" }); // returns ['J', 'F', ...]
getMonths({ month: "numeric" }); // returns ['1', '2', ...]

getMonths({ locales: "fr-FR" }); // returns ['janvier', 'f??vrier', ...]
getMonths({ locales: "sv-SE" }); // returns ['januari', 'februari', ...]
```

---

#### getDays

> Returns an array of day names. The array is zero-based. The first day is Monday by default.

```ts
getDays(); // returns ['Monday', 'Tuesday', ...]
getDays({ day: "short" }); // returns ['Mon', 'Tue', ...]
getDays({ day: "narrow" }); // returns ['M', 'T', ...]
getDays({ startOnMonday: false }); // returns ['Sunday', 'Monday', ...]

getDays({ locales: "fr-FR" }); // returns ['lundi', 'mardi', ...]
getDays({ locales: "sv-SE" }); // returns ['m??ndag', 'tisdag', ...]
getDays({ locales: "sv-SE", startOnMonday: false }); // returns ['s??ndag', 'm??ndag', ...]
```

---

#### toMilliseconds

> Converts a time unit to milliseconds. Combined all units to get the total time in milliseconds.

```ts
toMilliseconds({ seconds: 10 }); // returns 10000
toMilliseconds({ minutes: 10 }); // returns 600000
toMilliseconds({ hours: 10 }); // returns 36000000

toMilliseconds({ seconds: 10, minutes: 10 }); // returns 610000
toMilliseconds({ seconds: 10, minutes: 10, hours: 10 }); // returns 3610000
```

---

#### earliest

> Returns the earliest date in an array of dates.

```ts
earliest([...dates]);

const earlyDate = new Date(2020, 0, 1);
const lateDate = new Date(2020, 0, 2);

earliest([earlyDate, lateDate]); // returns earlyDate
```

---

#### latest

> Returns the latest date in an array of dates.

```ts
latest([...dates]);

const earlyDate = new Date(2020, 0, 1);
const lateDate = new Date(2020, 0, 2);

latest([earlyDate, lateDate]); // returns lateDate
```

---

#### isBetweenDates

> Returns true if a date is between two other dates.

```ts
isBetweenDates([...dates]);

const earlyDate = new Date(2020, 0, 1);
const dateInBetween = new Date(2020, 0, 2);
const lateDate = new Date(2020, 0, 3);

isBetweenDates(dateInBetween, earlyDate, lateDate); // returns true
```

---

### Fetch

Utlilties that uses the fetch API to fetch data. Smaller implementations that basically saves time.

---

#### fetchJson

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

#### debounce

> Created a debounced version of the provided function. The function is a wrapper around the "throttle-debounce" library.

```ts
const debounced = debounce(() => console.log("hello world"), 1000);
debounced(); // logs 'hello world' after 1000ms
debounced(); // does nothing if called within 1000ms of the previous call
```

---

#### throttle

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

#### isBoolean

> Check if the given value is a boolean.

```ts
isBoolean(true); // true
isBoolean("hello world"); // false
```

---

#### isNumber

> Check if the given value is a number.

```ts
isNumber(1); // true
isNumber("hello world"); // false
```

---

#### isString

> Check if the given value is a string.

```ts
isString("hello world"); // true
isString(1); // false
```

---

#### isFunction

> Check if the given value is a function.

```ts
isFunction(() => {}); // true
isFunction("hello world"); // false
isFunction(1); // false
```

---

#### isObject

> Check if the given value is an object.

```ts
isObject({}); // true
isObject("hello world"); // false
isObject(1); // false
```

---

#### isDateObject

> Check if the given value is a Date object. Cannot be used to check if a value is a valid date.

```ts
isDateObject(new Date()); // true
isDateObject("hello world"); // false
isDateObject(1); // false
isDateObject(new Date("hello world")); // true
```

---

#### isDate

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

#### isRegExp

> Check if the given value is a RegExp.

```ts
isRegExp(/hello world/); // true
isRegExp("hello world"); // false
isRegExp(1); // false
isRegExp(new RegExp("hello world")); // true
```

---

#### isNull

> Check if the given value is null.

```ts
isNull(null); // true
isNull("hello world"); // false
isNull(1); // false
isNull(undefined); // false
```

---

#### isUndefined

> Check if the given value is undefined.

```ts
isUndefined(undefined); // true
isUndefined("hello world"); // false
isUndefined(1); // false
isUndefined(null); // false
```

---

#### isNil

> Check if the given value is null or undefined.

```ts
isNil(null); // true
isNil(undefined); // true
isNil("hello world"); // false
isNil(1); // false
```

---

#### isDefined

> Check if the given value exists (is not null or undefined). Also type guards against null and undefined. Previously named `exists`.

```ts
isDefined(null); // false
isDefined(undefined); // false
isDefined("hello world"); // true
isDefined(1); // true
isDefined(false); // true
isDefined([]); // true
```

---

#### isPrimitive

> Check if the given value is a primitive type (string, number, boolean).

```ts
isPrimitive("hello world"); // true
isPrimitive(1); // true
isPrimitive(false); // true
isPrimitive({}); // false
isPrimitive([]); // false
```

---

#### isArray

> Check if the given value is an array.

```ts
isArray([1, 2, 3]); // true
isArray("hello world"); // false
isArray(1); // false
isArray(new Array(1, 2, 3)); // true
```

---

#### isElement

> Check if the value is a DOM element.

```ts
isElement(document.body); // true
isElement("hello world"); // false
```

---

#### isEqual

> Check whether the two values are equal. Uses the fast-deep-equal package. Works with all types.

```ts
isEqual(1, 1); // true
isEqual(1, 2); // false
isEqual("hello", "hello"); // true
isEqual(null, undefined); // false
isEqual({ a: 1 }, { a: 1 }); // true
isEqual({ a: 1 }, { a: 2 }); // false
isEqual([1, 2, 3], [1, 2, 3]); // true
```

---

#### isEmpty

> Check if the given value is empty. Works with strings, arrays, objects, and maps. Trims strings before checking.

```ts
isEmpty(""); // true
isEmpty(" "); // true
isEmpty("hello world"); // false
isEmpty(1); // false
isEmpty([]); // true
isEmpty([1, 2, 3]); // false
isEmpty({}); // true
isEmpty({ a: 1 }); // false
isEmpty(new Map()); // true
isEmpty(new Map([["a", 1]])); // false
```

---

### Object

Utility functions for working with objects. Both wrappers and custom functions.

---

#### getProperty

> Returns the value at path of object. If the resolved value is undefined, the defaultValue is returned in its place. Undefined will be returned if the path is not found or on failure. Wrapper around the "dot-prop" library.

```ts
const obj = { a: { b: { c: "d" } } };

getProperty(obj, "a.b.c"); // => "d"
getProperty(obj, "a.b"); // => { c: "d" }

getProperty({ a: [{ b: "c" }] }, "a[0].b"); // => "c"
getProperty({ a: [{ b: "c" }] }, "a[1].b"); // => undefined
```

---

#### hasProperty

> Checks if object has a property at path. If the resolved value is undefined, false is returned. Wrapper around the "dot-prop" library.

```ts
const obj = { a: { b: { c: "d" } } };
hasProperty(obj, "a.b.c"); // => true
hasProperty(obj, "a.b"); // => true
hasProperty(obj, "a.b.c.d"); // => false
```

---

#### deleteProperty

> Deletes the property at path of object. Wrapper around the "dot-prop" library.

```ts
const obj = { a: { b: { c: "d" } } };

deleteProperty(obj, "a.b.c"); // => true
deleteProperty(obj, "a.b"); // => true
deleteProperty(obj, "a.b.c.d"); // => false
```

---

#### objectKeys

> Strictly typed version of Object.keys. Returns an array of keys of the object.

```ts
const obj = { a: 1, b: 2, c: 3 };
objectKeys(obj); // => ["a", "b", "c"]
objectKeys({}); // => []
```

---

#### objectValues

> Strictly typed version of Object.values. Returns an array of values of the object.

```ts
const obj = { a: 1, b: 2, c: 3 };
objectValues(obj); // => [1, 2, 3]
objectValues({}); // => []
```

---

#### objectEntries

> Strictly typed version of Object.entries. Returns an array of key-value pairs of the object.

```ts
const obj = { a: 1, b: 2, c: 3 };
objectEntries(obj); // => [["a", 1], ["b", 2], ["c", 3]]
objectEntries({}); // => []
```

---

#### merge

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

#### flip

> Flips the keys and values of an object. If the object has duplicate values, the last key will be used.

```ts
const obj = { a: 1, b: 2, c: 3 };
flip(obj); // => { 1: "a", 2: "b", 3: "c" }
```

---

### Select

Utility for selecting elements from the DOM. Simplifies the process of working with the DOM.

---

#### select

> Selects a single element from the DOM,
> or returns null if no element is found. Can search a parent as well.
> Can also be used to check if element exists or fetch an array of elements.

```ts
select("#test"); // returns element
select("#test", parent); // returns element if it exists within parent
select.exists("#test"); // returns true if element exists
select.all(".test"); // returns array of elements
select.style(element, { color: "red" }); // sets the color of the element to red
```

---

#### select.exists

> Check if an element exists in the DOM. Will default to search in the document.

```ts
select.exists("#test"); // returns true if element exists
select.exists("#test", parent); // returns true if element exists within parent
```

---

#### select.all

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

#### capitalize

> Capitalizes the first letter of a given string and converts the rest of the letters to lowercase.

```ts
capitalize("hello"); // returns 'Hello'
capitalize("HELLO"); // returns 'Hello'
```

---

#### randomString

> Generate a random string with the length provided, defaults to 16.

```ts
randomString(); // returns 'Fwf4552Dd2'
randomString(5); // return 'f5l32'
```

---

#### wildcardMatch

> Check if a string matches a wildcard pattern. Uses the "wildcard-match" library.

```ts
wildcardMatch("/foo/bar", "/foo/*"); // returns true
wildcardMatch("/foo/bar", "/foo/bar"); // returns true
wildcardMatch("/foo/bar", "/foo/bar/*"); // returns false
```

---

#### ensurePrefix

> Ensure a string starts with a given prefix.

```ts
ensurePrefix("hello", "foo"); // returns 'foohello'
ensurePrefix("foohello", "foo"); // returns 'foohello'
ensurePrefix("hello", "hello"); // returns 'hello'
```

---

#### ensureSuffix

> Ensure a string ends with a given suffix.

```ts
ensureSuffix("hello", "foo"); // returns 'hellofoo'
ensureSuffix("hellofoo", "foo"); // returns 'hellofoo'
ensureSuffix("hello", "hello"); // returns 'hello'
```

---

#### template

> Simple templating function that replaces {0}, {1} or {{key}} with the provided arguments.

```ts
template("hello {0}", "world"); // returns 'hello world'
template("hello {0} {1}", "world", "foo"); // returns 'hello world foo'
template("hello {0} {1}", "world"); // returns 'hello world {1}'

template("hello {{name}}", { name: "world" }); // returns 'hello world'
template("hello {{name}}, I am {{me}}", { name: "world", me: "Kent" }); // returns 'hello world, I am Kent'
template("hello {{name}}", { name: "world", foo: "bar" }); // returns 'hello world'
template("hello {{name}}", { foo: "bar" }); // returns 'hello {{name}}'
```

---

#### escapeHtml

> Escape HTML special characters.

```ts
escapeHtml("<div>hello</div>"); // returns '&lt;div&gt;hello&lt;/div&gt;'
```

---

#### unescapeHtml

> Unescape HTML special characters. Opposite of escapeHtml.

```ts
unescapeHtml("&lt;div&gt;hello&lt;/div&gt;"); // returns '<div>hello</div>'
```

---

#### escapeRegExp

> Escape RegExp special characters.

```ts
escapeRegExp("hello world"); // returns 'hello world'
escapeRegExp("hello*world"); // returns 'hello\\*world'
escapeRegExp("hello?world"); // returns 'hello\\?world'
escapeRegExp("hello(world"); // returns 'hello\\(world'
```

---

#### slugify

> Slugify a string. Converts a string to lowercase, removes non-word characters and replaces spaces with dashes.

```ts
slugify("hello world"); // returns 'hello-world'
slugify("hello world!"); // returns 'hello-world'
slugify(""); // returns ''
slugify("This is a long sentence that should be slugified!!"); // returns 'this-is-a-long-sentence-that-should-be-slugified'
```

---

#### truncate

> Truncate a string to a given length. Adds an ellipsis to the end of the string if it was truncated.

```ts
truncate("hello world", 5); // returns 'hello...'
truncate("hello world", 5, "...more"); // returns 'hello...more'
truncate("hello world", 100); // returns 'hello world'
truncate("hello world", 5, ""); // returns 'hello'
truncate("hello world", 5, "..."); // returns 'hello...'
```

---

<!-- DOCS END -->
