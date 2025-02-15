# @banjoanton/utils

## 1.1.0

### Minor Changes

-   breaking change: change all Result types to use `ok` instead of `success`

## 1.0.0

### Major Changes

-   a274b29: Update Result and wrap functions to more Go-like syntax.

    -   Depracated `wrap` and `wrapAsync` functions.
    -   Added `to` and `toSync` functions as a replacement for `wrap` and `wrapAsync`.
    -   Changed name from `attempt` to `attemptSync` for synchronous function.
    -   Changed name from `attemptAsync` to `attempt` for asynchronous function.
    -   Added `createTryExpressionResult` function to create a `TryExpressionResult` object, which is a correctly type Result object with Go like error handling.
