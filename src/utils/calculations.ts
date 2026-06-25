export interface CalculationResult {
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
}

export function calculateInvoice(
  subtotal: number,
  discountPercent: number,
  taxPercent: number
): CalculationResult {
  const discountAmount = (subtotal * discountPercent) / 100
  const afterDiscount = subtotal - discountAmount
  const taxAmount = (afterDiscount * taxPercent) / 100
  const total = afterDiscount + taxAmount

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
  }
}
