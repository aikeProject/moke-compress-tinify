export class TinifyCompressError extends Error {
  code: string | null

  constructor(
    message: string,
    code?: string | null
  ) {
    super(message)

    this.code = code || ''

    Object.setPrototypeOf(this, TinifyCompressError.prototype)
  }
}

export function createError(
  message: string,
  code?: string | null
) {
  return new TinifyCompressError(message, code)
}
