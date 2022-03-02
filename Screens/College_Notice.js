import React,{useEffect,useState} from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Linking } from 'react-native';
import Constants from 'expo-constants';
import { useDispatch } from 'react-redux';
import { deletecollege, getCollege } from '../redux/actions';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('db.testDb7')

const College_Notice = () => {
    const dispatch = useDispatch(); 
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
   setInterval(async()=>{await setData()},2000)
   dispatch(await getCollege())
   await setData()
    }, [])
    
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }
    const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async() => {
    setRefreshing(true);
   setTimeout(()=>{dispatch(deletecollege())}, 500)
  setTimeout(async()=>{dispatch(await getCollege())}, 1500)
   setTimeout(async()=>{await setData()}, 2500)
    wait(5000).then(() => setRefreshing(false));
  }

    return (
      <View style={styles.body}>
      <Text style={[
          styles.text
      ]}>
          COLLEGE NOTICES
      </Text>
      <FlatList
       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#ff2517']}
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
      backgroundColor: '#000000',
  },
  text: {
      fontSize: 35,
      marginTop: Constants.statusBarHeight+1,
      marginBottom: 10,
      fontWeight: 'bold',
      color: '#ffffff',
      borderWidth: 1,
      borderColor: '#ffffff',
      width: '100%',
      textAlign: 'center',
  },
  input: {
      width: 300,
      borderWidth: 1,
      borderColor: '#555',
      borderRadius: 10,
      backgroundColor: '#ffffff',
      //textAlign: 'center',
      fontSize: 20,
      marginTop: 130,
      marginBottom: 10,
  },
  item: {
      backgroundColor: '#242124',
      borderWidth: 1,
      borderColor: '#555',
      borderRadius: 5,
      fontFamily: 'Roboto',
      // justifyContent: 'center',
      // alignItems: 'center',
  },
  title: {
      fontSize: 20,
      margin: 10,
      color: '#ffffff',
      fontFamily: 'sans-serif-condensed',
     
  },
  subtitle: {
      fontSize: 10,
      margin: 10,
      color: '#999999',
  }
})

export default College_Notice;