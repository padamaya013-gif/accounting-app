export interface CalculationResult {
  subtotal: number
  discountAmount: number
  discountedSubtotal: number
  taxAmount: number
  total: number
}

export const calculateInvoice = (
  subtotal: number,
  discountPercentage: number = 0,
  taxPercentage: number = 0
): CalculationResult => {
  const discountAmount = (subtotal * discountPercentage) / 100
  const discountedSubtotal = subtotal - discountAmount
  const taxAmount = (discountedSubtotal * taxPercentage) / 100
  const total = discountedSubtotal + taxAmount

  return {
    subtotal,
    discountAmount,
    discountedSubtotal,
    taxAmount,
    total,
  }
}

export const calculateLineItem = (
  quantity: number,
  unitPrice: number
): number => {
  return quantity * unitPrice
}

export const calculateItems = (
  items: Array<{ quantity: number; unit_price: number }>
): number => {
  return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
}
