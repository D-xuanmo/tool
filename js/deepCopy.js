/**
 * 深拷贝
 * @param {array | object} data
 * @returns {array | object}
 */
export function deepCopy (data) {
  if ([null, undefined].includes(data)) return data

  if (typeof data === 'object') {
    const result = Array.isArray(data) ? [] : {}

    for (let i in data) {
      result[i] = deepCopy(data[i])
    }

    return result
  }

  return data
}
