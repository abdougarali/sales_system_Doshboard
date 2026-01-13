/**
 * Serializes MongoDB/Mongoose documents to plain JavaScript objects
 * This is needed because Next.js Server Components can only pass plain objects to Client Components
 */

export function serializeDocument<T>(doc: any): T {
  if (!doc) return doc;

  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map((item) => serializeDocument(item)) as T;
  }

  // Handle non-objects (strings, numbers, booleans, etc.)
  if (typeof doc !== 'object') {
    return doc;
  }

  // Handle Date objects
  if (doc instanceof Date) {
    return doc.toISOString() as T;
  }

  // Handle ObjectId (has a toString method and buffer property)
  if (doc._bsontype === 'ObjectId' || doc.buffer) {
    return doc.toString() as T;
  }

  // Handle regular objects
  const serialized: Record<string, any> = {};

  for (const key of Object.keys(doc)) {
    const value = doc[key];

    if (value === null || value === undefined) {
      serialized[key] = value;
    } else if (key === '_id' || key === 'productId') {
      // Convert ObjectId to string
      serialized[key] = value.toString ? value.toString() : value;
    } else if (value instanceof Date) {
      // Convert Date to ISO string
      serialized[key] = value.toISOString();
    } else if (value._bsontype === 'ObjectId' || value.buffer) {
      // Convert ObjectId to string
      serialized[key] = value.toString();
    } else if (Array.isArray(value)) {
      // Recursively serialize arrays
      serialized[key] = value.map((item) => serializeDocument(item));
    } else if (typeof value === 'object') {
      // Recursively serialize nested objects
      serialized[key] = serializeDocument(value);
    } else {
      serialized[key] = value;
    }
  }

  return serialized as T;
}
