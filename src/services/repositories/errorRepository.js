export default class ErrorFactory {
  static createError({
    name = "error",
    cause,
    message,
    code,
    status,
    success,
    data,
  }) {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;
    error.status = status;
    error.success = success;
    error.data = data;

    throw error;
  }
}
