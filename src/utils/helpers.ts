import { getFromStorage, storage_keys, setInStorage } from "./storage";

function hexa(color: string, alpha: number) {
  let hex = color.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, '$1$1');
  }
  const rgb = hex.match(/.{2}/g);

  if (!rgb) {
    return '';
  }

  const rgba = [...rgb.map(val => parseInt(val, 16)), alpha];
  return `rgba(${rgba.join(', ')})`;
}

const getTheme = async () => {
  const theme = await getFromStorage(storage_keys.theme_key);

  return theme ?? 'system';
};

const setTheme = async (themeName: string) => {
  await setInStorage(storage_keys.theme_key, themeName)
};

export {
  hexa,
  getTheme,
  setTheme
}