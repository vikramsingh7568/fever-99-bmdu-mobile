import React, { useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import NotVerifide_icons from 'react-native-vector-icons/FontAwesome6';

export default function PaymentFail() {
    const mainFont = 'Montserrat-Regular';
    const mainFontBold = 'Montserrat-Bold'

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
            <StatusBar backgroundColor={"#ff3333"} />
            <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
                <NotVerifide_icons name='circle-exclamation' style={{ fontSize: hp(40), color: "#ff3333" }} />
            </Animated.View>
            <Text style={{ fontSize: 22, marginTop: 10 }}>Transaction Failed</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Appointment", { screen: "Appointment" })} style={{ minWidth: wp(80), height: 42, marginTop: 15, alignSelf: "center", backgroundColor: '#ff6666', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontFamily: mainFontBold, fontSize: hp(1.8) }}>Go to Appointment</Text>
            </TouchableOpacity>
        </View>
    );
}
