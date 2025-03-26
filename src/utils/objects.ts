export function getTypedObjectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}

export function getTypedObjectEntries<T extends object>(obj: T) {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export function getObjectFromFormData<T = Record<string, string>>(
  formData: FormData
) {
  return Object.fromEntries(formData.entries()) as T;
}
