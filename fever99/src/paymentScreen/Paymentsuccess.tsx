import React, { useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Verifide_icons from 'react-native-vector-icons/Octicons';

export default function Paymentsuccess() {
    const mainFont = 'Montserrat-Regular';
    const navigation: any = useNavigation()
    const animatedValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        startAnimation();
    }, []);

    const startAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: .75,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
                <Verifide_icons name='verified' style={{ fontSize: hp(40), color: "#1263AC" }} />
            </Animated.View>
            <Text style={{ fontSize: 22, marginTop: 10 }}>Payment successful</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Appointment", { screen: "Appointment" })} style={{ minWidth: wp(80), height: 42, marginTop: 15, alignSelf: "center", backgroundColor: '#1263AC', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(1.8) }}>Go to Appointment</Text>
            </TouchableOpacity>
        </View>
    );
}
