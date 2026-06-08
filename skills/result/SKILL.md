---
name: result
description: Use when consuming @banjoanton/utils Result, ResultType, AsyncResultType, createResult, try, tryAsync, all, fromNullable, match, or typed service/API error handling.
---

# Result

Use this skill when applying the `@banjoanton/utils` Result API in an application, feature module, service layer, server function, route handler, or API client.

The Result API models operations that either succeed with data or fail with a typed error. Use it to make expected failures explicit instead of throwing across service boundaries.

## Import

```ts
import { Result, createResult, type AsyncResultType, type ResultType } from "@banjoanton/utils";
```

Use `ResultType<T, E>` for sync results:

```ts
type ParseResult = ResultType<OrderInput, ValidationError>;
```

Use `AsyncResultType<T, E>` for async results:

```ts
type GetOrderResult = AsyncResultType<Order, AppError>;
```

## App-Level Result

Create an app-specific Result factory when a module or app has one error type.

```ts
type ErrorCode = "NOT_FOUND" | "UNAUTHORIZED" | "VALIDATION" | "INTERNAL";

class AppError extends Error {
    constructor(
        public code: ErrorCode,
        message: string,
        public cause?: unknown
    ) {
        super(message);
    }
}

export const AppResult = createResult<AppError>();
export type AppResult<T> = ResultType<T, AppError>;
export type AsyncAppResult<T> = AsyncResultType<T, AppError>;
```

Prefer the app-level factory in app code:

```ts
return AppResult.ok(order);
return AppResult.err(new AppError("NOT_FOUND", "Order not found"));
```

Use the generic `Result` directly when there is no shared error type or when writing reusable library code.

## Creating Results

Return success with `ok`:

```ts
return AppResult.ok(order);
```

Return expected failures with `err`:

```ts
return AppResult.err(new AppError("VALIDATION", "Quantity must be greater than zero"));
```

Wrap synchronous code that can throw with `try`:

```ts
const parsed = AppResult.try(
    () => orderSchema.parse(input),
    cause => new AppError("VALIDATION", "Invalid order input", cause)
);
```

Wrap async code that can reject or throw with `tryAsync`:

```ts
const rows = await AppResult.tryAsync(
    () => db.query.orders.findMany({ where: eq(orders.tenantId, tenantId) }),
    cause => new AppError("INTERNAL", "Could not list orders", cause)
);
```

Convert nullable lookups with `fromNullable`:

```ts
return AppResult.fromNullable(
    order,
    () => new AppError("NOT_FOUND", `Order ${orderId} was not found`)
);
```

Combine independent Results with `all`:

```ts
const validation = AppResult.all([
    requireTenantId(tenantId),
    requirePositiveInteger(orderId, "Order ID"),
    requirePermission(user, "orders:read"),
] as const);

if (!validation.ok) return validation;
```

`all` returns the first error. On success, it returns a tuple of all success values.

Use `isResult` when handling unknown values from plugins, callbacks, or dynamic boundaries:

```ts
const output: unknown = await handler(input);

if (Result.isResult(output)) {
    return output.match({
        Ok: data => data,
        Err: error => ({ error: String(error) }),
    });
}
```

## Service Pattern

Services should return `ResultType<T, E>` or `AsyncResultType<T, E>`. Do not throw for expected domain, validation, authorization, conflict, or not-found failures.

```ts
type GetOrderProps = {
    orderId: number;
    tenantId: string;
    user: User;
};

const getOrder = async ({ orderId, tenantId, user }: GetOrderProps): AsyncAppResult<Order> => {
    const validation = AppResult.all([
        requirePositiveInteger(orderId, "Order ID"),
        requireTenantId(tenantId),
        requirePermission(user, "orders:read"),
    ] as const);

    if (!validation.ok) return validation;

    const rowResult = await AppResult.tryAsync(
        () => db.query.orders.findFirst({ where: and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)) }),
        cause => new AppError("INTERNAL", `DB error fetching order ${orderId}`, cause)
    );

    if (!rowResult.ok) return rowResult;

    return AppResult.fromNullable(
        rowResult.data,
        () => new AppError("NOT_FOUND", `Order ${orderId} was not found`)
    );
};
```

## Transforming Results

Use `map` for infallible success transformations:

```ts
const dtoResult = orderResult.map(order => ({
    id: order.id,
    status: order.status,
    total: order.totalCents / 100,
}));
```

Use `andThen` when the next synchronous step can fail:

```ts
const result = parseOrderInput(input).andThen(validateOrderInput);
```

Use `andThenAsync` when the next async step can fail:

```ts
const result = await userResult.andThenAsync(user => listOrders({ user, tenantId }));
```

Use `mapErr` to translate errors at module boundaries:

```ts
const result = paymentResult.mapErr(
    error => new AppError("INTERNAL", "Payment provider failed", error)
);
```

Use `tap` and `tapErr` for logging, metrics, or other side effects that must not change the Result:

```ts
return result.tapErr(error => logger.error(error.message, { code: error.code, cause: error.cause }));
```

## Unwrapping Boundaries

Use `match` at API, route, controller, server-function, or UI boundaries. Keep service code in Result form for as long as possible.

```ts
const result = await getOrder({ orderId, tenantId, user });

return result.match({
    Ok: order => ({ status: 200, body: order }),
    Err: error => ({
        status: error.code === "NOT_FOUND" ? 404 : 500,
        body: { message: error.message },
    }),
});
```

If a framework requires thrown errors at the outer boundary, throw there only:

```ts
return result.match({
    Ok: data => data,
    Err: error => {
        logger.error(error.message, { code: error.code, cause: error.cause });
        throw new Error(error.message);
    },
});
```

## Usage Rules

- Use `Result.try` for synchronous functions only.
- Use `Result.tryAsync` for promises, async functions, database calls, fetch calls, and SDK calls.
- Use `createResult<E>()` once per app/module error type instead of repeating `ResultType<T, AppError>` everywhere.
- Use lazy error factories with `fromNullable`, especially when the error includes dynamic context.
- Use `as const` with `all` when tuple inference matters.
- Return early on `!result.ok` in imperative service code when that is clearer than chaining.
- Do not use Result for truly exceptional programmer errors, invariant violations, or unrecoverable process failures.
- Do not call `.data` or `.error` before checking `result.ok`, unless TypeScript has already narrowed the branch.
- Do not wrap every line in Result helpers. Wrap failure-prone boundaries, then compose or return the Result.

## Testing Consumers

Test both success and failure paths for services returning Results:

```ts
it("returns not found when the order does not exist", async () => {
    const result = await getOrder({ orderId: 123, tenantId, user });

    expect(result.ok).toBe(false);
    if (!result.ok) {
        expect(result.error.code).toBe("NOT_FOUND");
    }
});
```

Prefer asserting on the public error shape or semantic error code rather than implementation details of thrown causes.
