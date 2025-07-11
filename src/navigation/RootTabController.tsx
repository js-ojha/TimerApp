import {
  BottomTabBar,
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Home from '../screens/home/home';
import History from '../screens/history/history';
import tw from '../lib/tailwind';
import { useTheme } from '../provider/ThemeProvider';
import { Home as HomeIcon, History as HistoryIcon } from '../utils/icons';

const Tab = createBottomTabNavigator();

const TarBarIcon = ({
  name,
  color,
  size,
}: {
  color: string;
  size: number;
  name: string;
}) => {
  switch (name) {
    case 'Home':
      return <HomeIcon color={color} size={size} />;
    case 'History':
      return <HistoryIcon color={color} size={size} />;
  }
};

const RootTabController = () => {
  const { colors, dark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color, size }) => (
          <TarBarIcon name={route.name} color={color} size={size} />
        ),
        headerShown: false,
        tabBarLabelStyle: tw.style('font-normal'),
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      })}
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={(props: BottomTabBarProps) => <BottomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="History" component={History} />
    </Tab.Navigator>
  );
};

export default RootTabController;
