import { onKey } from "./index"
import { keysState } from "../state/index"

function getSortedLetters(letters: string[]): string {
  return (
    letters
      // letters to numbers
      .map(letter => letter.charCodeAt(0))
      // sort numbers
      .sort((a, b) => b - a)
      // numbers to letters
      .map(number => String.fromCharCode(number))
      // conversion to string
      .join("")
  )
}

export default function onCombo(
  combo: string,
  callback: Function,
  isSorted = true
) {
  // each letter in the combo should be unique

  const keys = combo.split("")
  const normalizedCombo = combo.toLowerCase()

  keys.forEach(key => {
    onKey(key).start(() => {
      const havingSortedCombo = keysState.queue.join("") === normalizedCombo

      if (isSorted && havingSortedCombo) {
        callback(keysState.queue.join(""))

        return
      }

      const havingUnsortedCombo =
        getSortedLetters(keysState.queue) === normalizedCombo

      if (!isSorted && havingUnsortedCombo) callback(keysState.queue.join())
    })
  })
}
