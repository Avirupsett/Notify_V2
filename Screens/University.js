import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Alert
} from 'react-native';

import * as SQLite from 'expo-sqlite';
import { useSelector, useDispatch } from 'react-redux';
import { getCities,upgradeCities,deleteCities,refreshcities } from '../redux/actions';
import { Linking } from 'react-native';
import Constants from 'expo-constants';
import * as Network from 'expo-network';


const db = SQLite.openDatabase('db.testDb7')

export default function University({ navigation, route }) {

   const { cities,notices,recities} =useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const [indicate, setIndicate] = useState(true)

    const [value, setValue] = useState([]);

    useEffect(async() => {
        setInterval(async()=>{await setData()},5000)
        await setData();
        // await dispatch(deleteCities());
        if ((await Network.getNetworkStateAsync()).isInternetReachable == true){
        dispatch(await getCities())
        }
        // setTimeout(()=>{dispatch(upgradeCities)}, 500)
        // setTimeout(()=>{dispatch(deleteCities())}, 2000)
        // setTimeout(()=>{dispatch(getCities())}, 5000)
        // dispatch(upgradeCities());
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

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }
    const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async() => {
    if ((await Network.getNetworkStateAsync()).isInternetReachable == true){
    setRefreshing(true);
    setTimeout(async()=>{dispatch(await refreshcities(false))},2000);
   // setTimeout(()=>{dispatch(upgradeCities)}, 500)
    setTimeout(async()=>{dispatch(await deleteCities())}, 500)
    setTimeout(async()=>{dispatch(await getCities())}, 1500)
    setTimeout(async()=>{await setData()}, 3500)
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
                EXAM NOTICES
            </Text>
            {recities && <Text style={styles.refresh}>
                New Message arrived! Pull Down to refresh ↓
            </Text>}
            {indicate && <ActivityIndicator size="large" color="#8274CC" animating={indicate} />}
            <FlatList
            refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                          colors={['#3D2D89','#5B49AE']}
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
        backgroundColor: '#3D2D89',
    },
    text: {
        fontSize: 32,
        marginTop: Constants.statusBarHeight+1,
        marginBottom: 0,
        fontWeight: 'bold',
        color: '#ffffff',
        borderWidth: 2,
        borderBottomColor: '#8274CC',
        borderTopColor: '#3D2D89',
        borderRightColor: '#3D2D89',
        borderLeftColor: '#3D2D89',
        padding: 10,
        paddingTop: 15,
        width: '100%',
        textAlign: 'center',
    },
 
    item: {
        backgroundColor: '#5B49AE',
        borderWidth: 1,
        borderBottomColor: '#796CBA',
        borderTopColor: '#5B49AE',
        borderRightColor: '#5B49AE',
        borderLeftColor: '#5B49AE',
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
        backgroundColor: '#796CBA',
        color: '#ffffff',
        width: '100%',
        textAlign: 'center',
        padding:5
    }

})