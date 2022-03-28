import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground,Alert, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getCities, upgradeCities, deleteCities, deletecollege, getCollege,refreshcities,refreshcollege,getWbunive,deleteWbunive,refreshWbunive } from '../redux/actions';
import * as BackgroundFetch from "expo-background-fetch"
import * as TaskManager from "expo-task-manager"
import * as Notifications from 'expo-notifications';
import * as SQLite from 'expo-sqlite';
import Constants from 'expo-constants';
import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import { startActivityAsync, ActivityAction,ResultCode } from 'expo-intent-launcher';
import LottieView from 'lottie-react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const TASK_NAME = "BACKGROUND_TASK"

var today;
TaskManager.defineTask(TASK_NAME, async () => {

  // fetch data here...
  await onPressHandler(0);
  await onPressHandler2(0);
  await onPressHandler3(0);
 
  return BackgroundFetch.BackgroundFetchResult.NewData

})

const RegisterBackgroundTask = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 900, // seconds,
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    })
    console.log("Task registered")
  } catch (err) {
    console.log("Task Register failed:", err)
  }
}


let dispatch;
const API_URL = 'https://makaut1.ucanapply.com/smartexam/public/api/notice-data';
const db = SQLite.openDatabase('db.testDb7')

const onPressHandler = async (sw) => {
  console.log("Pressed")
  try {
    const result = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await result.json();
    const json_len = (json.data).length


    if (json) {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT Title, Path FROM Users",
          [],
          async (tx, results) => {
            var len = results.rows.length;

            if (len > 0) {
              var temp = results.rows.item(0).Title
              for (let i = 0; i < json_len; i++) {
                if (json.data[i].notice_title != temp) {
                  await schedulePushNotification("Exam Notice (MAKAUT)", json.data[i].notice_title);
                 // setTimeout(() => { dispatch(upgradeCities()) }, 500)
                  dispatch(await refreshcities(true))
                  setTimeout(async() => { dispatch(await deleteCities()) }, 500)
                  setTimeout(async() => { dispatch(await getCities()) }, 1500)
                }
                else {
                  if(sw == 1){
                    await schedulePushNotification("Exam Notice (MAKAUT)", "No More New Messages");
                  }
                 // await schedulePushNotification("University Notice (MAKAUT)", "No New Messages");
                  break;
                }
              }

            }
          }
        )
      })
    } else {
      console.log('Unable to fetch!');
    }
  }
  catch (error) {
    console.log(error)
  }
}

var ch

const onPressHandler2 = async (sw) => {
  console.log("Pressed 2")
  const axios = require("axios");
        const cheerio = require('cheerio');
        const url = "https://www.bppimt.com/all-notices";
        try{
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const listItems = $(".mack_txt");
        let notices = [];

        if($){
        listItems.each((idx, el) => {    
          const notice = { title: "", path: "" };     
          notice.title = $(el).children("a").text();
          notice.path = $(el).children("a").attr("href");
         notices.push(notice);
        });
        
          db.transaction((tx) => {
            tx.executeSql(
              "SELECT Title, Path FROM Users2",
              [],
              async (tx, results) => {
                var len = results.rows.length;
    
                if (len > 0) {
                  var temp = results.rows.item(0).Title
                  for (let i = 0; i < notices.length; i++) {
                    // console.log("ch"+ch)
                    // ch="hello"
                    if (notices[i].title != temp && ch != notices[i].title ) {
                      ch=notices[i].title 
                      await schedulePushNotification("College Notice (BPPIMT)", notices[i].title);
                      dispatch(await refreshcollege(true))
                      setTimeout(async() => { dispatch(await deletecollege()) }, 500)
                      setTimeout(async() => { dispatch(await getCollege()) }, 1500)         
                    }
                    else {
                      if(sw == 1){
                      await schedulePushNotification("College Notice (BPPIMT)", "No More New Messages");
                      }
                      break;
                    }
                  }
    
                }
              }
            )
          })
        } else {
          console.log('Unable to fetch!');
        }
        }
        catch(error){
          console.log(error)
        }
      }
const onPressHandler3 = async (sw) => {
  console.log("Pressed 3")
  const axios = require("axios");
        const cheerio = require('cheerio');
        const url = "https://makautwb.ac.in/page.php?id=340";
        try{
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const listItems = $(".text-danger");
        let notices = [];

        if($){
        listItems.each((idx, el) => {    
          const notice = { title: "", path: "" };     
          notice.title = $(el).text();
          notice.path = $(el).attr("href");
         notices.push(notice);
        });
        
          db.transaction((tx) => {
            tx.executeSql(
              "SELECT Title, Path FROM Users3",
              [],
              async (tx, results) => {
                var len = results.rows.length;
    
                if (len > 0) {
                  var temp = results.rows.item(0).Title
                  for (let i = 0; i < notices.length; i++) {
                    if (notices[i].title != temp) {
                      await schedulePushNotification("University Notice (MAKAUT)", notices[i].title);
                      dispatch(await refreshWbunive(true))
                      setTimeout(async() => { dispatch(await deleteWbunive()) }, 500)
                      setTimeout(async() => { dispatch(await getWbunive()) }, 1500)
                    }
                    else {
                      if(sw == 1){
                      await schedulePushNotification("University Notice (MAKAUT)", "No More New Messages");
                      }
                      break;
                    }
                  }
    
                }
              }
            )
          })
        } else {
          console.log('Unable to fetch!');
        }
        }
        catch(error){
          console.log(error)
        }
      }

export default function Home() {
  dispatch = useDispatch();
  today = new Date()
  let tim =today.getSeconds();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [time, setTime] = useState(tim)
  const [loading, setLoading] = useState(" ")

  const notificationListener = useRef();
  const responseListener = useRef();

  const batt = async () => {
    const battery = await Battery.isBatteryOptimizationEnabledAsync();
    if (battery == true) {
      Alert.alert('Warning','Please Turn Off Battery Optimisation. Otherwise the App will not work properly.',[
        {text:'OK',onPress:()=>startActivityAsync(ActivityAction.IGNORE_BATTERY_OPTIMIZATION_SETTINGS)},
        {text:'Cancel',onPress:()=>console.log('Cancel Pressed')}
      ],{cancelable:true,
        })
    }
  }

  const timehandler = async() => {
    if ((await Network.getNetworkStateAsync()).isInternetReachable == true){
    setLoading("")
    setTime(0)
    setTimeout(() => {
      animation.current.play();
      }, 2000)
    dispatch(await getCities())
    dispatch(await getCollege())
    dispatch(await getWbunive())
    setTimeout(() => setLoading("Checking...."), 500)
    await onPressHandler(1);
    setTimeout(() => setLoading("Fetching Data From MAKAUT..."), 1000)
    await onPressHandler2(1);
    setTimeout(() => setLoading("Fetching Data From BPPIMT..."), 3000)
    await onPressHandler3(1);
    setTimeout(() => setLoading("Upgrading Database...."), 4500)
    //await schedulePushNotification("University Notice (MAKAUT)", "No New Messages");
    setTimeout(() => setLoading(" "), 5500)
    }
    else{
      setLoading("No Internet Connection")
      Alert.alert('Connection Error','Please check your Internet Connection and try again.',[
        {text:'OK',onPress:()=>console.log('Ok Pressed')}
      ],{cancelable:true,
        })
    }
  }
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  useEffect(() => {
    setTimeout(()=>{
      batt() 
      animation.current.play()
    }, 5000);
    setTimeout(async() =>{ 
       if ((await Network.getNetworkStateAsync()).isInternetReachable == true){
        setLoading("")
      setTimeout(() => setLoading("Checking...."), 1000)
    await onPressHandler(0);
    setTimeout(() => setLoading("Fetching Data From MAKAUT..."), 3500)
    await onPressHandler2(0);
    setTimeout(() => setLoading("Fetching Data From BPPIMT..."), 6500)
    await onPressHandler3(0);
    setTimeout(() => setLoading("Upgrading Database...."), 8000)
    setTimeout(() => setLoading(" "), 9500)
       }
       else{
        setLoading("No Internet Connection")
        Alert.alert('Connection Error','Please check your Internet Connection and try again.',[
          {text:'OK',onPress:()=>console.log('Ok Pressed')}
        ],{cancelable:true,
          })

          // while((await Network.getNetworkStateAsync()).isInternetReachable == false){
          //   wait(1000).then(()=>{

          //   })
          // }
       }
    }, 100)
    setInterval(()=>{
      animation.current.play();
    },40000)
    setInterval(() => {
      setTime(time+50)
      if(time>=900){
        setTime(0)
      }
    }, 50000)
    RegisterBackgroundTask()
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const animation = useRef(null);

  return (

    <ImageBackground
      style={{ flex: 1, backgroundColor: '#4C37B1' }}>
      <View style={styles.container}>
        <View style={styles.contentCenter}>
          
        <LottieView
        ref={animation}
        source={require("../utils/animation_l0o2g2ci.json")}
        style={styles.animation}
        autoPlay={false}
        loop={false}
        speed={0.25}
        resizeMode="cover"
      />
         
          
          <Text style={styles.title}>
            {loading}
          </Text>
          <Pressable
            onPress={timehandler}
            hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
            android_ripple={{ color: '#4C37B1' }}
            style={({ pressed }) => ({ backgroundColor: pressed ? '#4C37B1' : '#3D2C8D', borderRadius: 7, marginTop: 260, })}
          >
            <Text style={styles.button}>
              Check Now
            </Text>
          </Pressable>
          <Text style={styles.textStyle}>
            Last Checked: {time}s ago
          </Text>
        </View>
      </View>
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    position: 'absolute',
    bottom: 195,
    fontSize: 15,
    color: '#f4f4f4',
    //fontWeight: 'bold',
    textAlign: 'center',
    marginBottom:50

  },
  contentCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    position: 'relative',
    marginTop: 80,
    marginBottom: 50,
    color: '#f4f4f4',
    padding: 5,
  },
  button: {
    // backgroundColor:'#1b1b1c',
    fontSize: 20,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
    borderColor: '#3D2C8D',
    fontFamily: 'sans-serif-condensed',
    borderWidth: 1,
    color: '#f4f4f4',
    position: 'relative',

  },
  animation: {
    width: 150,
    height: 300,
    marginTop:80,
  },
});

async function schedulePushNotification(screen, notice_title) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: screen,
      body: notice_title,
      data: { data: 'goes here' }, 
    },
    trigger: { seconds: 1 },
    
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}