# @banjoanton/utils

## 1.1.15

### Patch Changes

- 552c91f: Include skills in build package

## 1.1.14

### Patch Changes

- 83ea13f: Result updates and skills

## 1.1.13

### Patch Changes

- ebc4ee3: better types for Result

## 1.1.12

### Patch Changes

- 3745314: createResult type and bug fixes

## 1.1.11

### Patch Changes

- b933c47: Created isNullish and deprecated isNil

## 1.1.10

### Patch Changes

- Merge overwrites arrays per default

## 1.1.9

### Patch Changes

- Add keyBy
- Better typing for array methods

## 1.1.8

### Patch Changes

- Update old result name

## 1.1.7

### Patch Changes

- Update Result with more helper methods and better generics

## 1.1.6

### Patch Changes

- Enable ttl false to have no expiry in cache util
- Default to no cleanup in cache util

## 1.1.5

### Patch Changes

- c4fb4a5: Remove deprecated functions
- eea715c: Use only one `attempt`
- cac417b: Use `to` for both sync and async

## 1.1.4

### Patch Changes

- f1db91b: Will not minify code on build
- f1db91b: Add string utils from scule

## 1.1.3

### Patch Changes

- Fix types for parseDate

## 1.1.2

### Patch Changes

- 2409cad: Change `raise` and `exhaustiveCheck`to use function instead of const

## 1.1.1

### Patch Changes

- daa7763: change default behavior to undefined instead of throw for parseDate

## 1.1.0

### Minor Changes

- breaking change: change all Result types to use `ok` instead of `success`

## 1.0.0

### Major Changes

- a274b29: Update Result and wrap functions to more Go-like syntax.
    - Depracated `wrap` and `wrapAsync` functions.
    - Added `to` and `toSync` functions as a replacement for `wrap` and `wrapAsync`.
    - Changed name from `attempt` to `attemptSync` for synchronous function.
    - Changed name from `attemptAsync` to `attempt` for asynchronous function.
    - Added `createTryExpressionResult` function to create a `TryExpressionResult` object, which is a correctly type Result object with Go like error handling.
