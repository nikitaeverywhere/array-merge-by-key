import test from "ava";
import equal from "deep-is";
import mergeByKey from "./index.js";

test(`Returns empty array if no arguments passed`, (it) => {

    const result = mergeByKey();

    it.is(result instanceof Array, true);
    it.is(result.length, 0);

});

test(`Returns empty array if one argument (key) is passed`, (it) => {

    const result = mergeByKey("testKey");

    it.is(result instanceof Array, true);
    it.is(result.length, 0);

});

test(`Returns the same array if one is passed`, (it) => {

    const result = mergeByKey("superKey", [{ a: 1 }, { key: 2 }]);

    it.is(equal([{ a: 1 }, { key: 2 }], result), true);

});

test(`Returns the same array if one is passed and key is present in it`, (it) => {

    const arr = [{ a: 1 }, { superKey: 5 }, { key: 2 }];
    const result = mergeByKey("superKey", arr);

    it.is(
        equal([{ a: 1 }, { superKey: 5 }, { key: 2 }], result),
        true,
        `Expected ${ JSON.stringify(arr) }, but got ${ JSON.stringify(result) }`
    );

});

test(`Does not mutate passed array`, (it) => {

    const arr = [{ a: 1 }, { superKey: 5 }, { key: 2 }];
    const result = mergeByKey("superKey", arr);

    it.is(result !== arr, true);

});

test(`Merges 2 objects with same keys`, (it) => {

    const arr1 = [{ superKey: 5, test: "hi" }];
    const arr2 = [{ superKey: 5, test: "lo" }];
    const expectation = [
        { superKey: 5, test: "lo" }
    ];
    const result = mergeByKey("superKey", arr1, arr2);

    it.is(
        equal(expectation, result),
        true,
        `Expected ${ JSON.stringify(expectation) }, but got ${ JSON.stringify(result) }`
    );

});

test(`Merges objects with same key in 2 arrays preserving original order`, (it) => {

    const arr1 = [{ superKey: 5, test: "hi" }, { superKey: 7, test: "this" }];
    const arr2 = [{ superKey: 7, test: "is" }, { superKey: 9, test: "a test" }];
    const expectation = [
        { superKey: 5, test: "hi" },
        { superKey: 7, test: "is" },
        { superKey: 9, test: "a test" }
    ];
    const result = mergeByKey("superKey", arr1, arr2);

    it.is(
        equal(expectation, result),
        true,
        `Expected ${ JSON.stringify(expectation) }, but got ${ JSON.stringify(result) }`
    );

});

test(`Mutates unchanged objects and does not mutate merged objects`, (it) => {

    const obj1 = { superKey: 5, test: "hi" };
    const obj2 = { superKey: 7, test: "this" };
    const obj3 = { superKey: 7, test: "is" };
    const obj4 = { superKey: 9, test: "a test" };
    const arr1 = [obj1, obj2];
    const arr2 = [obj3, obj4];
    const result = mergeByKey("superKey", arr1, arr2);

    it.is(obj1, result[0], `Must not create a copy of obj1`);
    it.is(obj4, result[2], `Must not create a copy of obj4`);
    it.is(obj2 !== result[1] && obj3 !== result[1], true, `Must not mutate obj2 or obj3`);

});

test(`Does not mutate any of passed arrays`, (it) => {

    const obj1 = { superKey: 5, test: "hi" };
    const obj2 = { superKey: 7, test: "this" };
    const obj3 = { superKey: 7, test: "is" };
    const obj4 = { superKey: 9, test: "a test" };
    const arr1 = [obj1, obj2];
    const arr2 = [obj3, obj4];
    const result = mergeByKey("superKey", arr1, arr2);

    it.is(arr1 !== result && arr2 !== result, true, `Must not mutate arr1 or arr2`);

});

test(`Works with 3 arrays`, (it) => {

    const arr1 = [{ superKey: 5, test: "hi" }];
    const arr2 = [{ superKey: 5, test: "ou" }, { superKey: 5, test: "lo" }];
    const arr3 = [{ superKey: 5, test: "zi" }];
    const expectation = [
        { superKey: 5, test: "zi" }
    ];
    const result = mergeByKey("superKey", arr1, arr2, arr3);

    it.is(
        equal(expectation, result),
        true,
        `Expected ${ JSON.stringify(expectation) }, but got ${ JSON.stringify(result) }`
    );

});

test(`Complex case: preserves order for elements while some of them do not have keys`, (it) => {

    const arr1 = [{ id: 1, test: 2 }, { id: 2, test: 3 }, { id: 3, test: 4 }, { test: 5 }];
    const arr2 = [{ id: 3, test: 6 }, { test: 7 }, { id: 4 }, { id: 1, test: 9 }];
    const arr3 = [{ id: 5, test: 10 }, { test: 11 }, { id: 6, test: 12 }, { id: 4, test: 13 }];
    const expectation = [
        { id: 1, test: 9 }, { id: 2, test: 3 }, { id: 3, test: 6 }, { test: 5 }, { test: 7 },
        { id: 4, test: 13 }, { id: 5, test: 10 }, { test: 11 }, { id: 6, test: 12 }
    ];
    const result = mergeByKey("id", arr1, arr2, arr3);

    it.is(
        equal(expectation, result),
        true,
        `Expected ${ JSON.stringify(expectation) }, but got ${ JSON.stringify(result) }`
    );

});

test(`Complex case: works with 250 arrays`, (it) => {

    const arr1 = [{ id: 1, test: 2 }, { id: 2, test: 3 }, { id: 3, test: 4 }, { test: 5 }];
    const otherArrays = Array.from({ length: 247 }, () => ({
        id: [1, 3, 4, 5, 6][Math.floor(Math.random() * 5)],
        test: Math.round(Math.random() * 10)
    }));
    const arr2 = [{ id: 3, test: 6 }, { test: 7 }, { id: 4 }, { id: 1, test: 9 }];
    const arr3 = [{ id: 5, test: 10 }, { test: 11 }, { id: 6, test: 12 }, { id: 4, test: 13 }];
    const expectation = [
        { id: 1, test: 9 }, { id: 2, test: 3 }, { id: 3, test: 6 }, { test: 5 }, { test: 7 },
        { id: 4, test: 13 }, { id: 5, test: 10 }, { test: 11 }, { id: 6, test: 12 }
    ];
    const result = mergeByKey("id", arr1, ...otherArrays, arr2, arr3);

    it.is(
        equal(expectation, result),
        true,
        `Expected ${ JSON.stringify(expectation) }, but got ${ JSON.stringify(result) }`
    );

});

test(`Merges duplicates in one array`, (it) => {

    const expectation = [{ key: 2, a: 3, b: 2 }];
    const result = mergeByKey("key", [{ key: 2, a: 1 }, { key: 2, b: 2, a: 3 }]);

    it.is(
        equal(expectation, result),
        true,
        `Expected ${ JSON.stringify(expectation) }, but got ${ JSON.stringify(result) }`
    );

});
