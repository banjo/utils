# @banjoanton/utils

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
