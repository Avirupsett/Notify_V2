import React,{useEffect,useState} from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View,ActivityIndicator,Alert } from 'react-native';
import { Linking } from 'react-native';
import Constants from 'expo-constants';
import { useDispatch,useSelector } from 'react-redux';
import { deletecollege, getCollege,refreshcollege } from '../redux/actions';
import * as SQLite from 'expo-sqlite';
import * as Network from 'expo-network';

const db = SQLite.openDatabase('db.testDb7')

const College_Notice = () => {
    const dispatch = useDispatch(); 
    const { cities,notices,recities,renotice} =useSelector(state => state.userReducer);
    const [indicate, setIndicate] = useState(true)
    /*const axios = require("axios");
    const cheerio = require('cheerio');

    const url = "https://www.bppimt.com/all-notices";
    const [notices, setNotices] = useState([])*/
    const [value, setValue] = useState([])

    const setData = async () => {

        try {      
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT Title, Path FROM Users2",
                    [],
                    (tx, results) => {
                        var len = results.rows.length;
                        let temp=[]
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                            var Title = results.rows.item(i).Title;
                            var Path = results.rows.item(i).Path;
                             //console.log(Title);
                             temp.push({title:Title,path: Path});
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

    /*async function scrapeData() {
    try {
        
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const listItems = $(".mack_txt");
        let notices = [];

        listItems.each((idx, el) => {    
          const notice = { title: "", path: "" };     
          notice.title = $(el).children("a").text();
          notice.path = $(el).children("a").attr("href");
         notices.push(notice);
        });
        setNotices(notices);

    } catch (err) {
        console.error(err);
      }
    }*/

    useEffect(async() => {
   // await scrapeData()
   setInterval(async()=>{await setData()},5000)
   await setData()
   if ((await Network.getNetworkStateAsync()).isInternetReachable == true){
   dispatch(await getCollege())
   }
    }, [])
    
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }
    const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async() => {
    if ((await Network.getNetworkStateAsync()).isInternetReachable == true){
    setRefreshing(true);
    setTimeout(async()=>{dispatch(await refreshcollege(false))},2000);
   setTimeout(async()=>{dispatch(await deletecollege())}, 500)
  setTimeout(async()=>{dispatch(await getCollege())}, 1500)
   setTimeout(async()=>{await setData()}, 2500)
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
          COLLEGE NOTICES
      </Text>
      {renotice && <Text style={styles.refresh}>
                New Message arrived! Pull Down to refresh ↓
            </Text>}
      {indicate && <ActivityIndicator size="large" color="#8BB6BF" animating={indicate} />}
      <FlatList
       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2B7A8B','#8BB6BF']}
        />
}
          data={value}
          renderItem={({ item }) => (
              <View style={styles.item}>
                  <Text style={styles.title} onPress={() => Linking.openURL(item.path)}>{item.title}</Text>
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
      backgroundColor: '#2B7A8B',
  },
  text: {
    fontSize: 32,
    marginTop: Constants.statusBarHeight+1,
    marginBottom: 0,
    fontWeight: 'bold',
    color: '#ffffff',
    borderWidth: 1,
    borderBottomColor: '#ffffff',
    borderTopColor: '#2B7A8B',
    borderRightColor: '#2B7A8B',
    borderLeftColor: '#2B7A8B',
    padding: 10,
    paddingTop:15,
    width: '100%',
    textAlign: 'center',
  },

  item: {
    backgroundColor: '#4299AC',
    borderWidth: 1,
    borderBottomColor: '#8BB6BF',
    borderTopColor: '#4299AC',
    borderRightColor: '#4299AC',
    borderLeftColor: '#4299AC',
    borderRadius: 5,
    fontFamily: 'Roboto',
  },
  title: {
    fontSize: 19,
    marginBottom: 10,
    marginTop: 10,
    marginLeft:10,
    marginRight:6,
    color: '#ffffff',
    fontFamily: 'sans-serif-condensed',
     
  },
  refresh: {
    fontSize: 15,
    backgroundColor: '#8BB6BF',
    color: '#ffffff',
    width: '100%',
    textAlign: 'center',
    padding:5
}
})

export default College_Notice;