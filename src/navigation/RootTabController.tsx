import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import home from "../screens/home/home";
import history from "../screens/history/history";

const Tab = createBottomTabNavigator();

const RootTabController = () => {
    return <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Home" component={home} />
        <Tab.Screen name="History" component={history} />
    </Tab.Navigator>
};

export default RootTabController