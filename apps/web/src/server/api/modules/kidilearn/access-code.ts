import { randomInt } from 'node:crypto'
import { AppError } from '../../middleware/error-handler'

export function generateCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from(
    { length: 4 },
    () => alphabet[randomInt(alphabet.length)],
  ).join('')
}

// The database's unique code-hash index decides ownership, including when
// different parents generate the same candidate concurrently.
export async function saveWithUniqueCode<T>(
  save: (code: string) => Promise<T | null>,
) {
  for (let attempt = 0; attempt < 32; attempt++) {
    const code = generateCode()
    try {
      const result = await save(code)
      if (result !== null) return { code, result }
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !('code' in error) ||
        error.code !== 'ER_DUP_ENTRY'
      )
        throw error
    }
  }
  throw new AppError(
    'Could not generate an available code. Please try again.',
    409,
  )
}
