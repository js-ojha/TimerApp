import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TimerData, TimerAction } from '../types/timer';
import { fetchAllTimers, updateTimer } from '../utils/helpers';

const initialState: TimerData = {
  timers: [],
  categories: ['Workout', 'Study', 'Break'],
};

const timerReducer = (state: TimerData, action: TimerAction): TimerData => {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload ?? { timers: [], categories: [] };
    case 'ADD_TIMER':
      return {
        ...state,
        timers: [...state.timers, action.payload],
      };
    case 'UPDATE_TIMER':
      return {
        ...state,
        timers: state.timers.map(t =>
          t._id === action.payload._id ? action.payload : t,
        ),
      };
    case 'DELETE_TIMER':
      return {
        ...state,
        timers: state.timers.filter(t => t._id !== action.payload),
      };
    case 'ADD_CATEGORY':
      if (state.categories.includes(action.payload)) return state;
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'RESET_TIMERS':
      return {
        ...state,
        timers: state.timers.map(t =>
          action.payload.includes(t._id)
            ? {
                ...t,
                status: 'created',
                remaining_duration: t.duration,
                updated_at: new Date().toISOString(),
              }
            : t,
        ),
      };
    case 'COMPLETE_TIMER':
      return {
        ...state,
        timers: state.timers.map(t =>
          t._id === action.payload
            ? {
                ...t,
                status: 'completed',
                completion_time: new Date().toISOString(),
              }
            : t,
        ),
      };
    default:
      return state;
  }
};

const TimerContext = createContext<{
  state: TimerData;
  dispatch: React.Dispatch<TimerAction>;
}>({
  state: initialState,
  dispatch: () => {},
});

const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const timers = await fetchAllTimers();
        dispatch({ type: 'LOAD_DATA', payload: timers });
      } catch (e) {
        console.log('Failed to parse saved timer data', e);
      }
    })();
  }, []);

  // Save to AsyncStorage on state change
  useEffect(() => {
    (async () => {
      await updateTimer(state);
    })();
  }, [state]);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);

export default TimerProvider;
