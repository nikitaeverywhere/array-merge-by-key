"use strict";

/**
 * Merges two or more arrays of objects into a single array by merging objects with the same key
 * (property).
 * @param {string} [key]
 * @param {...*[]} [arrays]
 * @returns {*[]}
 */
module.exports = function(key, ...arrays) {

    const array = [];
    const groups = new Map(); // key => [pos in array, [array, of, objects, with, the, same, key]]

    for (let i = 0; i < arrays.length; ++i) {
        for (let j = 0; j < arrays[i].length; ++j) {
            const element = arrays[i][j];
            if (element[key]) {
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

    groups.forEach(function(group) {
        if (group[1].length !== 0) {
            array[group[0]] = Object.assign(
                {},
                ...[array[group[0]], ...group[1]],
            );
        }
    });

    return array;
};
