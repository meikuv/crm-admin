export interface IGroupedWordsByLetter {
  [letter: string]: string[]
}

export function groupWordsByFirstLetter(words: string[]): IGroupedWordsByLetter {
  return words.reduce((store: IGroupedWordsByLetter, word: string) => {
    const letter = word.charAt(0)
    const keyStore = store[letter] || (store[letter] = [])
    keyStore.push(word)
    return store
  }, {})
}

export function convertToCsvString(
  data: Record<string, string>[],
  columnNames?: string[],
  emptyStringPlaceholder: string = '-',
  booleanTypeLabel: { true: string; false: string } | false = false,
): string {
  const columns = columnNames?.length ? columnNames : Object.keys(data[0])
  return (
    '\ufeff' +
    [
      columns.map(str => `"${str.replace(/"/g, '"')}"`),
      ...data.map(item =>
        [...Object.values(item)].map(str => {
          if (booleanTypeLabel) {
            const _str = str.toLocaleLowerCase()
            if (_str === 'true') {
              str = str.replace('true', booleanTypeLabel.true)
            }
            if (_str === 'false') {
              str = str.replace('false', booleanTypeLabel.false)
            }
          }
          return str ? `"${str.replace(/"/g, '"')}"` : emptyStringPlaceholder
        }),
      ),
    ]
      .map(e => e?.join(','))
      .join('\n')
  )
}
