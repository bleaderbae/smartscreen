/**
 * Safely parses a JSON string, returning a fallback value if parsing fails.
 * This prevents application crashes when dealing with corrupted storage or untrusted input.
 *
 * @param jsonString - The JSON string to parse.
 * @param fallback - The value to return if parsing fails.
 * @returns The parsed object or the fallback value.
 */
export function safeJSONParse<T>(jsonString: string | null, fallback: T): T {
  if (!jsonString) {
    return fallback;
  }

  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('SafeJSONParse: Failed to parse JSON, using fallback.', error);
    return fallback;
  }
}