import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage_keys = {
    theme_key: 'themevar',
    timer_key: 'timervar'
};

export const getFromStorage = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.log(`Error retrieving string value for key: ${key}`, error);
    return null;
  }
};

export const setInStorage = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(`Error storing string value for key: ${key}`, error);
  }
};

export const getJsonFromStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) as T : null;
  } catch (error) {
    console.log(`Error retrieving JSON value for key: ${key}`, error);
    return null;
  }
};

export const setJsonInStorage = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log(`Error storing JSON value for key: ${key}`, error);
  }
};

export const removeItemFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(`Error removing item for key: ${key}`, error);
  }
};

export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log('Error clearing AsyncStorage', error);
  }
};