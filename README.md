# @banjoanton/utils

A collection of some of my most used JavaScript / TypeScript utility functions.

-   :palm_tree: - Three shakable ESM modules.
-   :speech_balloon: - Fully typed TSDocs with examples
-   :star: - No dependencies
-   :file_folder: - Small size
-   :bookmark: - Own well-tested utilities or imported from large open source projects.

The package is designed to be used as `devDependencies` and bundled into your dist.

## Docs

> Auto generated from TSDocs

<!-- DOCS START -->

### isEmptyArray

Check if the given value is an empty array.

```ts
isEmptyArray([]); // returns true
isEmptyArray([1, 2, 3]); // returns false
```

#### Params

| Name  | Description         |
| ----- | ------------------- |
| value | The value to check. |

---

### toArray

Convert a single value or array of values into an array.

```ts
toArray(1); // returns [1]
toArray([1, 2, 3]); // returns [1, 2, 3]
```

#### Params

| Name  | Description           |
| ----- | --------------------- |
| value | The value to convert. |

---

### uniq

Remove duplicate values from an array.

```ts
uniq([1, 2, 2, 3, 4, 4]); // returns [1, 2, 3, 4]
uniq(["a", "a", "b", "c"]); // returns ['a', 'b', 'c']
```

#### Params

| Name  | Description                          |
| ----- | ------------------------------------ |
| array | The array to remove duplicates from. |

---

### last

Return the last element of an array.

```ts
last([1, 2, 3]); // returns 3
last(["a", "b", "c"]); // returns 'c'
```

#### Params

| Name  | Description                             |
| ----- | --------------------------------------- |
| array | The array to get the last element from. |

---

### first

Return the first element of an array.

```ts
first([1, 2, 3]); // returns 1
first(["a", "b", "c"]); // returns 'a'
```

#### Params

| Name  | Description                              |
| ----- | ---------------------------------------- |
| array | The array to get the first element from. |

---

### range

Generate an array of numbers in a given range.

```ts
range(5); // returns [0, 1, 2, 3, 4]
range(2, 5); // returns [2, 3, 4]
range(2, 10, 2); // returns [2, 4, 6, 8]
```

#### Params

| Name  | Description                                        |
| ----- | -------------------------------------------------- |
| start | The starting number of the range.                  |
| stop  | The ending number of the range.                    |
| step  | The increment to use between numbers in the range. |

---

### move

Move an element of an array from one position to another.

```ts
move([1, 2, 3, 4], 0, 2); // returns [2, 3, 1, 4]
move(["a", "b", "c", "d"], 1, 3); // returns ['a', 'c', 'd', 'b']
```

#### Params

| Name  | Description                       |
| ----- | --------------------------------- |
| array | The array to modify.              |
| from  | The index of the element to move. |
| to    | The index to move the element to. |

---

### sample

Return a random element from an array.

```ts
sample([1, 2, 3, 4]); // returns a random element from the array
sample(["a", "b", "c", "d"]); // returns a random element from the array
```

#### Params

| Name  | Description                               |
| ----- | ----------------------------------------- |
| array | The array to get the random element from. |

---

### remove

Remove an element from an array.

```ts
remove([1, 2, 3, 4], 2); // returns [1, 3, 4]
remove(["a", "b", "c", "d"], "b"); // returns ['a', 'c', 'd']
```

#### Params

| Name  | Description                           |
| ----- | ------------------------------------- |
| array | The array to remove the element from. |
| item  | The element to remove.                |

---

### compact

Remove falsy values (`null`, `undefined`, `""`, `0`, `false`, `NaN`) from an array.

```ts
compact([1, 2, 3, 4, 0, null, undefined, false]); // returns [1, 2, 3, 4]
```

#### Params

| Name  | Description           |
| ----- | --------------------- |
| array | The array to compact. |

---

### fetchJson

Fetches a JSON response from a URL. Returns null if the response is not ok.
Can pass normal fetch options as well as custom options for the wrapper.

```ts
await fetchJson("https://example.com/api");
await fetchJson("https://example.com/api", { throws: true });
await fetchJson("https://example.com/api", { debug: true });
await fetchJson("https://example.com/api", { method: "POST" });
```

#### Params

| Name    | Description         |
| ------- | ------------------- |
| url     | The URL to fetch.   |
| options | The options to use. |

---

### readFile

Reads a file from a path. Returns null if an error occurs.

```ts
readFile("test.txt");
readFile("test.txt", { throws: true, debug: true });
```

#### Params

| Name    | Description           |
| ------- | --------------------- |
| path    | The path to the file. |
| options | The options to use.   |

---

### readJsonFile

Reads a JSON file from a path. Returns null if an error occurs.

```ts
readJsonFile("test.json");
readJsonFile("test.json", { throws: true, debug: true });
```

#### Params

| Name    | Description           |
| ------- | --------------------- |
| path    | The path to the file. |
| options | The options to use.   |

---

### debounce

Created a debounced version of the provided function. The function is a wrapper around the "throttle-debounce" library.

```ts
const debounced = debounce(() => console.log("hello world"), 1000);
debounced(); // logs 'hello world' after 1000ms
debounced(); // does nothing if called within 1000ms of the previous call
```

#### Params

| Name     | Description                                                                                   |
| -------- | --------------------------------------------------------------------------------------------- |
| callback | The function to create a debounced version of.                                                |
| wait     | The number of milliseconds to wait before invoking the function.                              |
| options  | Options for the debounced function. See the "throttle-debounce" library for more information. |

---

### throttle

Created a throttled version of the provided function. The function is a wrapper around the "throttle-debounce" library.

```ts
// invokes the function not more than once per second
const throttled = throttle(() => console.log("hello world"), 1000);
element.addEventListener("mousemove", throttled);

// cancel the throttled function
throttled.cancel();
```

#### Params

| Name     | Description                                                      |
| -------- | ---------------------------------------------------------------- |
| callback | The function to create a throttled version of.                   |
| wait     | The number of milliseconds to wait before invoking the function. |

---

### isElement

Check if the value is a DOM element.

```ts
isElement(document.body); // true
isElement("hello world"); // false
```

#### Params

| Name  | Description         |
| ----- | ------------------- |
| value | The value to check. |

---

### getProperty

Returns the value at path of object. If the resolved value is undefined, the defaultValue is returned in its place. Undefined will be returned if the path is not found or on failure. Wrapper around the "dot-prop" library.

```ts
const obj = { a: { b: { c: "d" } } };

getProperty(obj, "a.b.c"); // => "d"
getProperty(obj, "a.b"); // => { c: "d" }

getProperty({ a: [{ b: "c" }] }, "a[0].b"); // => "c"
getProperty({ a: [{ b: "c" }] }, "a[1].b"); // => undefined
```

#### Params

| Name         | Description                                   |
| ------------ | --------------------------------------------- |
| obj          | object to query                               |
| path         | path to query in object                       |
| defaultValue | value to return for undefined resolved values |

---

### hasProperty

Checks if object has a property at path. If the resolved value is undefined, false is returned. Wrapper around the "dot-prop" library.

```ts
const obj = { a: { b: { c: "d" } } };
hasProperty(obj, "a.b.c"); // => true
hasProperty(obj, "a.b"); // => true
hasProperty(obj, "a.b.c.d"); // => false
```

#### Params

| Name | Description             |
| ---- | ----------------------- |
| obj  | object to query         |
| path | path to query in object |

---

### deleteProperty

Deletes the property at path of object. Wrapper around the "dot-prop" library.

```ts
const obj = { a: { b: { c: "d" } } };

deleteProperty(obj, "a.b.c"); // => true
deleteProperty(obj, "a.b"); // => true
deleteProperty(obj, "a.b.c.d"); // => false
```

#### Params

| Name | Description              |
| ---- | ------------------------ |
| obj  | object to modify         |
| path | path to delete in object |

---

### select

Selects a single element from the DOM,
or returns null if no element is found. Can search a parent as well.
Can also be used to check if element exists or fetch an array of elements.

```ts
select("#test"); // returns element
select("#test", parent); // returns element if it exists within parent
select.exists("#test"); // returns true if element exists
select.all(".test"); // returns array of elements
```

#### Params

| Name     | Description                          |
| -------- | ------------------------------------ |
| selector | The CSS selector to use.             |
| parent   | The parent element to search within. |

---

### select.exists

Check if an element exists in the DOM. Will default to search in the document.

```ts
select.exists("#test"); // returns true if element exists
select.exists("#test", parent); // returns true if element exists within parent
```

#### Params

| Name     | Description                          |
| -------- | ------------------------------------ |
| selector | The CSS selector to use.             |
| parent   | The parent element to search within. |

---

### select.all

Selects all elements from the DOM as an array, or returns an empty array if no elements are found.
Can search a parent as well.

```ts
select.all(".test"); // [element1, element2, ...]
select.all(".test", parent); // [element1, element2, ...]
```

#### Params

| Name     | Description                          |
| -------- | ------------------------------------ |
| selector | The CSS selector to use.             |
| parent   | The parent element to search within. |

---

### capitalize

Capitalizes the first letter of a given string and converts the rest of the letters to lowercase.

```ts
capitalize("hello"); // returns 'Hello'
capitalize("HELLO"); // returns 'Hello'
```

#### Params

| Name | Description               |
| ---- | ------------------------- |
| str  | The string to capitalize. |

---

### isEmptyString

Check if the given value is an empty string.

```ts
isEmptyString(""); // returns true
isEmptyString("hello"); // returns false
```

#### Params

| Name  | Description         |
| ----- | ------------------- |
| value | The value to check. |

---

### camelCase

Convert a string to camelCase using the "change-case" library.

```ts
camelCase("hello world"); // returns 'helloWorld'
```

#### Params

| Name    | Description                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------- |
| str     | The string to convert.                                                                             |
| options | The options to use when converting the string. See the "change-case" library for more information. |

---

### pathCase

Convert a string to path/case using the "change-case" library.

```ts
pathCase("hello world"); // returns 'hello/world'
```

#### Params

| Name    | Description                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------- |
| str     | The string to convert.                                                                             |
| options | The options to use when converting the string. See the "change-case" library for more information. |

---

### capitalCase

Convert a string to Capital Case using the "change-case" library.

```ts
capitalCase("hello world"); // returns 'Hello World'
```

#### Params

| Name    | Description                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------- |
| str     | The string to convert.                                                                             |
| options | The options to use when converting the string. See the "change-case" library for more information. |

---

### dotCase

Convert a string to dot.case using the "change-case" library.

```ts
dotCase("hello world"); // returns 'hello.world'
```

#### Params

| Name    | Description                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------- |
| str     | The string to convert.                                                                             |
| options | The options to use when converting the string. See the "change-case" library for more information. |

---

### pascalCase

Convert a string to PascalCase using the "change-case" library.

```ts
pascalCase("hello world"); // returns 'HelloWorld'
```

#### Params

| Name    | Description                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------- |
| str     | The string to convert.                                                                             |
| options | The options to use when converting the string. See the "change-case" library for more information. |

---

### snakeCase

Convert a string to snake_case using the "change-case" library.

```ts
snakeCase("hello world"); // returns 'hello_world'
```

#### Params

| Name    | Description                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------- |
| str     | The string to convert.                                                                             |
| options | The options to use when converting the string. See the "change-case" library for more information. |

---

### randomString

Generate a random string with the length provided, defaults to 10.

```ts
randomString(); // returns 'Fwf4552Dd2'
randomString(5); // return 'f5l32'
```

#### Params

| Name   | Description      |
| ------ | ---------------- |
| length | length of string |

---

<!-- DOCS END -->
