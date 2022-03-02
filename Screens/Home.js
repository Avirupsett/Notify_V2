import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getCities, upgradeCities, deleteCities, deletecollege, getCollege } from '../redux/actions';
import * as BackgroundFetch from "expo-background-fetch"
import * as TaskManager from "expo-task-manager"
import * as Notifications from 'expo-notifications';
import * as SQLite from 'expo-sqlite';
import Constants from 'expo-constants';

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
                  await schedulePushNotification("University Notice (MAKAUT)", json.data[i].notice_title);
                 // setTimeout(() => { dispatch(upgradeCities()) }, 500)
                  setTimeout(() => { dispatch(deleteCities()) }, 500)
                  setTimeout(() => { dispatch(getCities()) }, 1500)
                }
                else {
                  if(sw == 1){
                    await schedulePushNotification("University Notice (MAKAUT)", "No More New Messages");
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
                    if (notices[i].title != temp) {
                      await schedulePushNotification("College Notice (BPPIMT)", notices[i].title);
                      setTimeout(() => { dispatch(deletecollege()) }, 500)
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

export default function Home() {
  dispatch = useDispatch();
  today = new Date()
  let tim = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [time, setTime] = useState(tim)
  const [loading, setLoading] = useState(" ")

  const notificationListener = useRef();
  const responseListener = useRef();

  const timehandler = async() => {
    today = new Date()
    let tim = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    setTime(tim)
    setTimeout(() => setLoading("Checking...."), 500)
    await onPressHandler(1);
    setTimeout(() => setLoading("Fetching Data From MAKAUT..."), 1000)
    await onPressHandler2(1);
    setTimeout(() => setLoading("Fetching Data From BPPIMT..."), 2500)
    setTimeout(() => setLoading("Upgrading Database...."), 4000)
    //await schedulePushNotification("University Notice (MAKAUT)", "No New Messages");
    setTimeout(() => setLoading(" "), 5500)
  }

  useEffect(() => {
    setInterval(() => {
      today = new Date()
      let tim = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      setTime(tim)
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

  return (

    <ImageBackground
      style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={styles.container}>
        <View style={styles.contentCenter}>
          <Image
            source={
              require('../utils/8600d76f089797d6078f2a5b52129aca.gif')
            }
            style={{
              width: '100%',
              height: '82%',
              marginTop: -25,
              marginLeft: 5
            }}
          />
          <Text style={styles.textStyle}>
            Last Checked: {time}
          </Text>
          <Text style={styles.title}>
            {loading}
          </Text>
          <Pressable
            onPress={timehandler}
            hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
            android_ripple={{ color: '#555' }}
            style={({ pressed }) => ({ backgroundColor: pressed ? '#555' : '#1b1b1c', borderRadius: 7, marginTop: 25, })}
          >
            <Text style={styles.button}>
              Check Now
            </Text>
          </Pressable>
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
    bottom: 145,
    fontSize: 15,
    color: '#f4f4f4',
    //fontWeight: 'bold',
    textAlign: 'center',

  },
  contentCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    position: 'absolute',
    bottom: -80,
    color: '#555',
    padding: 5,
  },
  button: {
    // backgroundColor:'#1b1b1c',
    fontSize: 20,
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 7,
    borderColor: '#2d2d2e',
    fontFamily: 'sans-serif-condensed',
    borderWidth: 1,
    color: '#f4f4f4',
    position: 'relative',

  }
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