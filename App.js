import MainRoute from './Screens/MainRoute';
import { Provider } from 'react-redux';
import { Store } from './redux/store';
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';


export default function App() {
    NavigationBar.setBackgroundColorAsync("#1b1b1c");
    NavigationBar.setVisibilityAsync("hidden");
    SplashScreen.preventAutoHideAsync();
    setTimeout(SplashScreen.hideAsync, 5000);
    NavigationBar.setBehaviorAsync('overlay-swipe')
    setInterval(() => {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync('overlay-swipe')
    }, 5000)
    return (
      <Provider store={Store}>
        <MainRoute/>
      </Provider>
    );
  }