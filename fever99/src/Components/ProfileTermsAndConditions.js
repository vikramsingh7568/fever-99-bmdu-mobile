// import React from 'react';
// import { View, Text, TouchableOpacity, Touchable } from 'react-native';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import Icon from 'react-native-vector-icons/Feather';

// const ResponsiveButton = ({ icon, title, onPress }) => {
//   return (

//     <TouchableOpacity style={styles.button} onPress={onPress}>
//       <Icon name={icon} size={wp('5%')} color="#ffffff" />
//       <Text style={styles.buttonText}>{title}</Text>
//     </TouchableOpacity>

//   );
// };

// const ProfileTermsAndConditions = () => {
//   const onPressContact = () => {
//     // Add functionality for contact button
//   };

//   const onPressFAQ = () => {
//     // Add functionality for FAQ button
//   };

//   const onPressTermsAndConditions = () => {
//     // Add functionality for terms and conditions button
//   };

//   const onPressCancellationAndRefundPolicy = () => {
//     // Add functionality for cancellation and refund policy button
//   };

//   return (
//     <View style={styles.container}>
//       <ResponsiveButton icon="mail" title="Contact" onPress={onPressContact} />
//       <ResponsiveButton icon="help-circle" title="FAQ" onPress={onPressFAQ} />
//       <ResponsiveButton icon="file-text" title="Terms & Conditions" onPress={onPressTermsAndConditions} />
//       <ResponsiveButton icon="corner-up-left" title="Cancellation & Refund Policy" onPress={onPressCancellationAndRefundPolicy} />
//     </View>
//   );
// };

// const styles = {
//   container: {
//     flexDirection: 'column',
//     justifyContent: 'space-around',
//     marginTop: hp('5%'),
//     margin:5,
//     bottom:0,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: wp('3%'),
//     borderRadius: wp('3%'),
//     flexDirection: 'row',
//     padding:10,
//     margin:10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#ffffff',
//     marginLeft: wp('2%'),
//   },
// };

// export default ProfileTermsAndConditions;

// import React, { useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity, Animated } from 'react-native';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import Icon from 'react-native-vector-icons/Feather';

// const ProfileTermsAndConditions = () => {
//   const translateY = useRef(new Animated.Value(hp('100%'))).current;

//   useEffect(() => {
//     Animated.timing(translateY, {
//       toValue: 0,
//       duration: 500, // Adjust the duration as needed
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const onPressContact = () => {
//     // Add functionality for contact button
//   };

//   const onPressFAQ = () => {
//     // Add functionality for FAQ button
//   };

//   const onPressTermsAndConditions = () => {
//     // Add functionality for terms and conditions button
//   };

//   const onPressCancellationAndRefundPolicy = () => {
//     // Add functionality for cancellation and refund policy button
//   };

//   return (
//     <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
//       <TouchableOpacity style={styles.button} onPress={onPressContact}>
//         <Icon name="mail" size={wp('5%')} color="#ffffff" />
//         <Text style={styles.buttonText}>Contact</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.button} onPress={onPressFAQ}>
//         <Icon name="help-circle" size={wp('5%')} color="#ffffff" />
//         <Text style={styles.buttonText}>FAQ</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.button} onPress={onPressTermsAndConditions}>
//         <Icon name="file-text" size={wp('5%')} color="#ffffff" />
//         <Text style={styles.buttonText}>Terms & Conditions</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.button} onPress={onPressCancellationAndRefundPolicy}>
//         <Icon name="corner-up-left" size={wp('5%')} color="#ffffff" />
//         <Text style={styles.buttonText}>Cancellation & Refund Policy</Text>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// const styles = {
//   container: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     backgroundColor: '#fff', // Adjust the background color and opacity as needed
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: wp('3%'),
//     borderRadius: wp('3%'),
//     flexDirection: 'row',
//     padding: 10,
//     margin: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#ffffff',
//     marginLeft: wp('2%'),
//   },
// };

// export default ProfileTermsAndConditions;















// import React, {useEffect, useRef} from 'react';
// import {View, Text, TouchableOpacity, Animated, Image} from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import Icon from 'react-native-vector-icons/Feather';

// const ProfileTermsAndConditions = () => {
//   const translateY = useRef(new Animated.Value(hp('100%'))).current;

//   useEffect(() => {
//     Animated.timing(translateY, {
//       toValue: 0,
//       duration: 500, // Adjust the duration as needed
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const onPressContact = () => {
//     // Add functionality for contact button
//   };

//   const onPressFAQ = () => {
//     // Add functionality for FAQ button
//   };

//   const onPressTermsAndConditions = () => {
//     // Add functionality for terms and conditions button
//   };

//   const onPressCancellationAndRefundPolicy = () => {
//     // Add functionality for cancellation and refund policy button
//   };

//   return (
//     <View
//     style={{
//         backgroundColor:'#fff'
//     }}
//     >
//       <View style={{alignItems: 'center'}}>
//         <Image
//           source={require('../../assets/images/Logo.png')}
//           resizeMode="contain"
//           style={{
//             flex: 0,
//             width: wp(50),
//             height: wp(50),
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}
//           //   style={styles.logo}
//         />
//         <Text
//           style={{
//             fontSize: 20,
//             fontWeight: 'bold',
//             marginBottom: 10,
//           }}>
//           About Us
//         </Text>

//         <Text
//         style={{
//             marginTop:10,
//             padding:5,
//             margin:5,
//             textAlign:'center'
//         }}
//         >
//           {' '}
//           Fever99 - About Us is a leading healthcare provider dedicated to
//           delivering exceptional medical services to individuals and families.
//           Our journey began with a simple but profound mission: to make
//           healthcare accessible, convenient, and compassionate.
//         </Text>
//       </View>

//       <View style={styles.container}>
//         <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
//           <TouchableOpacity style={styles.button} onPress={onPressContact}>
//             <Icon name="mail" size={wp('5%')} color="#ffffff" />
//             <Text style={styles.buttonText}>Contact</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button} onPress={onPressFAQ}>
//             <Icon name="help-circle" size={wp('5%')} color="#ffffff" />
//             <Text style={styles.buttonText}>FAQ</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={onPressTermsAndConditions}>
//             <Icon name="file-text" size={wp('5%')} color="#ffffff" />
//             <Text style={styles.buttonText}>Terms & Conditions</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={onPressCancellationAndRefundPolicy}>
//             <Icon name="corner-up-left" size={wp('5%')} color="#ffffff" />
//             <Text style={styles.buttonText}>Cancellation & Refund Policy</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>
//     </View>
//   );
// };

// const styles = {
//   logo: {
//     width: '100%',
//     // height: hp('20%'), // Adjust the height as needed
//     // resizeMode: 'contain', // Adjust the resizeMode as needed
//   },
//   container: {
//     position: 'relative',
//     bottom: 0,
//     width: '100%',
//     // backgroundColor: 'rgba(0, 0, 0, 0.8)', // Adjust the background color and opacity as needed
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: wp('3%'),
//     borderRadius: wp('3%'),
//     flexDirection: 'row',
//     padding: 10,
//     margin: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#ffffff',
//     marginLeft: wp('2%'),
//   },
// };

// export default ProfileTermsAndConditions;





























import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { GetTeam } from '../Services/user.service';
import { generateFilePath } from '../Services/url.service';

const AboutUsPage = () => {


   const [teamObject,setTeamObject] = useState([]);


    const GettingMedicalTeamData = async () => {
        try {
          const {data: res}  = await GetTeam();
           console.log('GettingMedicalTeamData in profile terms',res.data);
           setTeamObject(res.data)
          if (res.status == false) {
            console.log('GettingMedicalTeamData from backend',res)
            throw new Error(res.error);
          }
        } catch (err) {
          toastError(err);
        }
      };

      useEffect(() => {
        GettingMedicalTeamData();
      },[])



  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/Logo.png')}
          resizeMode="contain"
          style={styles.logo}
        />
        <Text style={styles.header}>About Us</Text>
      </View>

      <Text style={styles.description}>
        Fever99 is a leading healthcare provider dedicated to delivering exceptional medical services to individuals and families. Our journey began with a simple but profound mission: to make healthcare accessible, convenient, and compassionate.
      </Text>

      <Text style={styles.subHeader}>Get To Know About Fever99</Text>
      <Text style={styles.missionDescription}>
      Fever99 is a leading healthcare provider dedicated to delivering exceptional medical services to individuals and families. Our journey began with a simple but profound mission: to make healthcare accessible, convenient, and compassionate.
      </Text>

      <Image
          source={require('../../assets/images/GetToKnow.png')}
          resizeMode="contain"
          style={styles.image}
        />

      <Text style={styles.subHeader}>Our Mission</Text>
      <Text style={styles.missionDescription}>
        We embrace innovation and technology to continuously improve our services. From state-of-the-art medical equipment to telemedicine solutions, we leverage the latest advancements to offer you the most effective and convenient healthcare options.
      </Text>

      <Text style={styles.subHeader}>Our Vision</Text>
      <Text style={styles.missionDescription}>
        Our mission is to enhance the well-being of our patients by providing comprehensive and high-quality healthcare services. We believe that everyone deserves access to excellent medical care, and we strive to meet that need with professionalism and empathy. Fever99 is not just a healthcare provider; we are a part of the communities we serve. We actively engage in community initiatives and health education programs to promote overall well-being.
      </Text>


      <Image
          source={require('../../assets/images/GetToKnow.png')}
          resizeMode="contain"
          style={styles.image}
        />

        
        
      <Text style={styles.subHeader}>Founders</Text>
    
      <View style={styles.founderContainer}>

        <View style={styles.founder}>
        <Image
          source={require('../../assets/images/DrLokesh.png')}
          resizeMode="contain"
          style={{height:100,width:130}}
        />
          <Text style={styles.founderName}>Dr. Lokesh Garg</Text>
          <Text style={styles.founderDetail}>MBBS, Diploma in Tuberculosis and Chest Diseases (DTCD)</Text>
          <Text style={styles.founderRole}>Founder & Chairman</Text>
        </View>

        <View style={styles.founder}>
        <Image
          source={require('../../assets/images/DrMukesh.png')}
          resizeMode="contain"
          style={{height:100,width:130}}
        />
          <Text style={styles.founderName}>Dr. Mukesh Jain</Text>
          <Text style={styles.founderDetail}>MBBS, MD</Text>
          <Text style={styles.founderRole}>Co-Founder, Managing Director & CEO</Text>
        </View>
      </View>

      <Text style={styles.subHeader}>Medical Team</Text>
      {/* <View style={styles.medicalTeamContainer}>
        <View style={styles.employee}>
            <Image
        source={
            teamObject?.image &&
            teamObject?.image != '' &&
            teamObject?.image.includes('file')
                  ? { uri: generateFilePath(userObj?.image) }
                  : require('../../assets/images/profile.png')
              }
             / >

             
          <Text style={styles.employeeName}>Dr. Divya Gupta</Text>
          <Text style={styles.employeeSpecialization}>Obstetrician & Gynaecologist</Text>
        </View>
        <View style={styles.employee}>
          <Text style={styles.employeeName}>Dr. Mrunalini</Text>
          <Text style={styles.employeeSpecialization}>Homeopathic Consultant</Text>
        </View>
        <View style={styles.employee}>
          <Text style={styles.employeeName}>Dr. Rohit Thakkar</Text>
          <Text style={styles.employeeSpecialization}>Sr. Orthopaedic & Joint Replacement Surgeon</Text>
        </View>
        <View style={styles.employee}>
          <Text style={styles.employeeName}>Dr. Juli Juneja</Text>
          <Text style={styles.employeeSpecialization}>OBS & Gynaecologist</Text>
        </View>
      </View> */}

{teamObject.map((employee, index) => {
  console.log('Employee Image:', employee.image);
  return (
    <View>
    <View style={styles.employee} key={index}>
      <Image
        source={employee.image ? { uri: generateFilePath(employee.image) } : require('../../assets/images/profile.png')}
        resizeMode="contain"
        style={{ height: 100, width: 100 }}
      />
      <View
     style={styles.faqContainer}
      >
      <Text style={styles.employeeName}>{employee.name}</Text>
      <Text style={styles.employeeSpecialization}>{employee.role}</Text>
      <Text style={styles.employeeSpecialization}>{employee.status}</Text>
      </View>
    </View>
    </View>
  );
})}


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    bottom:10,
  },
  faqContainer: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    paddingHorizontal: 20,
    // paddingVertical: 10,
    width: '60%', // Adjust the width as needed
  },  
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  image: {
    width:300,
    height: 150,
    alignSelf:'center'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  missionDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  founderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  founder: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  founderName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  founderDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  founderRole: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  medicalTeamContainer: {
    marginBottom: 20,
  },
//   employee: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },

employee: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection:"row",
    //   borderBottomWidth: 1,
            // borderBottomColor: '#ccc',
            // paddingHorizontal: 20,
            // paddingVertical: 10,
    // width: '90%',
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  employeeSpecialization: {
    fontSize: 16,
    textAlign:"left",
  },
});

export default AboutUsPage;
