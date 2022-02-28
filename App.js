import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import University from './Screens/University';
import Home from './Screens/Home';
import College_Notice from './Screens/College_Notice';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { Store } from './redux/store';
import * as NavigationBar from 'expo-navigation-bar';

const Tab = createBottomTabNavigator();

export default function App() {
  NavigationBar.setBackgroundColorAsync("#1b1b1c");
  NavigationBar.setVisibilityAsync("hidden");
  NavigationBar.setBehaviorAsync('overlay-swipe')
  setInterval(() => {
    NavigationBar.setVisibilityAsync("hidden");
  NavigationBar.setBehaviorAsync('overlay-swipe')
  },5000)
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, size, color }) => {
              let iconName, iconName2;
              if (route.name === 'Home') {
                iconName = 'home'
                size = focused ? 25 : 22;
                color = focused ? '#fff' : '#555'
              }
              else if (route.name === 'University') {
                iconName = 'university'
                size = focused ? 25 : 22;
                color = focused ? '#fff' : '#555'
              }
              else if (route.name === 'College_Notice') {
                iconName = 'university'
                size = focused ? 25 : 22;
                color = focused ? '#fff' : '#555'
              }
              return (
                <FontAwesome5
                  name={iconName}
                  size={size}
                  color={color}
                />
              )
            },
            tabBarActiveTintColor: '#ffffff',
            // tabBarInactiveTintColor:'#555',
            tabBarActiveBackgroundColor: '#2d2d2e',
            tabBarInactiveBackgroundColor: '#1b1b1c',
            tabBarShowLabel: false,
            tabBarLabelStyle: { fontSize: 14 },
            headerShown: false,
            tabBarItemStyle: {
              backgroundColor: '#1b1b1c',
              borderWidth: 1,
            },

          })
          }
        >
          <Tab.Screen name="Home"
            component={Home}
          />
          <Tab.Screen name="University" component={University} />
          <Tab.Screen name="College_Notice" component={College_Notice} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}