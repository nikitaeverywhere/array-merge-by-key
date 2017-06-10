"use strict";

/**
 * Merges two or more arrays of objects into a single array by merging objects with the same key
 * (property).
 * @param {string} [key]
 * @param {...*[]} [arrays]
 * @returns {*[]}
 */
module.exports = function (key, arrays) {

    const array = [];
    const groups = new Map(); // key => [pos in array, [array, of, objects, with, the, same, key]]

    for (let i = 1; i < arguments.length; ++i) {
        for (let j = 0; j < arguments[i].length; ++j) {
            const element = arguments[i][j];
            if (element.hasOwnProperty(key)) {
                const keyValue = element[key];
                if (groups.has(keyValue)) {
                    groups.get(keyValue)[1].push(element);
                } else {
                    array.push(element);
                    groups.set(keyValue, [array.length - 1, []]);
                }
            } else {
                array.push(element);
            }
        }
    }

    for (let group of groups) {
        if (group[1][1].length === 0)
            continue;
        array[group[1][0]] =
            Object.assign.apply(Object, [{}, array[group[1][0]]].concat(group[1][1]));
    }

    return array;

};