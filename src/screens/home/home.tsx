import React, { useMemo, useRef } from 'react';
import Text from '../../component/Text';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import tw from '../../lib/tailwind';
import { useTheme } from '../../provider/ThemeProvider';
import { ChevronDown, ChevronRight, Moon, Sun } from '../../utils/icons';
import {
  playSound,
  setTheme,
  showInfo,
  showSuccess,
} from '../../utils/helpers';
import { useTimer } from '../../provider/TimerProvider';
import { useNavigation } from '@react-navigation/native';
import { Timer } from '../../types/timer';

const ScreenHeader = () => {
  const { colors, dark, updateTheme } = useTheme();
  return (
    <View
      style={tw.style('flex-row p-4 justify-between items-center border-b', {
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      })}
    >
      <Text style={tw.style('text-lg font-medium', { color: colors.textAlt })}>
        Timers
      </Text>
      <View style={tw.style('flex-row gap-6')}>
        <TouchableOpacity>
          {/* <Filter color={colors.textAlt} size={22} /> */}
        </TouchableOpacity>
        {dark ? (
          <TouchableOpacity
            onPress={() => {
              setTheme('light');
              updateTheme('light');
            }}
          >
            <Sun color={colors.warning} size={22} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setTheme('dark');
              updateTheme('dark');
            }}
          >
            <Moon size={22} color={colors.textAlt} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const Home = () => {
  const { colors } = useTheme();
  const { state, dispatch } = useTimer();
  const { navigate } = useNavigation();
  const [currentOpenCategory, setCurrentOpenCategory] = React.useState<
    'Workout' | 'Study' | 'Break' | ''
  >('Workout');

  const runningTimerIdsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const groupedTimers = useMemo(() => {
    type Timer = (typeof state.timers)[number];
    const timerByCategory: { [key: string]: Timer[] } = {
      Workout: [],
      Study: [],
      Break: [],
    };
    state.timers.forEach(timer => {
      if (timer.category in timerByCategory && timer.status !== 'Completed') {
        timerByCategory[timer.category].push(timer);
      }
    });

    return timerByCategory;
  }, [state]);

  const startAllTimers = (timers: Timer[]) => {
    for (const timer of timers) {
      // Start: create interval
      let currentRemaining = timer.remaining_duration ?? timer.duration;
      const intervalId = setInterval(() => {
        currentRemaining = Math.max(currentRemaining - 1, 0);
        dispatch({
          type: 'UPDATE_TIMER',
          payload: {
            ...timer,
            remaining_duration: currentRemaining,
            status: 'Running',
            updated_at: new Date().toISOString(),
          },
        });

        // Mid Alerts Trigger
        if (timer.mid_trigger && timer.mid_trigger > 0) {
          const midAlertTime = Math.round(
            (timer.duration * timer.mid_trigger) / 100,
          );
          if (currentRemaining === midAlertTime) {
            playSound();
            showInfo(`Alert: Timer ${timer.name} is at ${timer.mid_trigger}%`);
          }
        }

        // If timer reaches zero, stop automatically
        if (currentRemaining <= 0) {
          clearInterval(runningTimerIdsRef.current[timer._id]);
          delete runningTimerIdsRef.current[timer._id];

          playSound();
          showSuccess('Timer completed: ' + timer.name);

          dispatch({
            type: 'COMPLETE_TIMER',
            payload: timer._id,
          });
        }
      }, 1000);

      runningTimerIdsRef.current[timer._id] = intervalId;

      // Update status immediately
      dispatch({
        type: 'UPDATE_TIMER',
        payload: {
          ...timer,
          status: 'Running',
          updated_at: new Date().toISOString(),
        },
      });
    }
  };

  const pauseAllTimers = (timers: Timer[]) => {
    for (const timer of timers) {
      const intervalId = runningTimerIdsRef.current[timer._id];
      if (intervalId) {
        clearInterval(intervalId);
        delete runningTimerIdsRef.current[timer._id];
      }

      // Update timer status
      dispatch({
        type: 'UPDATE_TIMER',
        payload: {
          ...timer,
          status: 'Paused',
        },
      });
    }
  };

  const timerPress = (timer: Timer) => {
    if (timer.status === 'Running') {
      // Pause: clear interval
      const intervalId = runningTimerIdsRef.current[timer._id];
      if (intervalId) {
        clearInterval(intervalId);
        delete runningTimerIdsRef.current[timer._id];
      }

      // Update timer status
      dispatch({
        type: 'UPDATE_TIMER',
        payload: {
          ...timer,
          status: 'Paused',
        },
      });
    } else if (timer.status === 'Paused' || timer.status === 'Created') {
      // Start: create interval
      let currentRemaining = timer.remaining_duration ?? timer.duration;
      const intervalId = setInterval(() => {
        currentRemaining = Math.max(currentRemaining - 1, 0);
        dispatch({
          type: 'UPDATE_TIMER',
          payload: {
            ...timer,
            remaining_duration: currentRemaining,
            status: 'Running',
            updated_at: new Date().toISOString(),
          },
        });

        // Mid Alerts Trigger
        if (timer.mid_trigger && timer.mid_trigger > 0) {
          const midAlertTime = Math.round(
            (timer.duration * timer.mid_trigger) / 100,
          );
          if (currentRemaining === midAlertTime) {
            playSound();
            showInfo(`Alert: Timer ${timer.name} is at ${timer.mid_trigger}%`);
          }
        }

        // If timer reaches zero, stop automatically
        if (currentRemaining <= 0) {
          clearInterval(runningTimerIdsRef.current[timer._id]);
          delete runningTimerIdsRef.current[timer._id];

          playSound();
          showSuccess('Timer completed: ' + timer.name);
          // Mark timer as completed

          dispatch({
            type: 'COMPLETE_TIMER',
            payload: timer._id,
          });
        }
      }, 1000);

      runningTimerIdsRef.current[timer._id] = intervalId;

      // Update status immediately
      dispatch({
        type: 'UPDATE_TIMER',
        payload: {
          ...timer,
          status: 'Running',
          updated_at: new Date().toISOString(),
        },
      });
    }
  };

  const resetTimer = (timer: Timer) => {
    dispatch({
      type: 'RESET_TIMERS',
      payload: [timer._id],
    });
    if (runningTimerIdsRef.current[timer._id]) {
      clearInterval(runningTimerIdsRef.current[timer._id]);
      delete runningTimerIdsRef.current[timer._id];
    }
    showSuccess('Timer reset successfully');
  };

  return (
    <View
      style={tw.style('flex-1', {
        backgroundColor: colors.backgroundAlt,
      })}
    >
      <ScreenHeader />

      {!state.timers.length && (
        <View style={tw.style('flex-1 items-center justify-center')}>
          <Text style={tw.style({ color: colors.textAlt })}>
            You have yet to create any timers...
          </Text>
        </View>
      )}
      {!!state.timers.length && (
        <ScrollView
          style={tw.style('flex-1 px-4 py-4 gap-4')}
          showsVerticalScrollIndicator={false}
        >
          {groupedTimers?.Workout.length > 0 && (
            <View
              style={tw.style('border rounded', {
                borderColor: colors.border,
              })}
            >
              {/* Header */}
              <TouchableOpacity
                onPress={() => {
                  setCurrentOpenCategory(prev =>
                    prev === 'Workout' ? '' : 'Workout',
                  );
                }}
                style={tw.style(
                  'flex-row justify-between items-center border-b rounded pl-4 pr-2 py-3 gap-2',
                  {
                    borderBottomColor: colors.border,
                  },
                )}
              >
                <View style={tw.style('flex-1 flex-row items-center gap-2')}>
                  {currentOpenCategory === 'Workout' ? (
                    <ChevronDown color={colors.textAlt} size={24} />
                  ) : (
                    <ChevronRight color={colors.textAlt} size={24} />
                  )}
                  <Text style={tw.style('font-medium')}>Workout</Text>
                  <View
                    style={tw.style(
                      'w-8 h-8 rounded-full items-center justify-center',
                      {
                        backgroundColor: colors.fieldBackground,
                      },
                    )}
                  >
                    <Text
                      style={tw.style('text-sm', { color: colors.textAlt })}
                    >
                      {groupedTimers?.Workout?.length || 0}
                    </Text>
                  </View>
                </View>

                <View
                  style={tw.style(
                    'flex-1 flex-row justify-end items-center gap-2',
                  )}
                >
                  <TouchableOpacity
                    onPress={() => startAllTimers(groupedTimers?.Workout)}
                    style={tw.style('px-2 py-1 rounded', {
                      backgroundColor: colors.fieldBackground,
                    })}
                  >
                    <Text
                      style={tw.style('text-sm', { color: colors.textAlt })}
                    >
                      Start All
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => pauseAllTimers(groupedTimers?.Workout)}
                    style={tw.style('px-2 py-1 rounded', {
                      backgroundColor: colors.fieldBackground,
                    })}
                  >
                    <Text
                      style={tw.style('text-sm', { color: colors.textAlt })}
                    >
                      Pause All
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              {/* Timers List */}
              {currentOpenCategory === 'Workout' && (
                <FlatList
                  data={groupedTimers?.Workout}
                  keyExtractor={item => item._id}
                  contentContainerStyle={tw.style('px-4 pt-4 pb-2')}
                  renderItem={({ item }) => {
                    const completedPercentage =
                      ((item.duration - item.remaining_duration) /
                        item.duration) *
                      100;
                    return (
                      <View
                        style={tw.style('mb-3 p-4 border rounded', {
                          borderColor: colors.border,
                          backgroundColor: colors.fieldBackground,
                        })}
                      >
                        <View
                          style={tw.style(
                            'flex-row justify-between items-center',
                          )}
                        >
                          <Text style={tw.style('font-medium')}>
                            {item.name}
                          </Text>
                          <Text
                            style={tw.style('text-sm', {
                              color: colors.textAlt,
                            })}
                          >
                            {item.status}
                          </Text>
                        </View>

                        <Text style={tw.style('font-bold text-xl mt-2')}>
                          {item?.remaining_duration}
                        </Text>

                        <View
                          style={tw.style('h-2 rounded mt-2', {
                            backgroundColor: colors.foregroundAlt,
                          })}
                        >
                          <View
                            style={tw.style('h-full rounded', {
                              width: `${completedPercentage}%`,
                              backgroundColor: colors.text,
                            })}
                          />
                        </View>

                        <View
                          style={tw.style(
                            'flex-1 flex-row items-center mt-4 gap-2',
                          )}
                        >
                          <TouchableOpacity
                            onPress={() => timerPress(item)}
                            style={tw.style(
                              'flex-4 rounded justify-center items-center py-2',
                              {
                                backgroundColor: colors.text,
                              },
                            )}
                          >
                            <Text
                              style={tw.style('text-sm', {
                                color: colors.background,
                              })}
                            >
                              {item.status === 'Running'
                                ? 'Pause'
                                : item.status === 'Paused'
                                ? 'Resume'
                                : 'Start'}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => resetTimer(item)}
                            style={tw.style(
                              'flex-1 border rounded py-2 justify-center items-center',
                              {
                                borderColor: colors.textAlt,
                              },
                            )}
                          >
                            <Text
                              style={tw.style('text-sm', {
                                color: colors.textAlt,
                              })}
                            >
                              Reset
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          )}

          {groupedTimers?.Study.length > 0 && (
            <View
              style={tw.style('border rounded', {
                borderColor: colors.border,
              })}
            >
              {/* Header */}
              <TouchableOpacity
                onPress={() => {
                  setCurrentOpenCategory(prev =>
                    prev === 'Study' ? '' : 'Study',
                  );
                }}
                style={tw.style(
                  'flex-row justify-between items-center border-b rounded pl-4 pr-2 py-3 gap-2',
                  {
                    borderBottomColor: colors.border,
                  },
                )}
              >
                <View style={tw.style('flex-1 flex-row items-center gap-2')}>
                  {currentOpenCategory === 'Study' ? (
                    <ChevronDown color={colors.textAlt} size={24} />
                  ) : (
                    <ChevronRight color={colors.textAlt} size={24} />
                  )}
                  <Text style={tw.style('font-medium')}>Study</Text>
                  <View
                    style={tw.style(
                      'w-8 h-8 rounded-full items-center justify-center',
                      {
                        backgroundColor: colors.fieldBackground,
                      },
                    )}
                  >
                    <Text
                      style={tw.style('text-sm', { color: colors.textAlt })}
                    >
                      {groupedTimers?.Study?.length || 0}
                    </Text>
                  </View>
                </View>

                <View
                  style={tw.style(
                    'flex-1 flex-row justify-end items-center gap-2',
                  )}
                >
                  <TouchableOpacity
                    onPress={() => startAllTimers(groupedTimers?.Study)}
                    style={tw.style('px-2 py-1 rounded', {
                      backgroundColor: colors.fieldBackground,
                    })}
                  >
                    <Text
                      style={tw.style('text-sm', { color: colors.textAlt })}
                    >
                      Start All
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => pauseAllTimers(groupedTimers?.Study)}
                    style={tw.style('px-2 py-1 rounded', {
                      backgroundColor: colors.fieldBackground,
                    })}
                  >
                    <Text
                      style={tw.style('text-sm', { color: colors.textAlt })}
                    >
                      Pause All
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              {/* Timers List */}
              {currentOpenCategory === 'Study' && (
                <FlatList
                  data={groupedTimers?.Study}
                  keyExtractor={item => item._id}
                  contentContainerStyle={tw.style('px-4 pt-4 pb-2')}
                  renderItem={({ item }) => {
                    const completedPercentage =
                      ((item.duration - item.remaining_duration) /
                        item.duration) *
                      100;
                    return (
                      <View
                        style={tw.style('mb-3 p-4 border rounded', {
                          borderColor: colors.border,
                          backgroundColor: colors.fieldBackground,
                        })}
                      >
                        <View
                          style={tw.style(
                            'flex-row justify-between items-center',
                          )}
                        >
                          <Text style={tw.style('font-medium')}>
                            {item.name}
                          </Text>
                          <Text
                            style={tw.style('text-sm', {
                              color: colors.textAlt,
                            })}
                          >
                            {item.status}
                          </Text>
                        </View>

                        <Text style={tw.style('font-bold text-xl mt-2')}>
                          {item?.remaining_duration}
                        </Text>

                        <View
                          style={tw.style('h-2 rounded mt-2', {
                            backgroundColor: colors.foregroundAlt,
                          })}
                        >
                          <View
                            style={tw.style('h-full rounded', {
                              width: `${completedPercentage}%`,
                              backgroundColor: colors.text,
                            })}
                          />
                        </View>

                        <View
                          style={tw.style(
                            'flex-1 flex-row items-center mt-4 gap-2',
                          )}
                        >
                          <TouchableOpacity
                            onPress={() => timerPress(item)}
                            style={tw.style(
                              'flex-4 rounded justify-center items-center py-2',
                              {
                                backgroundColor: colors.text,
                              },
                            )}
                          >
                            <Text
                              style={tw.style('text-sm', {
                                color: colors.background,
                              })}
                            >
                              {item.status === 'Running'
                                ? 'Pause'
                                : item.status === 'Paused'
                                ? 'Resume'
                                : 'Start'}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => resetTimer(item)}
                            style={tw.style(
                              'flex-1 border rounded py-2 justify-center items-center',
                              {
                                borderColor: colors.textAlt,
                              },
                            )}
                          >
                            <Text
                              style={tw.style('text-sm', {
                                color: colors.textAlt,
                              })}
                            >
                              Reset
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          )}

          {groupedTimers?.Break.length > 0 && (
            <View
              style={tw.style('border rounded', {
                borderColor: colors.border,
              })}
            >
              {/* Header */}
              <TouchableOpacity
                onPress={() => {
                  setCurrentOpenCategory(prev =>
                    prev === 'Break' ? '' : 'Break',
                  );
                }}
                style={tw.style(
                  'flex-row justify-between items-center border-b rounded pl-4 pr-2 py-3 gap-2',
                  {
                    borderBottomColor: colors.border,
                  },
                )}
              >
                <View style={tw.style('flex-1 flex-row items-center gap-2')}>
                  {currentOpenCategory === 'Break' ? (
                    <ChevronDown color={colors.textAlt} size={24} />
                  ) : (
                    <ChevronRight color={colors.textAlt} size={24} />
                  )}
                  <Text style={tw.style('font-medium')}>Break</Text>
                  <View
                    style={tw.style(
                      'w-8 h-8 rounded-full items-center justify-center',
                      {
                        backgroundColor: colors.fieldBackground,
                      },
                    )}
                  >
                    <Text
                      style={tw.style('text-sm', { color: colors.textAlt })}
                    >
                      {groupedTimers?.Break?.length || 0}
                    </Text>
                  </View>
                </View>

                <View
                  style={tw.style(
                    'flex-1 flex-row justify-end items-center gap-2',
                  )}
                >
                  <TouchableOpacity
                    onPress={() => startAllTimers(groupedTimers?.Break)}
                    style={tw.style('px-2 py-1 rounded', {
                      backgroundColor: colors.fieldBackground,
                    })}
                  >
                    <Text
                      style={tw.style('text-sm', { color: colors.textAlt })}
                    >
                      Start All
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => pauseAllTimers(groupedTimers?.Break)}
                    style={tw.style('px-2 py-1 rounded', {
                      backgroundColor: colors.fieldBackground,
                    })}
                  >
                    <Text
                      style={tw.style('text-sm', { color: colors.textAlt })}
                    >
                      Pause All
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              {/* Timers List */}
              {currentOpenCategory === 'Break' && (
                <FlatList
                  data={groupedTimers?.Break}
                  keyExtractor={item => item._id}
                  contentContainerStyle={tw.style('px-4 pt-4 pb-2')}
                  renderItem={({ item }) => {
                    const completedPercentage =
                      ((item.duration - item.remaining_duration) /
                        item.duration) *
                      100;
                    return (
                      <View
                        style={tw.style('mb-3 p-4 border rounded', {
                          borderColor: colors.border,
                          backgroundColor: colors.fieldBackground,
                        })}
                      >
                        <View
                          style={tw.style(
                            'flex-row justify-between items-center',
                          )}
                        >
                          <Text style={tw.style('font-medium')}>
                            {item.name}
                          </Text>
                          <Text
                            style={tw.style('text-sm', {
                              color: colors.textAlt,
                            })}
                          >
                            {item.status}
                          </Text>
                        </View>

                        <Text style={tw.style('font-bold text-xl mt-2')}>
                          {item?.remaining_duration}
                        </Text>

                        <View
                          style={tw.style('h-2 rounded mt-2', {
                            backgroundColor: colors.foregroundAlt,
                          })}
                        >
                          <View
                            style={tw.style('h-full rounded', {
                              width: `${completedPercentage}%`,
                              backgroundColor: colors.text,
                            })}
                          />
                        </View>

                        <View
                          style={tw.style(
                            'flex-1 flex-row items-center mt-4 gap-2',
                          )}
                        >
                          <TouchableOpacity
                            onPress={() => timerPress(item)}
                            style={tw.style(
                              'flex-4 rounded justify-center items-center py-2',
                              {
                                backgroundColor: colors.text,
                              },
                            )}
                          >
                            <Text
                              style={tw.style('text-sm', {
                                color: colors.background,
                              })}
                            >
                              {item.status === 'Running'
                                ? 'Pause'
                                : item.status === 'Paused'
                                ? 'Resume'
                                : 'Start'}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => resetTimer(item)}
                            style={tw.style(
                              'flex-1 border rounded py-2 justify-center items-center',
                              {
                                borderColor: colors.textAlt,
                              },
                            )}
                          >
                            <Text
                              style={tw.style('text-sm', {
                                color: colors.textAlt,
                              })}
                            >
                              Reset
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          )}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => {
          // @ts-ignore
          navigate('AddTimer');
        }}
        style={tw.style(
          'bg-secondary rounded-full w-14 h-14 absolute bottom-4 right-4 items-center justify-center',
        )}
      >
        <Text style={tw.style('text-3xl text-white')}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
