import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import University from './University';
import Home from './Home';
import WB_University from './WB_University';
import College_Notice from './College_Notice';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

export default function App() {
  const { cities,notices,recities,renotice,rewbunive} =useSelector(state => state.userReducer);
    return (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, size, color }) => {
                let iconName, iconName2;
                if (route.name === 'Home') {
                  iconName = 'home'
                  size = focused ? 25 : 22;
                  color = focused ? '#fff' : '#8c93a3'
                }
                else if (route.name === 'University') {
                  iconName = 'etsy'
                  size = focused ? 25 : 22;
                  color = focused ? '#fff' : '#8c93a3'
                }
                else if (route.name === 'College_Notice') {
                  iconName = 'cuttlefish'
                  size = focused ? 25 : 22;
                  color = focused ? '#fff' : '#8c93a3'
                }
                else if (route.name === 'WB_University') {
                  iconName = 'underline'
                  size = focused ? 25 : 22;
                  color = focused ? '#fff' : '#8c93a3'
                }
                return (
                  <FontAwesome5
                    name={iconName}
                    size={size}
                    color={color}
                  />
                )
              },
              // tabBarActiveTintColor: '#ffffff',
              // tabBarInactiveTintColor:'#555',
              // tabBarActiveBackgroundColor: '#2d2d2e',
             // tabBarInactiveBackgroundColor: '#1b1b1c',
              tabBarShowLabel: false,
              tabBarLabelStyle: { fontSize: 14 },
              headerShown: false,
              tabBarStyle: {
                backgroundColor: route.name=='Home'?'#3D2C8D':route.name=='University'?'#3D2D89':route.name=='College_Notice'?'#2B7A8B':'#883544',
                borderWidth: 0,
              },

            })
            }
          >
            <Tab.Screen name="Home"
              component={Home}
            />
            <Tab.Screen name="University" component={University} options={{tabBarBadge:recities?'!':null}} />
            <Tab.Screen name="College_Notice" component={College_Notice} options={{tabBarBadge:renotice?'!':null}}/>
            <Tab.Screen name="WB_University" component={WB_University} options={{tabBarBadge:rewbunive?'!':null}}/>
          </Tab.Navigator>
        </NavigationContainer>

    );
  }