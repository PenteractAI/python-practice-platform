/**
 * Transforms an object or an array to camelCase.
 *
 * @param {Object|Array} obj - The object or array to be transformed.
 * @returns {Object|Array} - The transformed object or array.
 */
const toCamelCase = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(v => toCamelCase(v));
    } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Date) && typeof obj !== 'function') {
        return Object.keys(obj).reduce((result, key) => {
            const camelCaseKey = key.replace(/(_\w)/g, m => m[1].toUpperCase());
            result[camelCaseKey] = toCamelCase(obj[key]);
            return result;
        }, {});
    }
    return obj;
};

/**
 * Converts an object or an array of objects to snake_case.
 *
 * @param {object|Array} obj - The object or array of objects to be converted.
 * @returns {object|Array} - The converted object or array of objects in snake_case.
 */
const toSnakeCase = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(v => toSnakeCase(v));
    } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Date) && typeof obj !== 'function') {
        return Object.keys(obj).reduce((result, key) => {
            const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            result[snakeCaseKey] = toSnakeCase(obj[key]);
            return result;
        }, {});
    }
    return obj;
};


export { toCamelCase, toSnakeCase };