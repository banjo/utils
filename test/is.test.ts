import { describe, expect, it } from "vitest";
import {
    isArray,
    isBoolean,
    isDate,
    isDateObject,
    isDefined,
    isEmpty,
    isFunction,
    isNil,
    isNull,
    isNumber,
    isObject,
    isPrimitive,
    isRegExp,
    isString,
    isUndefined,
} from "../src/utils/is";

describe("is", () => {
    it("isNumber", () => {
        expect(isNumber(1)).toBe(true);
        expect(isNumber("1")).toBe(false);
        expect(isNumber(true)).toBe(false);
        expect(isNumber(null)).toBe(false);
        expect(isNumber(undefined)).toBe(false);
        expect(isNumber({})).toBe(false);
        expect(isNumber([])).toBe(false);
        expect(isNumber(new Date())).toBe(false);
        expect(isNumber(() => {})).toBe(false);
    });

    it("isBoolean", () => {
        expect(isBoolean(true)).toBe(true);
        expect(isBoolean(false)).toBe(true);
        expect(isBoolean(1)).toBe(false);
        expect(isBoolean("1")).toBe(false);
        expect(isBoolean(null)).toBe(false);
        expect(isBoolean(undefined)).toBe(false);
        expect(isBoolean({})).toBe(false);
        expect(isBoolean([])).toBe(false);
        expect(isBoolean(new Date())).toBe(false);
        expect(isBoolean(() => {})).toBe(false);
    });

    it("isString", () => {
        expect(isString("1")).toBe(true);
        expect(isString(1)).toBe(false);
        expect(isString(true)).toBe(false);
        expect(isString(null)).toBe(false);
        expect(isString(undefined)).toBe(false);
        expect(isString({})).toBe(false);
        expect(isString([])).toBe(false);
        expect(isString(new Date())).toBe(false);
        expect(isString(() => {})).toBe(false);
    });

    it("isFunction", () => {
        const func: () => boolean = () => true;
        expect(isFunction(() => {})).toBe(true);
        expect(isFunction(func)).toBe(true);
        expect(isFunction("1")).toBe(false);
        expect(isFunction(1)).toBe(false);
        expect(isFunction(true)).toBe(false);
        expect(isFunction(null)).toBe(false);
        expect(isFunction(undefined)).toBe(false);
        expect(isFunction({})).toBe(false);
        expect(isFunction([])).toBe(false);
        expect(isFunction(new Date())).toBe(false);
    });

    it("isObject", () => {
        expect(isObject({})).toBe(true);
        expect(isObject([])).toBe(true);
        expect(isObject("1")).toBe(false);
        expect(isObject(1)).toBe(false);
        expect(isObject(true)).toBe(false);
        expect(isObject(null)).toBe(false);
        expect(isObject(undefined)).toBe(false);
        expect(isObject(new Date())).toBe(true);
        expect(isObject(() => {})).toBe(false);
    });

    it("isDateObjectObject", () => {
        expect(isDateObject(new Date())).toBe(true);
        expect(isDateObject({})).toBe(false);
        expect(isDateObject([])).toBe(false);
        expect(isDateObject("1")).toBe(false);
        expect(isDateObject(1)).toBe(false);
        expect(isDateObject(true)).toBe(false);
        expect(isDateObject(null)).toBe(false);
        expect(isDateObject(undefined)).toBe(false);
        expect(isDateObject(() => {})).toBe(false);
        expect(isDateObject("2013-02-08T09:30:26.493Z")).toBe(false);
    });

    it("isDate", () => {
        expect(isDate(new Date())).toBe(true);
        expect(isDate({})).toBe(false);
        expect(isDate([])).toBe(false);
        expect(isDate("1")).toBe(true);
        expect(isDate(1)).toBe(true);
        expect(isDate(true)).toBe(false);
        expect(isDate(null)).toBe(false);
        expect(isDate(undefined)).toBe(false);
        expect(isDate(() => {})).toBe(false);
        expect(isDate("2013-02-08T09:30:26.493Z")).toBe(true);
        expect(isDate("2022-02-10")).toBe(true);
        expect(isDate("2022-13-10")).toBe(false);
    });

    it("isRegExp", () => {
        expect(isRegExp(/1/)).toBe(true);
        expect(isRegExp({})).toBe(false);
        expect(isRegExp([])).toBe(false);
        expect(isRegExp("1")).toBe(false);
        expect(isRegExp(1)).toBe(false);
        expect(isRegExp(true)).toBe(false);
        expect(isRegExp(null)).toBe(false);
        expect(isRegExp(undefined)).toBe(false);
        expect(isRegExp(new Date())).toBe(false);
        expect(isRegExp(() => {})).toBe(false);
    });

    it("isPrimitive", () => {
        expect(isPrimitive(1)).toBe(true);
        expect(isPrimitive("1")).toBe(true);
        expect(isPrimitive(true)).toBe(true);
        expect(isPrimitive(null)).toBe(false);
        expect(isPrimitive(undefined)).toBe(false);
        expect(isPrimitive({})).toBe(false);
        expect(isPrimitive([])).toBe(false);
        expect(isPrimitive(new Date())).toBe(false);
        expect(isPrimitive(() => {})).toBe(false);
    });

    it("isNil", () => {
        expect(isNil(null)).toBe(true);
        expect(isNil(undefined)).toBe(true);
        expect(isNil(1)).toBe(false);
        expect(isNil("1")).toBe(false);
        expect(isNil(true)).toBe(false);
        expect(isNil({})).toBe(false);
        expect(isNil([])).toBe(false);
        expect(isNil(new Date())).toBe(false);
        expect(isNil(() => {})).toBe(false);
    });

    it("isDefined", () => {
        expect(isDefined(1)).toBe(true);
        expect(isDefined("1")).toBe(true);
        expect(isDefined(true)).toBe(true);
        expect(isDefined(false)).toBe(true);
        expect(isDefined(true)).toBe(true);
        expect(isDefined(null)).toBe(false);
        expect(isDefined(undefined)).toBe(false);
        expect(isDefined({})).toBe(true);
        expect(isDefined([])).toBe(true);
        expect(isDefined(new Date())).toBe(true);
        expect(isDefined(() => {})).toBe(true);
    });

    it("isUndefined", () => {
        expect(isUndefined(undefined)).toBe(true);
        expect(isUndefined(null)).toBe(false);
        expect(isUndefined(1)).toBe(false);
        expect(isUndefined("1")).toBe(false);
        expect(isUndefined(true)).toBe(false);
        expect(isUndefined({})).toBe(false);
        expect(isUndefined([])).toBe(false);
        expect(isUndefined(new Date())).toBe(false);
        expect(isUndefined(() => {})).toBe(false);
    });

    it("isNull", () => {
        expect(isNull(null)).toBe(true);
        expect(isNull(undefined)).toBe(false);
        expect(isNull(1)).toBe(false);
        expect(isNull("1")).toBe(false);
        expect(isNull(true)).toBe(false);
        expect(isNull({})).toBe(false);
        expect(isNull([])).toBe(false);
        expect(isNull(new Date())).toBe(false);
        expect(isNull(() => {})).toBe(false);
    });

    it("isArray", () => {
        expect(isArray([])).toBe(true);
        expect(isArray({})).toBe(false);
        expect(isArray(1)).toBe(false);
        expect(isArray("1")).toBe(false);
        expect(isArray(true)).toBe(false);
        expect(isArray(null)).toBe(false);
        expect(isArray(undefined)).toBe(false);
        expect(isArray(new Date())).toBe(false);
        expect(isArray(() => {})).toBe(false);
    });

    it("isEmpty", () => {
        expect(isEmpty([])).toBe(true);
        expect(isEmpty({})).toBe(true);
        expect(isEmpty(1)).toBe(false);
        expect(isEmpty("1")).toBe(false);
        expect(isEmpty(true)).toBe(false);
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty(() => {})).toBe(false);
        expect(isEmpty([1])).toBe(false);
        expect(isEmpty({ a: 1 })).toBe(false);
        expect(isEmpty(" ")).toBe(true);
        expect(isEmpty("")).toBe(true);
        expect(isEmpty(new Map())).toBe(true);
        expect(isEmpty(new Map([["a", 1]]))).toBe(false);
        expect(isEmpty(new WeakMap())).toBe(true);
        expect(isEmpty(new WeakMap([[{}, 1]]))).toBe(true);
        expect(isEmpty(new Set())).toBe(true);
        expect(isEmpty(new Set([1]))).toBe(false);
    });
});
