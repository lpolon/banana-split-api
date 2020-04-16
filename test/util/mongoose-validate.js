export function getMongooseValidationSyncError(document, path) {
  // const errors = document.validateSync()?.errors
  const errorObj = document.validateSync()
  const errors = errorObj && errorObj.errors

  if (typeof errors === 'undefined') throw Error('No validation error found')

  const {
    [path]: { message, kind },
  } = errors
  return [message, kind]
}
