import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddTimer from '../screens/timer/AddTimer';
import RootTabController from './RootTabController';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    return <NavigationContainer>
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }} initialRouteName='RootTabController'>
            <Stack.Screen name='AddTimer' component={AddTimer} />
            <Stack.Screen name="RootTabController" component={RootTabController} />
        </Stack.Navigator>
    </NavigationContainer>
};

export default RootNavigator