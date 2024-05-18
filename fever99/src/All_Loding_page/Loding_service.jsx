import { StyleSheet, Text, View, Image, Animated, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const mainFontBold = 'Montserrat-Bold'
const LoadingService = () => {
    const [animation] = useState(new Animated.Value(1));

    useEffect(() => {
        startAnimation();
    }, []); // Run the animation on component mount

    const startAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: .50,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    return (
        <>
            <View style={styles.mainView}>
                <Pressable style={{ display: "flex", height: hp(80), justifyContent: 'center', alignItems: 'center' }}>
                    <Animated.Image
                        source={require('../../assets/images/Logo.png')}
                        style={{
                            resizeMode: "contain",
                            height: wp(10),
                            width: wp(30),
                            transform: [{ scale: animation }],
                        }}
                    />
                </Pressable>
            </View>
        </>
    )
}

export default LoadingService;

const styles = StyleSheet.create({
    mainView: {
        height: hp(33),
        width: wp(100),
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp(1),
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loadingText: {
        fontFamily: mainFontBold,
        color: "gray",
        fontSize: wp(3)
    }
})
