import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext, useState, useEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { LoginContext } from '../../App';
import Appointment from '../Components/Appointment';
import Home from '../Components/Home';
import Profile from '../Components/Profile';
import Service from '../History/Service';
import CategoryStack from '../Stacks/CategoryStack';
import { getUser } from '../Services/user.service';
import { useIsFocused } from '@react-navigation/native';
import Referal from '../Components/Referal';
import Income from '../Components/transaction/Income';
import { Roles } from '../utils/constant';
import Transactions from '../Components/transaction/Transaction';

import HisTory_icon from "react-native-vector-icons/MaterialCommunityIcons"; // history 
import Services_icons from "react-native-vector-icons/MaterialIcons"; // medical-services
import Uesr_icons from "react-native-vector-icons/FontAwesome" // medical-services
import Home_icons from 'react-native-vector-icons/Entypo'; // 
import Transfer_icons from "react-native-vector-icons/FontAwesome6" // arrow-right-arrow-left 
import Income_icons from "react-native-vector-icons/FontAwesome6" // share-from-square

import Appointement_icons from 'react-native-vector-icons/MaterialCommunityIcons';




const Botmtab = createBottomTabNavigator();

const BottamTab = () => {
    const [user, setUser] = useContext(LoginContext)
    const [userObj, setUserObj] = useState<any>({});

    const focused = useIsFocused();
    const handleGetAndSetUser = async () => {
        let userData = await getUser();
        if (userData) {
            setUserObj(userData)
        }
    }

    useEffect(() => {
        if (focused) {
            handleGetAndSetUser()
        }
    }, [focused])

    return (
        <Botmtab.Navigator screenOptions={{
            tabBarStyle: { height: hp(7.2), width: wp(100) },
            tabBarShowLabel: false,
            headerShown: false,

        }}>

            <Botmtab.Screen name='Home' component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.optionMainView}>
                            <View style={[styles.focusedDiv, {
                                backgroundColor: focused ? '#1263AC' : "",
                            }]}></View>
                            <Home_icons
                                name="home"
                                color={focused ? '#1263AC' : 'grey'}
                                style={styles.iconsStyle}
                            />
                            <Text style={[styles.textStyling, { color: focused ? '#1263AC' : 'grey', }]}>
                                Home
                            </Text>
                        </View>
                    )
                }}
            />

            {user == 'PATIENT' && <Botmtab.Screen name='Service' component={Service}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.optionMainView}>
                            <View style={[styles.focusedDiv, {
                                backgroundColor: focused ? '#1263AC' : "",
                            }]}></View>
                            <HisTory_icon
                                name="history"
                                color={focused ? '#1263AC' : 'grey'}
                                style={styles.iconsStyle}
                            />
                            <Text style={[styles.textStyling, { color: focused ? '#1263AC' : 'grey', }]}>
                                History
                            </Text>
                        </View>
                    )
                }}
            />}

            {user == 'PATIENT' && <Botmtab.Screen name='CategoryStack' component={CategoryStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.optionMainView}>

                            <View style={[styles.focusedDiv, {
                                backgroundColor: focused ? '#1263AC' : "",
                            }]}></View>
                            <Services_icons
                                name="medical-services"
                                color={focused ? '#1263AC' : 'grey'}
                                style={styles.iconsStyle}
                            />
                            <Text style={[styles.textStyling, { color: focused ? '#1263AC' : 'grey', }]}>
                                Services
                            </Text>
                        </View>
                    )
                }}
            />}

            <Botmtab.Screen name='Appointment' component={Appointment}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.optionMainView}>

                            <View style={[styles.focusedDiv, {
                                backgroundColor: focused ? '#1263AC' : "",
                            }]}></View>
                            <Appointement_icons
                                name="card-account-details-outline"
                                color={focused ? '#1263AC' : 'grey'}
                                style={styles.iconsStyle}
                            />
                            <Text style={[styles.textStyling, { color: focused ? '#1263AC' : 'grey', }]}>
                                Appointment
                            </Text>
                        </View>
                    )
                }}
            />
            {
                (userObj?.role == Roles.FRANCHISE || userObj?.role == Roles.DOCTOR) &&
                <Botmtab.Screen name='Income' component={Income}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.optionMainView}>
                                <View style={[styles.focusedDiv, {
                                    backgroundColor: focused ? '#1263AC' : "",
                                }]}></View>
                                <Income_icons
                                    name="money-bill-trend-up"
                                    color={focused ? '#1263AC' : 'grey'}
                                    style={styles.iconsStyle}
                                />
                                <Text style={[styles.textStyling, { color: focused ? '#1263AC' : 'grey', }]}>
                                    Income
                                </Text>
                            </View>
                        )
                    }}
                />
            }
            {
                userObj?.role == Roles.FRANCHISE &&
                <Botmtab.Screen name='Transaction' component={Transactions}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.optionMainView}>

                                <View style={[styles.focusedDiv, {
                                    backgroundColor: focused ? '#1263AC' : "",
                                }]}></View>
                                <Transfer_icons
                                    name="arrow-right-arrow-left"
                                    color={focused ? '#1263AC' : 'grey'}
                                    style={styles.iconsStyle}
                                />
                                <Text style={[styles.textStyling, { color: focused ? '#1263AC' : 'grey', }]}>
                                    Transaction
                                </Text>
                            </View>
                        )
                    }}
                />
            }

            <Botmtab.Screen name='Profile' component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.optionMainView}>
                            <View style={[styles.focusedDiv, {
                                backgroundColor: focused ? '#1263AC' : "",
                            }]}></View>
                            <Uesr_icons
                                name="user-o"
                                color={focused ? '#1263AC' : 'grey'}
                                style={styles.iconsStyle}
                            />
                            <Text style={[styles.textStyling, { color: focused ? '#1263AC' : 'grey', }]}>
                                Profile
                            </Text>
                        </View>
                    )
                }}
            />

        </Botmtab.Navigator>
    )
}

export default BottamTab;
const styles = StyleSheet.create({
    optionMainView: {
        height: hp(7.5),
        width: wp(20)
    },
    focusedDiv: {
        height: hp(.30),
        width: wp(20),
    },
    textStyling: {
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: hp(1.50)
    },
    iconsStyle: {
        alignSelf: 'center',
        marginTop: hp(.5),
        fontSize: hp(2.9),
    }
})