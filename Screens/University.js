import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    RefreshControl,
} from 'react-native';

import * as SQLite from 'expo-sqlite';
import { useSelector, useDispatch } from 'react-redux';
import { getCities,upgradeCities,deleteCities } from '../redux/actions';
import { Linking } from 'react-native';
import Constants from 'expo-constants';


const db = SQLite.openDatabase('db.testDb7')

export default function University({ navigation, route }) {

   //const { cities,display } =useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    const [value, setValue] = useState([]);

    useEffect(async() => {
        setInterval(async()=>{await setData()},2000)
        // await dispatch(deleteCities());
        dispatch(getCities())
        // setTimeout(()=>{dispatch(upgradeCities)}, 500)
        // setTimeout(()=>{dispatch(deleteCities())}, 2000)
        // setTimeout(()=>{dispatch(getCities())}, 5000)
        // dispatch(upgradeCities());
        await setData();
    }, []);


    const setData = async () => {

        try {      
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT Title, Path FROM Users",
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

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }
    const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async() => {
    setRefreshing(true);
   // setTimeout(()=>{dispatch(upgradeCities)}, 500)
    setTimeout(()=>{dispatch(deleteCities())}, 500)
    setTimeout(()=>{dispatch(getCities())}, 1500)
    setTimeout(async()=>{await setData()}, 3500)
    wait(5000).then(() => setRefreshing(false));
  }

    return (
       
        <View style={styles.body}>
            <Text style={[
                styles.text
            ]}>
                MAKAUT
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
        
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    text: {
        fontSize: 40,
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