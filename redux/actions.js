import * as SQLite from 'expo-sqlite';
export const GET_CITIES = 'GET_CITIES';
export const UPGRADE_CITIES = 'UPGRADE_CITIES';
export const DELETE_CITIES = 'DELETE_CITIES';
export const GET_COLLEGE = 'GET_COLLEGE';
export const DEL_COLLEGE = 'DEL_COLLEGE';

// const API_URL = 'https://mocki.io/v1/69708724-6eed-47a6-957f-0ffd5e119d78';
const API_URL = 'https://makaut1.ucanapply.com/smartexam/public/api/notice-data';

const db = SQLite.openDatabase('db.testDb7')

export const getCities = () => {
    try {
        return async dispatch => {
            const result = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const json = await result.json();
            db.transaction((tx) => {
                tx.executeSql(
                    "CREATE TABLE IF NOT EXISTS "
                    + "Users "
                    + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT, Path TEXT);",
                )
            })

            if (json) {
                db.transaction((tx) => {
                    tx.executeSql(
                        "SELECT Title, Path FROM Users",
                        [],
                        (tx, results) => {
                            var len = results.rows.length;
                            if (len == 0) {
                                (json.data).map((item, index) => {
                                    db.transaction((tx) => {
                                        tx.executeSql(
                                            "INSERT INTO Users (Title, Path) VALUES (?, ?);",
                                            [item.notice_title, item.file_path]

                                        )
                                    })
                                })

                            }
                        }
                    )
                })

                dispatch({
                    type: GET_CITIES,
                    payload: json
                });
            } else {
                console.log('Unable to fetch!');
            }
        }
    } catch (error) {
        console.log(error);
    }
}
export const upgradeCities = () => {
    try {
        return async dispatch => {
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
                        (tx, results) => {
                            var len = results.rows.length;

                            if (len > 0) {
                                var temp = results.rows.item(0).Title
                                for (let i = 0; i < json_len; i++) {
                                    if (json.data[i].notice_title != temp) {
                                        db.transaction((tx) => {
                                            tx.executeSql(
                                                "INSERT INTO Users (Title, Path) VALUES (?, ?);",
                                                [json.data[i].notice_title, json.data[i].file_path]

                                            )
                                        })
                                    }
                                    else {
                                        break;
                                    }
                                }

                            }
                        }
                    )
                })

                dispatch({
                    type: UPGRADE_CITIES,
                    payload: json
                });
            } else {
                console.log('Unable to fetch!');
            }
        }
    } catch (error) {
        console.log(error);
    }
}
export const deleteCities = () => {
    try {
        return async dispatch => {
            db.transaction((tx) => {
                tx.executeSql(
                    "DELETE FROM Users",
                    [],
                    () => { },
                    error => { console.log(error) }
                )
            })

            dispatch({
                type: DELETE_CITIES,
                payload: "json"
            });

        }

    }
    catch (error) {
        console.log(error);
    }
}

export const getCollege = async() => {
    try {
        return async dispatch => {
        const axios = require("axios");
        const cheerio = require('cheerio');

        const url = "https://www.bppimt.com/all-notices";

        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                + "Users2 "
                + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT, Path TEXT);",
            )
        })
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        if ($) {
            const listItems = $(".mack_txt");
            let notices=[]

            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT Title, Path FROM Users2",
                    [],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len == 0) {
                            listItems.each((idx, el) => {
                                const notice = { title: "", path: "" };
                                notice.title = $(el).children("a").text();
                                notice.path = $(el).children("a").attr("href");
                                notices.push(notice);
                                db.transaction((tx) => {
                                    tx.executeSql(
                                        "INSERT INTO Users2 (Title, Path) VALUES (?, ?);",
                                        [notice.title, notice.path]

                                    )
                                })
                            });

                        }
                    }
                )
            })

             dispatch({
                    type: GET_COLLEGE,
                    payload: notices
                });
            } else {
                console.log('Unable to fetch!');
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export const deletecollege = () => {
    try {
        return async dispatch => {
            db.transaction((tx) => {
                tx.executeSql(
                    "DELETE FROM Users2",
                    [],
                    () => { },
                    error => { console.log(error) }
                )
            })

            dispatch({
                type: DEL_COLLEGE,
                payload: "json"
            });

        }

    }
    catch (error) {
        console.log(error);
    }
}