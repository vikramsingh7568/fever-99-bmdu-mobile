import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr';
import Openeye_closeEye from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import {generateFilePath} from '../Services/url.service';
import {
  getUser,
  setUser,
  updatePassword,
  updateProfile,
} from '../Services/user.service';
import {toastError, toastSuccess} from '../utils/toast.utils';
import {Roles} from '../utils/constant';
const {height, width} = Dimensions.get('window');
import {useNetInfo} from '@react-native-community/netinfo';
import InterNetError from '../noInterNet/InterNetError';
const EditProfile = () => {
  // checking internet connection
  const netInfo = useNetInfo();
  const isConnected = netInfo.isConnected;
  const focused = useIsFocused();
  const mainFont = 'Montserrat-Regular';
  const mainFontBold = 'Montserrat-Bold';
  const mainFontmedium = 'Montserrat-Medium';
  const maincolor = '#1263AC';

  const navigation: any = useNavigation();

  const [profilePhoto, setProfilePhoto] = useState('');
  const [email, setemail] = useState();
  const [gender, setGender] = useState('Male');
  const [image, setImage] = useState<any>('');
  const [serviceCharge, setServiceCharge] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [mobile, setMobile] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [abhaid, setAbhaid] = useState('');
  const [userObj, setUserObj] = useState<any>('');
  const [isLoading, setisLodings] = useState(true);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [viewOldpasswd, setViewOldPasswd] = useState(true);
  const [viewPasswd, setViewPasswd] = useState(true);
  const [preView, setPreviewPasswd] = useState(true);

  const handleGetAndSetUser = async () => {
    setisLodings(true);
    try {
      let userData = await getUser();
      if (userData) {
        setUserObj(userData);
        setGender(userData?.gender);
        setImage(userData?.image);
        setServiceCharge(userData?.serviceCharge);
        setAddress(userData?.address);
        setName(userData?.name);
        setPinCode(userData?.pinCode);
        setState(userData?.state);
        setMobile(userData?.mobile);
        setSpecialization(userData?.specialization);
        setAbhaid(userData?.abhaid);
        console.log('user data and apiid',abhaid)
        setemail(userData?.email);
        setProfilePhoto(userData?.image);
        setisLodings(false);
      }
    } catch (err) {
      toastError(err);
    }
  };

  useEffect(() => {
    if (focused) {
      handleGetAndSetUser();
    }
  }, [focused]);

  useEffect(() => {
      handleGetAndSetUser();
  }, []);

  // const handleDocumentPicker = async () => {
  //   try {
  //     let file: any = await DocumentPicker.pickSingle({
  //       presentationStyle: 'fullScreen',
  //       type: [DocumentPicker.types.images],
  //     });
  //     if (file) {
  //       setImage(file);
  //     }
  //   } catch (error) {
  //     toastError(error);
  //   }
  // };

  const handleDocumentPicker = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.images],
      });
      if (file) {
        const imageSizeInMB = file.size / (1024 * 1024); // convert bytes to MB
        if (imageSizeInMB > 2) {
          Alert.alert('Select a photo with less than 2MB');
        } else {
          setImage(file);
        }
      }
    } catch (error) {
      toastError(error);
    }
  };


  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const handleSubmit = async () => {
    try {

      setIsLoadingSubmit(true); // Set loading state to true

      let formData = new FormData();

      

      Object.entries(userObj).map(entry => {
        const [key, value] = entry;
      });

      formData.append('serviceCharge', serviceCharge);
      formData.append('address', address);
      formData.append('name', name);
      formData.append('pinCode', pinCode);
      formData.append('state', state);
      formData.append('gender', gender);
      formData.append('mobile', mobile);
      formData.append('specialization', specialization);
      formData.append('image', image);
      if (userObj.role == Roles.DOCTOR) {
        formData.append('abhaid', abhaid);
      }

       console.log('this is form data without entry',{serviceCharge,abhaid,address,name,pinCode,state,gender,mobile,specialization,image})

      let {data: res}: any = await updateProfile(formData);
      if (res) {
        toastSuccess(res.message);
        await setUser(res.data);
        setGender(res.data?.gender);
        setImage(res.data?.image);
        setServiceCharge(res.data?.serviceCharge);
        setAddress(res.data?.address);
        setName(res.data?.name);
        setPinCode(res.data?.pinCode);
        setState(res.data?.state);
        setMobile(res.data?.mobile);
        setSpecialization(res.data?.specialization);
        setAbhaid(res.data?.abhaid);
        setemail(res.data?.email);
        setProfilePhoto(res.data?.image);
        setUserObj(res.data);
        navigation.goBack();
      }
      setIsLoadingSubmit(false); // Set loading state to true

    } catch (error) {
      setIsLoadingSubmit(false); // Set loading state to true

      toastError(error);
    }
  };

  const handleRenderProfilePhoto = () => {
    if (image && image?.uri && image?.uri != '') {
      return {uri: image?.uri};
    } else if (
      profilePhoto &&
      profilePhoto != '' &&
      profilePhoto.includes('file')
    ) {
      return {uri: generateFilePath(profilePhoto)};
    } else {
      return require('../../assets/images/profile.png');
    }
  };

  const handleUpdatePasswordSubmit = async () => {
    try {
      if (newPassword == '') {
        toastError('Please enter new password');
        return;
      }
      if (oldPassword == '') {
        toastError('Please enter old password');
        return;
      }
      if (confirmPassword == '') {
        toastError('Please enter confirm password');
        return;
      }
      if (newPassword != confirmPassword) {
        toastError('Confirm password does not match new password');
        return;
      }

      let obj = {
        newPassword,
        oldPassword,
        confirmPassword,
      };
      let {data: res}: any = await updatePassword(obj);
      if (res.success) {
        toastSuccess(res.message);
        navigation.goBack();
      }
    } catch (error) {
      toastError(error);
    }
  };

  if (isConnected == false) {
    return <InterNetError labels={'Edit Profile'} />;
  } else {
    return (
      <ScrollView
        style={{backgroundColor: 'white', paddingBottom: hp(5)}}
        showsVerticalScrollIndicator={false}>
        <Headerr secndheader={true} label="Edit Profile" />
        <ScrollView
          style={{width: wp(95), alignSelf: 'center'}}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}>
            <TouchableOpacity onPress={() => handleDocumentPicker()}>
              <Image
                source={handleRenderProfilePhoto()}
                style={{
                  height: wp(25),
                  width: wp(25),
                  resizeMode: 'center',
                  borderRadius: wp(40),
                  marginTop: hp(1.5),
                }}
              />
            </TouchableOpacity>
          </View>
          
          <View style={{marginTop: hp(1.5), width: wp(95)}}>
            <View style={{width: wp(95)}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.7),
                  fontFamily: mainFontmedium,
                }}>
                Name
              </Text>
              <TextInput
                onChangeText={e => setName(e)}
                value={name}
                placeholder={isLoading ? 'Loading...' : 'Enter Your Name'}
                placeholderTextColor={'gray'}
                style={styles.inputfildeStyle}
              />
            </View>
            <View style={{width: wp(95), marginTop: hp(2)}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.7),
                  fontFamily: mainFontmedium,
                }}>
                Email
              </Text>
              <View style={{width: wp(95)}}>
                <TextInput
                  value={email}
                  editable={false}
                  placeholder={
                    isLoading ? 'Loading...' : 'Enter Your Phone Email'
                  }
                  placeholderTextColor={'gray'}
                  style={[styles.inputfildeStyle, {backgroundColor: '#eee'}]}
                />
              </View>
            </View>
            <View style={{width: wp(95), marginTop: hp(2)}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.7),
                  fontFamily: mainFontmedium,
                }}>
                Phone Number
              </Text>
              <TextInput
                onChangeText={e => setMobile(e)}
                value={mobile}
                editable={false}
                placeholder={
                  isLoading ? 'Loading...' : 'Enter Your Phone Number'
                }
                placeholderTextColor={'gray'}
                style={styles.inputfildeStyle}
              />
            </View>
            <View style={{width: wp(95), marginTop: hp(2)}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.7),
                  fontFamily: mainFontmedium,
                }}>
                Address
              </Text>
              <TextInput
                onChangeText={e => setAddress(e)}
                value={address}
                placeholder={isLoading ? 'Loading...' : 'Enter Your Address'}
                placeholderTextColor={'gray'}
                style={styles.inputfildeStyle}
              />
            </View>
            <View style={{width: wp(95), marginTop: hp(2)}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.7),
                  fontFamily: mainFontmedium,
                }}>
                State
              </Text>
              <TextInput
                onChangeText={e => setState(e)}
                value={state}
                placeholder={isLoading ? 'Loading...' : 'Enter Your state'}
                placeholderTextColor={'gray'}
                style={styles.inputfildeStyle}
              />
            </View>
            <View style={{width: wp(95), marginTop: hp(2)}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.7),
                  fontFamily: mainFontmedium,
                }}>
                Country
              </Text>
              <TextInput
                value={'India'}
                placeholder={isLoading ? 'Loading...' : 'Enter Your Address'}
                placeholderTextColor={'gray'}
                style={styles.inputfildeStyle}
              />
            </View>
            <View style={{width: wp(95), marginTop: hp(2)}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.7),
                  fontFamily: mainFontmedium,
                }}>
                Pincode
              </Text>
              <TextInput
                onChangeText={e => setPinCode(e)}
                value={`${pinCode}`}
                keyboardType="number-pad"
                maxLength={6}
                placeholder={isLoading ? 'Loading...' : 'Enter Your Pincode'}
                placeholderTextColor={'gray'}
                style={styles.inputfildeStyle}
              />
            </View>

            {userObj.role == Roles.DOCTOR && (
              <View style={{width: wp(95), marginTop: hp(2)}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: hp(1.7),
                    fontFamily: mainFontmedium,
                  }}>
                  Specialization
                </Text>
                <TextInput
                  editable={false}
                  onChangeText={e => setSpecialization(e)}
                  value={specialization}
                  placeholder={isLoading ? 'Loading...' : 'Your specialization'}
                  placeholderTextColor={'gray'}
                  style={styles.inputfildeStyle}
                />
              </View>
            )}

            {userObj.role == Roles.DOCTOR && (
              <View style={{width: wp(95), marginTop: hp(2)}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: hp(1.7),
                    fontFamily: mainFontmedium,
                  }}>
                  Abha Id
                </Text>
                <TextInput
                  onChangeText={e => setAbhaid(e)}
                  value={abhaid}
                  placeholder={isLoading ? 'Loading...' : 'Your Abha Id'}
                  placeholderTextColor={'gray'}
                  style={styles.inputfildeStyle}
                />
              </View>
            )}
            {(userObj.role == Roles.DOCTOR ||
              userObj.role == Roles.FRANCHISE) && (
              <View style={{width: wp(95), marginTop: hp(2)}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: hp(1.7),
                    fontFamily: mainFontmedium,
                  }}>
                  Uplode Document
                </Text>
              </View>
            )}
            <View style={{marginTop: hp(2), width: wp(95)}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.7),
                  fontFamily: mainFontmedium,
                }}>
                How do you identify yourself?
              </Text>
              <View
                style={{
                  width: wp(95),
                  flexDirection: 'row',
                  marginTop: hp(1),
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => setGender('Male')}
                  style={{
                    borderColor: '#686868',
                    borderWidth: gender == 'Male' ? 0 : 0.8,
                    width: wp(30),
                    height: hp(5),
                    borderRadius: 5,
                    backgroundColor: gender == 'Male' ? maincolor : 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: gender == 'Male' ? 'white' : '#686868',
                      fontSize: hp(1.8),
                      fontFamily: mainFont,
                    }}>
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGender('Female')}
                  style={{
                    borderColor: '#686868',
                    borderWidth: gender == 'Female' ? 0 : 0.8,
                    width: wp(30),
                    height: hp(5),
                    borderRadius: 5,
                    backgroundColor: gender == 'Female' ? maincolor : 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: gender == 'Female' ? 'white' : '#686868',
                      fontSize: hp(1.8),
                      fontFamily: mainFont,
                    }}>
                    Female
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGender('Other')}
                  style={{
                    borderColor: '#686868',
                    borderWidth: gender == 'Other' ? 0 : 0.8,
                    width: wp(30),
                    height: hp(5),
                    borderRadius: 5,
                    backgroundColor: gender == 'Other' ? maincolor : 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: gender == 'Other' ? 'white' : '#686868',
                      fontSize: hp(1.8),
                      fontFamily: mainFont,
                    }}>
                    Other
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* <TouchableOpacity
              onPress={() => handleSubmit()}
              style={{
                width: wp(95),
                height: hp(5),
                backgroundColor: '#50B148',
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginVertical: 25,
              }}>
              <Text
                style={{
                  fontSize: hp(1.8),
                  color: 'white',
                  fontFamily: mainFontmedium,
                }}>
                Submit
              </Text>
            </TouchableOpacity> */}


<>
      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={{
          width: wp(95),
          height: hp(5),
          backgroundColor: '#50B148',
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          marginVertical: 25,
        }}>
        <Text
          style={{
            fontSize: hp(1.8),
            color: 'white',
            fontFamily: mainFontmedium,
          }}>
          Submit
        </Text>
      </TouchableOpacity>
      {isLoadingSubmit && (
        <View
          style={{
            position: 'absolute',
            // height:'100%',
            // width:'100%',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(10, 10, 10, 0.5)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </>



           {!isLoadingSubmit && <View
              style={{
                borderWidth: 0.5,
                borderColor: 'gray',
                borderRadius: 5,
                padding: 10,
              }}>
              <View style={{width: wp(95), marginTop: hp(2)}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: hp(1.7),
                    fontFamily: mainFontmedium,
                  }}>
                  Old Password
                </Text>
                <TextInput
                  onChangeText={e => setOldPassword(e)}
                  value={`${oldPassword}`}
                  secureTextEntry
                  maxLength={6}
                  placeholder="Enter Your old password"
                  placeholderTextColor={'gray'}
                  style={[styles.inputfildeStyle, {width: wp(90)}]}
                />
              </View>
              <View style={{width: wp(95), marginTop: hp(2)}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: hp(1.7),
                    fontFamily: mainFontmedium,
                  }}>
                  New Password
                </Text>
                <TextInput
                  onChangeText={e => setNewPassword(e)}
                  value={`${newPassword}`}
                  secureTextEntry
                  maxLength={6}
                  placeholder="Enter Your new password"
                  placeholderTextColor={'gray'}
                  style={[styles.inputfildeStyle, {width: wp(90)}]}
                />
              </View>
              <View style={{width: wp(95), marginTop: hp(1.8)}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: hp(1.7),
                    fontFamily: mainFontmedium,
                  }}>
                  Confirm Password
                </Text>
                <TextInput
                  onChangeText={e => setConfirmPassword(e)}
                  value={`${confirmPassword}`}
                  secureTextEntry
                  maxLength={6}
                  placeholder="Confirm Your password"
                  placeholderTextColor={'gray'}
                  style={[styles.inputfildeStyle, {width: wp(90)}]}
                />
              </View>
              <TouchableOpacity
                onPress={() => handleUpdatePasswordSubmit()}
                style={{
                  width: wp(90),
                  height: hp(5),
                  backgroundColor: '#50B148',
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginVertical: 25,
                }}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    color: 'white',
                    fontFamily: mainFontmedium,
                  }}>
                  Update Password
                </Text>
              </TouchableOpacity>
            </View>}
          </View>
        </ScrollView>
      </ScrollView>
    );
  }
};
const styles = StyleSheet.create({
  input: {
    width: 40,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E8E8E8',
    marginLeft: 10,
    textAlign: 'center',
    fontSize: hp(2.5),
    fontWeight: '700',
    color: 'gray',
  },
  inputfildeStyle: {
    width: wp(95),
    height: hp(5.5),
    marginTop: hp(0.5),
    backgroundColor: '#F1ECEC',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingLeft: wp(1),
    paddingRight: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default EditProfile;
