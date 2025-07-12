import {
  getFromStorage,
  storage_keys,
  setInStorage,
  getJsonFromStorage,
  setJsonInStorage,
} from './storage';
import { TimerData } from '../types/timer';
import Toast from 'react-native-toast-message';
import tw from '../lib/tailwind';
import Sound from 'react-native-sound';

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
  await setInStorage(storage_keys.theme_key, themeName);
};

const fetchAllTimers = async (): Promise<TimerData> => {
  const data = await getJsonFromStorage(storage_keys.timer_key);
  return data
    ? (data as TimerData)
    : { timers: [], categories: ['Workout', 'Study', 'Break'] };
};

const updateTimer = async (payload: TimerData): Promise<void> => {
  await setJsonInStorage(storage_keys.timer_key, payload);
};

const showError = (msg: string) => {
  Toast.show({
    type: 'error',
    text1: msg,
    text1Style: tw.style('text-sm font-medium text-start'),
    visibilityTime: 3000,
    autoHide: true,
    position: 'top',
    swipeable: true,
    topOffset: 50,
  });
};

const showSuccess = (msg: string) => {
  Toast.show({
    type: 'success',
    text1: msg,
    text1Style: tw.style('text-sm font-medium text-start'),
    visibilityTime: 3000,
    autoHide: true,
    position: 'top',
    swipeable: true,
    topOffset: 50,
  });
};

const showInfo = (msg: string) => {
  Toast.show({
    type: 'info',
    text1: msg,
    text1Style: tw.style('text-sm font-medium text-start'),
    visibilityTime: 3000,
    autoHide: true,
    position: 'top',
    swipeable: true,
    topOffset: 50,
  });
};

const playSound = () => {
  try {
    const sound = new Sound(require('../assets/sound/message.mp3'), error => {
      if (error) {
        console.log('Failed to load sound', error);
        return;
      }
      sound.setVolume(0.5);
      sound.setCategory('Playback');
      sound.play(success => {
        if (success) {
          console.log('successfully finished playing');
          sound.stop();
          sound.release();
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  } catch (error) {
    console.log('Error playing sound:', error);
  }
};

export {
  hexa,
  getTheme,
  setTheme,
  fetchAllTimers,
  updateTimer,
  showError,
  showSuccess,
  showInfo,
  playSound,
};
