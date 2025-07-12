import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import tw from '../../lib/tailwind';
import { useTheme } from '../../provider/ThemeProvider';
import { setTheme } from '../../utils/helpers';
import { Moon, Sun } from '../../utils/icons';
import { useTimer } from '../../provider/TimerProvider';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

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
        Timers History
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

const History = () => {
  const { colors } = useTheme();
  const { state } = useTimer();

  const completedTimers = state.timers.filter(t => t.status === 'Completed');

  const exportData = async () => {
    const jsonData = JSON.stringify(state.timers, null, 2);

    // Define a file path
    const filePath = `${RNFS.DocumentDirectoryPath}/timers-export.json`;

    try {
      // Write file
      await RNFS.writeFile(filePath, jsonData, 'utf8');

      // Share file
      await Share.open({
        url: `file://${filePath}`,
        type: 'application/json',
        filename: 'timers-export.json',
      });

      console.log('Export and share successful');
    } catch (error) {
      console.log('Error exporting timers:', error);
    }
  };

  const renderHeader = () => (
    <View style={tw.style('mb-4 flex-row items-center gap-2 justify-between')}>
      <View>
        <Text
          style={tw.style('text-lg font-medium', {
            color: colors.textAlt,
          })}
        >
          Completed Timers
        </Text>
        <Text style={tw.style('text-sm', { color: colors.textDisabled })}>
          Here are your completed timers:
        </Text>
      </View>
      <TouchableOpacity
        onPress={exportData}
        style={tw.style('px-4 py-2 rounded', {
          backgroundColor: colors.fieldBackground,
        })}
      >
        <Text style={tw.style({ color: colors.textAlt })}>Export</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={tw.style('flex-1', {
        backgroundColor: colors.backgroundAlt,
      })}
    >
      <ScreenHeader />
      {!completedTimers.length && (
        <View style={tw.style('flex-1 items-center justify-center')}>
          <Text style={tw.style({ color: colors.textAlt })}>
            You have yet to complete any timers...
          </Text>
        </View>
      )}

      {!!completedTimers.length && (
        <FlatList
          data={completedTimers}
          keyExtractor={item => item._id}
          contentContainerStyle={tw.style('p-4')}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <View
              style={tw.style('mb-4 px-4 py-2 rounded border', {
                backgroundColor: colors.bubbleBackground,
                borderColor: colors.border,
              })}
            >
              <Text
                style={tw.style('text-lg font-medium', {
                  color: colors.textAlt,
                })}
              >
                {item.name} ● {item.category}
              </Text>
              <Text style={tw.style('text-sm', { color: colors.textAlt })}>
                Completed at:{' '}
                {item?.completion_time &&
                  new Date(item?.completion_time).toLocaleDateString()}
              </Text>
              <Text style={tw.style('text-sm mt-2', { color: colors.textAlt })}>
                Duration: {item.duration} seconds
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default History;
