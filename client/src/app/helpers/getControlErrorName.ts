export const getControlErrorName = (errors?: Object | null) => {
  if (typeof errors !== 'object' || errors === null) {
    return '';
  }

  if ('required' in errors) {
    return 'Это поле обязательно';
  }

  if ('email' in errors) {
    return 'Неверный формат электроного адреса';
  }

  return '';
};
