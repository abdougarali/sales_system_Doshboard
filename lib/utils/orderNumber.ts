/**
 * Generate a unique order number
 * Format: ORD-000001, ORD-000002, etc.
 */
export async function generateOrderNumber(): Promise<string> {
  // This will be used in the Order model pre-save hook
  // For now, return a placeholder - actual implementation in model
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}
