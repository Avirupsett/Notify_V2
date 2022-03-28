import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View, ActivityIndicator,Alert } from 'react-native';
import { Linking } from 'react-native';
import Constants from 'expo-constants';
import { useDispatch, useSelector } from 'react-redux';
import { getWbunive, deleteWbunive,refreshWbunive } from '../redux/actions';
import * as SQLite from 'expo-sqlite';
import * as Network from 'expo-network';

const db = SQLite.openDatabase('db.testDb7')

const College_Notice = () => {
  const dispatch = useDispatch();
  const { cities,notices,recities,renotice,rewbunive} =useSelector(state => state.userReducer);
 // const axios = require("axios");
  //const cheerio = require('cheerio');

  //const url = "https://makautwb.ac.in/page.php?id=340";
  //const [notices, setNotices] = useState([])
  const [value, setValue] = useState([])
  const [indicate, setIndicate] = useState(true)

  const setData = async () => {

    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT Title, Path FROM Users3",
          [],
          (tx, results) => {
            var len = results.rows.length;
            let temp = []
            if (len > 0) {
              for (let i = 0; i < len; i++) {
                var Title = results.rows.item(i).Title;
                var Path = results.rows.item(i).Path;
                temp.push({ title: Title, path: Path });
                setIndicate(false)
              }
              setValue(temp);

            }
          }
        )
      })
    } catch (error) {
      console.log(error);
    }
  }
  // async function scrapeData() {
  //   try {
  //     var headers = {
  //       'Connection': 'keep-alive',
  //       'sec-ch-ua': '^\^',
  //       'sec-ch-ua-mobile': '?1',
  //       'sec-ch-ua-platform': '^\^Android^\^',
  //       'Upgrade-Insecure-Requests': '1',
  //       'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Mobile Safari/537.36',
  //       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  //       'Sec-Fetch-Site': 'none',
  //       'Sec-Fetch-Mode': 'navigate',
  //       'Sec-Fetch-User': '?1',
  //       'Sec-Fetch-Dest': 'document',
  //       'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
  //       'Cookie': 'PHPSESSID=limcblndlbeji12d8m7r59utm3; SEDITIO=MDpfOjA6Xzp3YnV0',
  //     };
  //     const { data } = await axios.get(url, headers = headers);
  //     const $ = cheerio.load(data);
  //     let notify = [];
  //     if ($) {
  //       console.log(data.length)
  //       if (data.length > 0) {
  //         setIndicate(false)
  //       }
  //       const listItems = $(".text-danger");
  //       listItems.each((idx, el) => {
  //         const notice = { title: "", path: "" };
  //         notice.title = $(el).text();
  //         notice.path = $(el).attr("href");
  //         //  let notice=$(el).attr("href")
  //         //  let notice=$(el).text()

  //         notify.push(notice);
  //       });
  //       // console.log(notices);
  //       //setIndicate(false)
  //       setNotices(notify);
  //     }

  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  useEffect(async () => {
    //await scrapeData()
    setInterval(async () => { await setData() }, 5000)
    await setData()
    if ((await Network.getNetworkStateAsync()).isInternetReachable == true){
    dispatch(await getWbunive())
    }
  }, [])

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    if ((await Network.getNetworkStateAsync()).isInternetReachable == true){
    setRefreshing(true);
    setTimeout(async()=>{dispatch(await refreshWbunive(false))},2000);
    setTimeout(async() => {dispatch(await deleteWbunive()) }, 500)
    setTimeout(async () => { dispatch(await getWbunive()) }, 1500)
    setTimeout(async () => { await setData() }, 2500)
    wait(5000).then(() => setRefreshing(false));
    }
    else{
      Alert.alert('Connection Error','Please check your Internet Connection and try again.',[
        {text:'OK',onPress:()=>console.log('Ok Pressed')}
      ],{cancelable:true,
        })
    }
  }

  return (
    <View style={styles.body}>
      <Text style={[
        styles.text
      ]}>
        UNIVERSITY NOTICES
      </Text>
      {rewbunive && <Text style={styles.refresh}>
                New Message arrived! Pull Down to refresh ↓
            </Text>}
      {indicate && <ActivityIndicator size="large" color="#CEADB3" animating={indicate} />}
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#883544', '#B44559']}
          />
        }
        data={value}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title} onPress={() => Linking.openURL(`https://makautwb.ac.in/` + item.path)}>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#883544',
  },
  text: {
    fontSize: 32,
    marginTop: Constants.statusBarHeight + 1,
    marginBottom: 0,
    fontWeight: 'bold',
    color: '#ffffff',
    borderWidth: 1,
    borderBottomColor: '#CEADB3',
    borderTopColor: '#883544',
    borderRightColor: '#883544',
    borderLeftColor: '#883544',
    padding: 10,
    paddingTop: 15,
    width: '100%',
    textAlign: 'center',
  },

  item: {
    backgroundColor: '#B44559',
    borderWidth: 1,
    borderBottomColor: '#C88793',
    borderTopColor: '#B44559',
    borderRightColor: '#B44559',
    borderLeftColor: '#B44559',
    borderRadius: 5,
    fontFamily: 'Roboto',
  },
  title: {
    fontSize: 19,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 6,
    color: '#ffffff',
    fontFamily: 'sans-serif-condensed',

  },
  refresh: {
    fontSize: 15,
    backgroundColor: '#C88793',
    color: '#ffffff',
    width: '100%',
    textAlign: 'center',
    padding: 5
  }
})

export default College_Notice;