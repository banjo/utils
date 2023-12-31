import { hash } from "./crypto";
import { isDefined, isUndefined } from "./is";

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
