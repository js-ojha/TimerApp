// @ts-nocheck
import React, { useState } from 'react';
import { useTimer } from '../../provider/TimerProvider';
import { Timer } from '../../types/timer';
import ScreenContainer from '../../component/ScreenContainer';
import tw from '../../lib/tailwind';
import { useTheme } from '../../provider/ThemeProvider';
import Text from '../../component/Text';
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { showError, showSuccess } from '../../utils/helpers';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from '../../utils/icons';

const AddTimer = () => {
  const { state, dispatch } = useTimer();
  const [timer, setTimer] = useState<Timer | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState<boolean | string>(
    false,
  );
  const { colors } = useTheme();
  const { goBack } = useNavigation();

  const MidAlerts = [0, 25, 50, 75];

  const submitHandler = () => {
    if (!timer?.name || !timer?.duration || !timer?.category) {
      showError('Please fill all fields');
      return;
    }

    const newTimer: Timer = {
      _id: Math.random().toString(36).substring(2, 15),
      name: timer.name,
      duration: parseInt(timer.duration, 10),
      category: timer.category,
      mid_trigger: timer?.mid_trigger || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completion_time: '',
      remaining_duration: parseInt(timer.duration, 10),
      status: 'Created',
    };

    dispatch({ type: 'ADD_TIMER', payload: newTimer });
    showSuccess('Timer created successfully');
    goBack();
    // Reset the timer state
    setTimer(null);
    setDropdownVisible(false);
  };

  return (
    <ScreenContainer
      style={tw.style({ backgroundColor: colors.backgroundAlt })}
    >
      <View style={tw.style('flex-row gap-4')}>
        <TouchableOpacity onPress={() => goBack()} style={tw.style('p-2')}>
          <ArrowLeft color={colors.text} size={28} />
        </TouchableOpacity>
        <View style={tw.style('flex-1')}>
          <Text style={tw.style('font-medium text-lg')}>Create Timer</Text>
          <Text style={tw.style('text-sm', { color: colors.textAlt })}>
            Lets set a new goal & rock our world 💃
          </Text>
        </View>
      </View>
      <ScrollView>
        {/* Timer creation form would go here with fields name, duration, category, mid-alert */}
        <Text
          style={tw.style('mt-4 text-sm font-medium', {
            color: colors.textAlt,
          })}
        >
          Timer Name
        </Text>
        <TextInput
          value={timer?.name || ''}
          onChangeText={text => setTimer({ ...timer, name: text })}
          placeholder="Enter timer name"
          style={tw.style('border p-2 my-2 rounded', {
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.fieldBackground,
          })}
          placeholderTextColor={colors.textDisabled}
        />

        <Text
          style={tw.style('mt-4 text-sm font-medium', {
            color: colors.textAlt,
          })}
        >
          Timer Duration (in seconds)
        </Text>
        <TextInput
          value={timer?.duration || ''}
          onChangeText={text => setTimer({ ...timer, duration: text })}
          placeholder="Enter timer duration (in seconds)"
          style={tw.style('border p-2 my-2 rounded', {
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.fieldBackground,
          })}
          placeholderTextColor={colors.textDisabled}
          keyboardType="numeric"
        />

        <Text
          style={tw.style('mt-4 text-sm font-medium', {
            color: colors.textAlt,
          })}
        >
          Timer Category
        </Text>
        <View style={tw.style('relative')}>
          <TouchableOpacity
            onPress={() => setDropdownVisible('category')}
            style={tw.style('border p-2 my-2 rounded', {
              borderColor: colors.border,
              backgroundColor: colors.fieldBackground,
            })}
          >
            <Text
              style={tw.style('text-sm', {
                color: timer?.category ? colors.text : colors.textDisabled,
              })}
            >
              {timer?.category || 'Select a category'}
            </Text>
          </TouchableOpacity>
          {dropdownVisible === 'category' && (
            <FlatList
              data={state?.categories || []}
              keyExtractor={item => item}
              style={tw.style('absolute top-full left-0 right-0 z-10')}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setTimer({ ...timer, category: item });
                    setDropdownVisible(false);
                  }}
                  style={tw.style('p-2', {
                    backgroundColor: colors.fieldBackground,
                  })}
                >
                  <Text style={tw.style('text-sm', { color: colors.text })}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <Text
          style={tw.style('mt-4 text-sm font-medium', {
            color: colors.textAlt,
          })}
        >
          Set Mid Alerts (optional)
        </Text>

        <View style={tw.style('relative')}>
          <TouchableOpacity
            onPress={() => setDropdownVisible('mid_trigger')}
            style={tw.style('border p-2 my-2 rounded', {
              borderColor: colors.border,
              backgroundColor: colors.fieldBackground,
            })}
          >
            <Text
              style={tw.style('text-sm', {
                color: timer?.mid_trigger ? colors.text : colors.textDisabled,
              })}
            >
              {timer?.mid_trigger || 'Select a mid alert point (optional)'}
            </Text>
          </TouchableOpacity>
          {dropdownVisible === 'mid_trigger' && (
            <FlatList
              data={MidAlerts}
              keyExtractor={item => 'trigger-' + item}
              style={tw.style('absolute top-full left-0 right-0 z-10')}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setTimer({ ...timer, mid_trigger: item });
                    setDropdownVisible(false);
                  }}
                  style={tw.style('p-2', {
                    backgroundColor: colors.fieldBackground,
                  })}
                >
                  <Text style={tw.style('text-sm', { color: colors.text })}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={submitHandler}
          style={tw.style(
            'bg-secondary p-3 rounded mt-16 justify-center items-center',
          )}
        >
          <Text style={tw.style('text-white font-medium')}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
};

export default AddTimer;
