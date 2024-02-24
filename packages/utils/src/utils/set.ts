import { hash } from "./crypto";
import { isDefined, isUndefined } from "./is";

/**
 * A set that can store objects. It uses a hash function to determine if an object is already in the set.
 * @example
 * const set = new ObjectSet([{ a: 1 }, { a: 2 }]);
 * set.add({ a: 3 });
 * set.has({ a: 3 }); // => true
 *
 * set.add({ a: 3 });
 * set.size; // => 3 // no duplicates
 */
export class ObjectSet<T> {
    protected data: T[] = [];
    protected hashIndexMap: { [key: string]: number } = {};

    private _add = (item: T): void => {
        const key = hash(item);

        if (isUndefined(this.hashIndexMap[key])) {
            this.data.push(item);
            this.hashIndexMap[key] = this.data.length - 1;
        }
    };

    constructor(data: T[] = []) {
        data.forEach(item => {
            this._add(item);
        });
    }

    public add(item: T): void {
        this._add(item);
    }

    public has(item: T): boolean {
        const key = hash(item);
        return isDefined(this.hashIndexMap[key]);
    }

    public clear() {
        this.data = [];
        this.hashIndexMap = {};
    }

    public remove(item: T): void {
        const key = hash(item);
        const index = this.hashIndexMap[key];

        if (isUndefined(index)) return;

        this.data.splice(index, 1);
        delete this.hashIndexMap[key];

        for (let i = index; i < this.data.length; i++) {
            this.hashIndexMap[hash(this.data[i])] = i;
        }
    }

    public get size(): number {
        return this.data.length;
    }

    public get values(): T[] {
        return structuredClone(this.data);
    }

    [Symbol.iterator]() {
        return this.values[Symbol.iterator]();
    }

    public forEach(callback: (item: T) => void): void {
        this.data.forEach(callback);
    }

    public map<U>(callback: (item: T) => U): U[] {
        return this.data.map(callback);
    }

    public filter(callback: (item: T) => boolean): T[] {
        return this.data.filter(callback);
    }
}
