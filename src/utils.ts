export function isNil<T>(value: T): value is T {
  return value === undefined || value === null
}

export function truncateDecimal(value: number, numberOfDecimal: number): number {
  const [integer, decimal] = value.toString().split('.')

  if (decimal === null || decimal === undefined) {
    return parseFloat(integer)
  }

  return parseFloat(`${integer}.${decimal.slice(0, numberOfDecimal)}`)
}
