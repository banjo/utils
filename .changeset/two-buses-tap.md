---
"@banjoanton/utils": major
---

Update Result and wrap functions to more Go-like syntax.

-   Depracated `wrap` and `wrapAsync` functions.
-   Added `to` and `toAsync` functions as a replacement for `wrap` and `wrapAsync`.
-   Changed name from `attempt` to `attemptSync` for synchronous function.
-   Changed name from `attemptAsync` to `attempt` for asynchronous function.
-   Added `createTryExpressionResult` function to create a `TryExpressionResult` object, which is a correctly type Result object with Go like error handling.
