import { useNavigation } from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity,ScrollView, Animated, Image} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';

const ProfileTermsAndConditions = () => {

    const navigation: any = useNavigation();

  const translateY = useRef(new Animated.Value(hp('100%'))).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressContact = () => {
    // 
    navigation.navigate('ContactUs')
    // Add functionality for contact button
  };

  const onPressFAQ = () => {
    console.log('faq')
    // alert('comin inside')
   navigation.navigate('faq')
    // Add functionality for FAQ button
  };

  const onPressTermsAndConditions = () => {
    navigation.navigate('TAC')
    // Add functionality for terms and conditions button
  };

  const onPressCancellationAndRefundPolicy = () => {
 navigation.navigate('ReturnandRefundPolicy')
    // Add functionality for cancellation and refund policy button
  };

  const AboutUsFunction = () => {
    navigation.navigate('ProfileTemrs')
       // Add functionality for cancellation and refund policy button
     };
  const AboutPAC = () => {
    navigation.navigate('PAC')
     };

  

  return (
    <ScrollView style={{backgroundColor:'#fff'}}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../../assets/images/Logo.png')}
          resizeMode="contain"
          style={{
            flex: 0,
            width: wp(50),
            height: wp(50),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          //   style={styles.logo}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
          }}>
        Fever99
        </Text>

        <Text
        style={{
            marginTop:10,
            padding:5,
            margin:5,
            textAlign:'center'
        }}
        >
          {' '}
          Fever99 - About Us is a leading healthcare provider dedicated to
          delivering exceptional medical services to individuals and families.
          Our journey began with a simple but profound mission: to make
          healthcare accessible, convenient, and compassionate.
        </Text>
      </View>

      <View style={styles.container}>
        <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
          <TouchableOpacity style={styles.button} onPress={onPressContact}>
            <Icon name="mail" size={wp('5%')} color="#ffffff" />
            <Text style={styles.buttonText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onPressFAQ}>
            <Icon name="help-circle" size={wp('5%')} color="#ffffff" />
            <Text style={styles.buttonText}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={onPressTermsAndConditions}>
            <Icon name="file-text" size={wp('5%')} color="#ffffff" />
            <Text style={styles.buttonText}>Terms & Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={onPressCancellationAndRefundPolicy}>
            <Icon name="corner-up-left" size={wp('5%')} color="#ffffff" />
            <Text style={styles.buttonText}>Cancellation & Refund Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={AboutUsFunction}>
            <Icon name="corner-up-left" size={wp('5%')} color="#ffffff" />
            <Text style={styles.buttonText}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={AboutPAC}>
            <Icon name="corner-up-left" size={wp('5%')} color="#ffffff" />
            <Text style={styles.buttonText}>Privact Policy</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = {
  logo: {
    width: '100%',
  },
  container: {
    position: 'relative',
    bottom: 0,
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: wp('3%'),
    borderRadius: wp('3%'),
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    marginLeft: wp('2%'),
  },
};

export default ProfileTermsAndConditions;





