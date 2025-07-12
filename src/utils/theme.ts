import { hexa, getTheme } from './helpers';
import tw from '../lib/tailwind';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';

type Theme = {
  primary: string;
  secondary: string;
  tertiary: string;
  danger: string;
  dangerAlt: string;
  background: string;
  backgroundAlt: string;
  backgroundAltElevated1: string;
  bubbleBackground: string;
  text: string;
  textAlt: string;
  textDisabled: string;
  border: string;
  success: string;
  white: string;
  warning: string;
  fieldBackground: string;
  black: string;
  premium: {
    1: string;
    2: string;
    3: string;
  };
  badge: {
    gold: {
      foreground: string;
      background: string;
      accent: string;
    };
    silver: {
      foreground: string;
      background: string;
      accent: string;
    };
    bronze: {
      foreground: string;
      background: string;
      accent: string;
    };
  };
  skeleton: string;
  foregroundAlt: string;
};

const color = tw.color as (color: string) => string;

const LightTheme: Theme = {
  background: color('background'),
  backgroundAlt: color('neutral-100'),
  bubbleBackground: color('neutral-100'),
  success: color('success'),
  tertiary: color('tertiary'),
  white: color('white'),
  black: color('black'),
  warning: color('warning'),
  premium: {
    1: color('premium-1'),
    2: color('premium-2'),
    3: color('premium-3'),
  },
  badge: {
    bronze: {
      accent: color('badge-bronze-accent'),
      background: color('badge-bronze-background'),
      foreground: color('badge-bronze-foreground'),
    },
    gold: {
      accent: color('badge-gold-accent'),
      background: color('badge-gold-background'),
      foreground: color('badge-gold-foreground'),
    },
    silver: {
      accent: color('badge-silver-accent'),
      background: color('badge-silver-background'),
      foreground: color('badge-silver-foreground'),
    },
  },
  border: color('neutral-300'),
  backgroundAltElevated1: color('neutral-300'),
  danger: color('danger'),
  dangerAlt: color('danger-alt'),
  primary: color('primary-dark'),
  text: color('foreground'),
  textAlt: color('foregroundAlt-dark'),
  skeleton: hexa(color('neutral-500'), 0.3),
  textDisabled: color('neutral-400'),
  secondary: color('secondary'),
  fieldBackground: color('fieldBackground'),
  foregroundAlt: color('foregroundAlt'),
};

const DarkTheme: Theme = {
  background: color('background-dark'),
  backgroundAlt: color('backgroundAlt-dark'),
  backgroundAltElevated1: color('neutral-800'),
  bubbleBackground: color('bubbleBackground-dark'),
  tertiary: color('tertiary-dark'),
  secondary: color('secondary-dark'),
  success: color('success-dark'),
  warning: color('warning-dark'),
  white: color('white'),
  black: color('black'),
  premium: {
    1: color('premium-1'),
    2: color('premium-2'),
    3: color('premium-3'),
  },
  badge: {
    bronze: {
      accent: color('badge-bronze-accent'),
      background: color('badge-bronze-background'),
      foreground: color('badge-bronze-foreground'),
    },
    gold: {
      accent: color('badge-gold-accent'),
      background: color('badge-gold-background'),
      foreground: color('badge-gold-foreground'),
    },
    silver: {
      accent: color('badge-silver-accent'),
      background: color('badge-silver-background'),
      foreground: color('badge-silver-foreground'),
    },
  },
  border: color('neutral-800'),
  danger: color('danger'),
  dangerAlt: color('danger-alt'),
  primary: color('primary-dark'),
  text: color('foreground-dark'),
  textAlt: color('foregroundAlt'),
  skeleton: hexa(color('neutral-400'), 0.3),
  textDisabled: color('neutral-500'),
  fieldBackground: color('fieldBackground-dark'),
  foregroundAlt: color('foregroundAlt'),
};

const useResolvedTheme = () => {
  const scheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getTheme();
        if (
          savedTheme === 'light' ||
          savedTheme === 'dark' ||
          savedTheme === 'system'
        ) {
          setTheme(savedTheme);
        } else {
          setTheme('system');
        }
      } catch (error) {
        console.log('Error fetching theme from AsyncStorage:', error);
        setTheme('system');
      }
    };

    loadTheme();
  }, []);

  return theme === 'system' ? { theme: scheme, setTheme } : { theme, setTheme };
};

export { LightTheme, DarkTheme, useResolvedTheme };
