export function cutKeyFromObject<T>(data: Record<string, T>, excludeKeys: string[]): Record<string, any> {
  return Object.keys(data)
    .filter(key => !excludeKeys.includes(key))
    .reduce((obj, key) => {
      return Object.assign(obj, {
        [key]: data[key],
      })
    }, {})
}

/**
 * Глубоко клонирует объект по средствам JSON.parse
 * @param object - Объект для клонирования
 * @returns Новый объект который полностью повторяет оригинальный
 */
export function deepCloneObject<O = object>(object: O): O {
  try {
    return JSON.parse(JSON.stringify(object))
  } catch (error) {
    throw new TypeError(`Не получилось распарсить переданный объект \n${error}`)
  }
}
