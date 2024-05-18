import {
  View,
  Text,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  Linking,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useContext, useState, useRef, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {LoginContext} from '../../App';
import DocumentPicker from 'react-native-document-picker';
import {fileUpload} from '../Services/fileUpload.service';
import {toastError, toastSuccess} from '../utils/toast.utils';
import {
  getAppointmentById,
  updateAppointments,
} from '../Services/appointments.service';
import url, {fileurl} from '../Services/url.service';
import {Roles} from '../utils/constant';
import {
  deleteJwt,
  getJwt,
  getUser,
  isUserLoggedIn,
} from '../Services/user.service'; 
import {Calendar} from 'react-native-calendars';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import io from 'socket.io-client';
import {
  addAppointmentFollowUps,
  addAppointmentHistory,
} from '../Services/appointmentHistory.service';

const {height, width} = Dimensions.get('window');

const Appointment_History = (props: any) => {
  const focused = useIsFocused();

  const serverUrl = url;

  const mainFont = 'Montserrat-Regular';
  const mainFontBold = 'Montserrat-Bold';
  const mainFontmedium = 'Montserrat-Medium';
  const maincolor = '#1263AC';
  const navigation: any = useNavigation();

  //check user logged in or not
  const handleLogout = async () => {
    try {
      await deleteJwt();
    } catch (err) {
      //   toastError(err);
    }
  };

  useEffect(() => {
    CheckIsUserLoggedIn();
  }, []);

  const CheckIsUserLoggedIn = async () => {
    try {
      let token = await getJwt();
      if (token) {
        const {data: res}: any = await isUserLoggedIn();
        if (res.status == false) {
          handleLogout();
        }
      }
    } catch (err) {
      //   toastError(err);
    }
  };

  const Unit = [
    {
      label: 'cm',
      value: 'cm',
    },
    {
      label: 'ft',
      value: 'ft',
    },
  ];
  const [rr, setrr] = useState('');
  const [meetingConfirmation, setMeetingConfirmation] = useState(false);
  const [userObj, setUserObj] = useState<any>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [timeSlot, setTimeSlot] = useState(
    props?.route?.params?.data?.doctor.timeSlot,
  );
  const [appointmentData, setAppointmentData] = useState<any>();
  const [selectedDate, setSelectedDate] = useState<any>('');
  const [bp, setBp] = useState('');
  const [bodyTemperature, setBodyTemperature] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [oxigne, setOxigne] = useState('');
  const [pulse, setPulse] = useState('');
  const [suger1, setSuger1] = useState('');
  const [suger2, setSuger2] = useState('');
  const [suger3, setSuger3] = useState('');
  const [isGenderFocused, setIsGenderFocused] = useState(false);
  const [height, setHeight] = useState();
  const [heightUnit, setUnit] = useState();
  const [weight, setWeight] = useState();
  const [bmi, setBmi] = useState('0');

  const [doctorName, setDoctorName] = useState('');
  const [patientName, setPatientName] = useState('');

  const [bookmodal, setBookmodal] = useState(false);
  const [user, setUser] = useContext(LoginContext);
  const [btnClicked, setBtnClicked] = useState(false);
  const [downlodeig, setDownloding] = useState<boolean>(false);
  const [downlodingIndex, setDownlodingIndex] = useState<number>();
  const animation = useRef(new Animated.Value(0)).current;

  const [isLoading, setIsLoading] = useState(false); // this is loder by default

  const [prescriptionArr, setPrescriptionArr] = useState([]);

  const [userMessage, setUserMessage] = useState('');

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: btnClicked ? 0 : 1,
      useNativeDriver: true,
      duration: 200,
    }).start();
  };
  const Revert = () => {
    Animated.timing(animation, {
      toValue: btnClicked ? 1 : 0,
      useNativeDriver: true,
      duration: 200,
    }).start();
  };

  const attachData = [
    {
      img: require('../../assets/images/document.png'),
    },
    {
      img: require('../../assets/images/link.png'),
    },
    {
      img: require('../../assets/images/gallery.png'),
    },
    {
      img: require('../../assets/images/camera.png'),
    },
    {
      img: require('../../assets/images/location.png'),
    },
  ];

  const [msgArr, setMsgArr] = useState<
    {
      message: string;
      fromId: string;
      toId: string;
      _id: string;
      timestamp: string;
    }[]
  >([]);

  const [socket, setSocket] = useState<any>();

  useEffect(() => {
    let socket: any;
    if (focused && userObj && userObj._id) {
      socket = io(fileurl);
      if (socket) {
        setSocket(socket);
        socket.emit('join', userObj._id);
        socket.on('message', (data: any) => {
          setMsgArr(prevData => [...prevData, data]);
        });
      }
    } else {
      socket?.disconnect();
    }
    return () => {
      socket?.disconnect();
    };
  }, [focused, userObj]);

  const handleSubmit = async () => {
    try {
      if (!userMessage) return;
      // e.preventDefault();
      let tmpMessage = userMessage;

      let toUserId = '';
      if (Roles.DOCTOR === userObj?.role) {
        toUserId = appointmentData?.expert;
      } else {
        toUserId = appointmentData?.doctor?._id;
      }

      socket?.emit('message', {
        toUserId: toUserId,
        message: userMessage,
        userId: user._id,
      });
      setUserMessage('');

      setMsgArr(prev => [
        ...prev,
        {
          toId: toUserId,
          message: tmpMessage,
          fromId: user._id,
          timestamp: new Date().toISOString(),
          _id: new Date().toISOString(),
        },
      ]);
      const res = await addAppointmentHistory(appointmentData._id, {
        message: tmpMessage,
        toId: toUserId,
      });
    } catch (error) {
      toastError(error);
    }
  };

  const getFromUser = (fromId: string) => {
    if (fromId == userObj?._id) {
      return 'user';
    }
    return 'other';
  };

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters =
        heightUnit === 'cm' ? height / 100 : height * 0.3048;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(bmiValue);
    }
  };
  useEffect(() => {
    calculateBMI();
  }, [heightUnit, height, weight, bmi]);

  const handleDocumentPicker = async () => {
    try {
      let file: any = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
      });
      if (file) {
        for (const el of file) {
          let formData = new FormData();
          formData.append('file', el);
          let {data: res} = await fileUpload(formData);
          if (res.message) {
            toastSuccess(res.message);
            setFiles((prev: any) => [...prev, {fileName: res.data}]);
          }
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleGetAndSetUser = async () => {
    let userData = await getUser();
    if (userData) {
      socket?.emit('join', userData?._id);
      setUserObj(userData);
    }
  };
  const handleGetAppointmentById = async () => {
    try {
      setIsLoading(true); // Start loading
      let {data: res} = await getAppointmentById(
        props?.route?.params?.data._id,
      );
      console.log('hh', height);
      // Alert.alert(res?.data?.height);
      if (res.data) {
        setBp(res?.data?.bp);
        setBodyTemperature(res?.data?.bodyTemperature);
        setFiles(res?.data?.files);
        setOxigne(res?.data?.oxigne);
        setPulse(res?.data?.pulse);
        setSuger1(res?.data?.suger1);
        setSuger2(res?.data?.suger2);
        setSuger3(res?.data?.suger3);
        setPrescriptionArr(res?.data?.prescription);
        setDoctorName(res?.data?.doctor?.name);
        setPatientName(res?.data?.patientName);
        setrr(res?.data?.respiratoryRate);
        setMsgArr(res?.data?.history);
        setAppointmentData(res.data);
        setHeight(res?.data?.height);
        setUnit(res?.data?.heightUnit);
        setBmi(res?.data?.bmi);
        setWeight(res?.data?.weight);
      }
    } catch (err) {
      toastError(err);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (focused && props?.route?.params?.data) {
      handleGetAndSetUser();
      handleGetAppointmentById();
    }
  }, [focused, props?.route?.params?.data]);

  const handlechangeAppointmentStatus = async () => {
    if (height && !weight) {
      setMeetingConfirmation(false);
      toastError('heights or Weight are mandatory !!!');
      return;
    }
    if (!height && weight) {
      setMeetingConfirmation(false);
      toastError('heights or Weight are mandatory !!!');
      return;
    }
    try {
      let obj = {
        bp,
        bodyTemperature,
        files,
        oxigne,
        pulse,
        respiratoryRate: rr,
        suger1,
        suger2,
        suger3,
        height,
        heightUnit,
        weight,
        bmi,
      };
      let {data: res} = await updateAppointments(
        props?.route?.params?.data._id,
        obj,
      );
      if (res) {
        toastSuccess(res.message);
        Keyboard.dismiss();
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleAddFollowUps = async () => {
    try {
      if (selectedDate == '') {
        toastError('Date is mandatory !!!!');
        return;
      }
      if (selectedTimeSlot == '') {
        toastError('Time slot is mandatory !!!!');
        return;
      }
      let obj = {
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      };
      let {data: res} = await addAppointmentFollowUps(
        props?.route?.params?.data._id,
        obj,
      );
      if (res) {
        setBookmodal(false);
        toastSuccess(res.message);
      }
    } catch (error) {
      toastError(error);
    }
  };



  // const requestStoragePermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       {
  //         title: 'Storage Permission Required',
  //         message: 'This app needs access to your storage to download files',
  //       }
  //     );
  //     return granted === PermissionsAndroid.RESULTS.GRANTED;
  //   } catch (err) {
  //     console.warn(err);
  //     return false;
  //   }
  // };



const requestStoragePermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 29) {
    try {
      const writeGranted = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      const readGranted = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

      return writeGranted === RESULTS.GRANTED && readGranted === RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    // For Android 10 and above, no need to request WRITE_EXTERNAL_STORAGE permission
    return true;
  }
};


  // const handleDownloadPrescription = async (id: string, index: number) => {
  //   setDownloding(true);
  //   setDownlodingIndex(index);

  //   const hasPermission = await requestStoragePermission();
  //   if (!hasPermission) {
  //     toastError('Storage permission denied');
  //     setDownloding(false);
  //     return;
  //   }


  //   try {
  //     if (Platform.OS === 'android') {
  //       const android = RNFetchBlob.android;
  //       const response = await RNFetchBlob.config({
  //         fileCache: true,
  //         addAndroidDownloads: {
  //           useDownloadManager: true,
  //           notification: true,
  //           path: RNFetchBlob.fs.dirs.DownloadDir + '/Prescription.pdf',
  //           mime: 'application/pdf',
  //           description: 'File downloaded by download manager.',
  //         },
  //       }).fetch('GET', `${url}/prescription-by-id/${id}`, {
  //         responseType: 'blob',
  //       });
  //       console.log(response);
  //       if (response.respInfo.status === 200) {
  //         android.actionViewIntent(response.path(), 'application/pdf');
  //         toastSuccess('Prescription Downloaded');
  //         setDownloding(false);
  //       } else {
  //         throw new Error('Failed to download prescription');
  //       }
  //     } else {
  //       toastError('Not Configured');
  //       setDownloding(false);
  //     }
  //   } catch (error) {
  //     console.error('Error downloading prescription:', error);
  //     // toastError('Error downloading prescription');0.
  //     setDownloding(false);
  //   }
  // };




  const handleDownloadPrescription = async (_id: string) => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        toastError('Storage permission denied');
        return;
      }
  
      const url = `${serverUrl}/prescription-by-id/${_id}`;
      const { config, fs } = RNFetchBlob;
      const downloadDir = fs.dirs.DownloadDir;
  
      if (Platform.OS === 'android') {
        if (Platform.Version >= 29) {
          // Use MediaStore for Android 10 and above
          RNFetchBlob.config({
            fileCache: true,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              mime: 'application/pdf',
              description: 'File downloaded by download manager.',
              mediaScannable: true,
              path: `${downloadDir}/prescription-by-id${_id}.pdf`,
            },
          })
            .fetch('GET', url)
            .then(res => {
              toastSuccess('Prescription Downloaded');
            })
            .catch(err => {
              console.log(err);
              toastError('Download failed');
            });
        } else {
          // For Android 9 and below
          RNFetchBlob.config({
            fileCache: true,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              path: `${downloadDir}/prescription-by-id${_id}.pdf`,
              mime: 'application/pdf',
              description: 'File downloaded by download manager.',
            },
          })
            .fetch('GET', url)
            .then(res => {
              RNFetchBlob.android.actionViewIntent(res.path(), 'application/pdf');
              toastSuccess('Prescription Downloaded');
            })
            .catch(err => {
              console.log(err);
              toastError('Download failed');
            });
        }
      } else {
        toastError('Not Configured');
      }
    } catch (error) {
      console.error(error);
      toastError('An error occurred');
    }
  };
  





  return (
    <View
      style={{
        width: width,
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: hp(1),
      }}>
      <Headerr secndheader={true} label="Health Parameters" />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            <View style={{width: wp(95)}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp(0.5),
                }}>
                <View style={{width: wp(45)}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: mainFontBold,
                      fontSize: hp(1.8),
                    }}>
                    BP
                  </Text>
                  <TextInput
                    onChangeText={e => setBp(e)}
                    value={bp}
                    style={[styles.inputFildsstyls, {width: wp(45)}]}
                    placeholder={isLoading ? 'Loading...' : 'Enter BP'}
                  />
                </View>
                <View style={{width: wp(45)}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: mainFontBold,
                      fontSize: hp(1.8),
                    }}>
                    Pulse Rate
                  </Text>
                  <TextInput
                    onChangeText={e => setPulse(e)}
                    value={pulse}
                    style={[styles.inputFildsstyls, {width: wp(45)}]}
                    placeholder={isLoading ? 'Loading...' : 'Pulse'}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp(1),
                }}>
                <View style={{width: wp(45)}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: mainFontBold,
                      fontSize: hp(1.8),
                    }}>
                    Body Temperature
                  </Text>
                  <TextInput
                    onChangeText={e => setBodyTemperature(e)}
                    value={bodyTemperature}
                    style={[styles.inputFildsstyls, {width: wp(45)}]}
                    placeholder={isLoading ? 'Loading...' : 'Body Temperature'}
                  />
                </View>
                <View style={{width: wp(45)}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: mainFontBold,
                      fontSize: hp(1.8),
                    }}>
                    SpO2
                  </Text>
                  <TextInput
                    onChangeText={e => setOxigne(e)}
                    value={oxigne}
                    style={[styles.inputFildsstyls, {width: wp(45)}]}
                    placeholder={isLoading ? 'Loading...' : 'SpO2'}
                  />
                </View>
              </View>
              <View style={{justifyContent: 'space-between', marginTop: hp(1)}}>
                <View style={{width: wp(95)}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: mainFontBold,
                      fontSize: hp(1.8),
                    }}>
                    Postprandial Sugar(PPBS) mg/dl
                  </Text>
                  <TextInput
                    onChangeText={e => setSuger1(e)}
                    value={suger1}
                    style={[styles.inputFildsstyls, {width: wp(95)}]}
                    placeholder={
                      isLoading ? 'Loading...' : 'Postprandial Sugar (PPBS)'
                    }
                  />
                </View>
              </View>
              <View style={{width: wp(95), marginTop: hp(1)}}>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: mainFontBold,
                    fontSize: hp(1.8),
                  }}>
                  Random Blood Sugar(RBS) mg/dl
                </Text>
                <TextInput
                  onChangeText={e => setSuger3(e)}
                  value={suger3}
                  style={[styles.inputFildsstyls, {width: wp(95)}]}
                  placeholder={
                    isLoading ? 'Loading...' : 'Random Blood Sugar(RBS)'
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp(1),
                }}>
                <View style={{width: wp(45)}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: mainFontBold,
                      fontSize: hp(1.8),
                    }}>
                    Fasting Sugar(FBS) mg/dl
                  </Text>
                  <TextInput
                    onChangeText={e => setSuger2(e)}
                    value={suger2}
                    style={[styles.inputFildsstyls, {width: wp(45)}]}
                    placeholder={
                      isLoading ? 'Loading...' : 'Fasting Sugar (FBS)'
                    }
                  />
                </View>
                <View style={{width: wp(45)}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: mainFontBold,
                      fontSize: hp(1.8),
                    }}>
                    Respiratory Rate(RR)
                    <Text>(bpm)</Text>
                  </Text>
                  <TextInput
                    onChangeText={e => setrr(e)}
                    value={rr}
                    style={[styles.inputFildsstyls, {width: wp(45)}]}
                    placeholder={isLoading ? 'Loading...' : 'RR'}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(1),
                  justifyContent: 'space-between',
                }}>
                <View style={{width: wp(45)}}>
                  <View>
                    <Text
                      style={{
                        fontSize: hp(1.8),
                        fontFamily: mainFontBold,
                        color: 'black',
                      }}>
                      Height (ft)
                    </Text>
                    <View style={{width: wp(45), flexDirection: 'row'}}>
                      <TextInput
                        keyboardType="numeric"
                        value={height}
                        onChangeText={e => setHeight(e)}
                        placeholderTextColor="#8E8E8E"
                        placeholder="height"
                        style={{
                          height: hp(6.1),
                          width: wp(29),
                          backgroundColor: '#F2F2F2E5',
                          marginTop: hp(1),
                          borderRadius: wp(1.2),
                          fontSize: hp(2),
                          borderColor: 'gray',
                          borderTopWidth: 0.5, // Top border width
                          borderBottomWidth: 0.5, // Bottom border width
                          borderLeftWidth: 0.5, // Left border width
                          borderRightWidth: 0, // Right border width set to 0 to remove
                        }}
                      />
                      <Dropdown
                        style={[
                          styles.uint,
                          isGenderFocused && {borderWidth: 0.5},
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={Unit}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="unit"
                        value={heightUnit}
                        onFocus={() => setIsGenderFocused(true)}
                        onBlur={() => setIsGenderFocused(false)}
                        onChange={item => {
                          setUnit(item.value);
                          setIsGenderFocused(false);
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View style={{width: wp(45)}}>
                  <Text
                    style={{
                      fontSize: hp(1.8),
                      fontFamily: mainFontBold,
                      color: 'black',
                    }}>
                    Weight (kg)
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={e => setWeight(e)}
                    placeholderTextColor="#8E8E8E"
                    placeholder="kg"
                    style={{
                      height: hp(6.1),
                      fontSize: hp(2),
                      backgroundColor: '#F2F2F2E5',
                      marginTop: hp(1),
                      borderRadius: wp(1.2),
                      borderColor: 'gray',
                      borderWidth: 0.5,
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(1),
                  justifyContent: 'space-between',
                }}>
                <View style={{width: wp(95)}}>
                  <Text
                    style={{
                      fontSize: hp(1.8),
                      fontFamily: mainFontBold,
                      color: 'black',
                    }}>
                    BMI
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={bmi}
                    placeholderTextColor="#8E8E8E"
                    placeholder="BMI"
                    style={{
                      height: hp(6.1),
                      fontSize: hp(2),
                      backgroundColor: '#F2F2F2E5',
                      marginTop: hp(1),
                      borderRadius: wp(1.2),
                      borderColor: 'gray',
                      borderWidth: 0.5,
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp(2),
                  width: wp(95),
                }}>
                {userObj?.role !== Roles.DOCTOR && (
                  <View style={{width: wp(60), marginRight: 10}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: mainFontmedium,
                        fontSize: hp(1.8),
                      }}>
                      Upload File
                    </Text>
                    <TouchableOpacity onPress={handleDocumentPicker}>
                      <View
                        style={{
                          width: wp(60),
                          height: hp(5.5),
                          borderColor: 'gray',
                          borderWidth: 0.7,
                          marginTop: hp(1),
                          borderStyle: 'dashed',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingLeft: wp(2),
                          paddingRight: wp(2),
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            fontFamily: mainFont,
                            fontSize: hp(1.4),
                            color: 'gray',
                          }}>
                          {files && files.length > 0
                            ? files.reduce(
                                (acc, el, index) =>
                                  acc +
                                  `${el.fileName} ${
                                    index != files.length - 1 ? ',' : ''
                                  }`,
                                '',
                              )
                            : 'Select JPG,PDF,PNG Format'}
                        </Text>
                        <Image
                          source={require('../../assets/images/upld.png')}
                          style={{
                            height: wp(6),
                            width: wp(6),
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: wp(95),
                      }}>
                      {files &&
                        files.length > 0 &&
                        files.map((el: any, index: number) => {
                          return (
                            <TouchableOpacity
                              onPress={() =>
                                Linking.openURL(`${fileurl}/${el.fileName}`)
                              }
                              style={{
                                padding: 10,
                                marginRight: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: hp(2.8),
                                backgroundColor: maincolor,
                                borderRadius: 5,
                              }}>
                              <Text
                                style={{
                                  color: 'white',
                                  fontFamily: mainFontmedium,
                                  fontSize: 12,
                                }}>
                                View File
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                    </View>
                  </View>
                )}
              </View>

              <FlatList
                data={prescriptionArr}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({item, index}: any) => {
                  return (
                    <View>
                      {isLoading ? (
                        <Text style={{textAlign: 'center', marginTop: 25}}>
                          Loding....
                        </Text>
                      ) : (
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: wp(100),
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              handleDownloadPrescription(item._id, index)
                            }
                            style={{
                              backgroundColor: maincolor,
                              width: wp(95),
                              borderTopRightRadius:
                                userObj?.role == Roles.DOCTOR ? 0 : 10,
                              borderBottomRightRadius:
                                userObj?.role == Roles.DOCTOR ? 0 : 10,
                              borderBottomLeftRadius: 5,
                              borderTopLeftRadius: 5,
                              marginBottom: hp(1),
                              paddingHorizontal: wp(2),
                              paddingVertical: hp(1),
                            }}>
                            {downlodeig ? (
                              <Text
                                style={{
                                  color: 'white',
                                  fontSize: hp(2.5),
                                  textAlign: 'center',
                                }}>
                                Downloading...
                              </Text>
                            ) : (
                              <Text style={{color: 'white', fontSize: hp(2)}}>
                                Prescription
                                {moment(item.createdAt).format(
                                  'DD/MM/YYYY h:mm:ss a',
                                )}
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                }}
              />
            </View>
          </>
        }
      />
      <View
        style={{
          width: wp(95),
          marginTop: hp(2),
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            {
              userObj?.role == Roles.PATIENT && navigation.navigate('BookAppt');
            }
            {
              userObj?.role == Roles.DOCTOR &&
                navigation.navigate('Write_P', {
                  data: props?.route?.params?.data,
                  editModeOn: false,
                });
            }
          }}
          style={{
            width: wp(45),
            height: hp(5),
            backgroundColor: '#1263AC',
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{color: 'white', fontFamily: mainFont, fontSize: hp(1.8)}}>
            {userObj?.role == Roles.DOCTOR
              ? `Create Prescription`
              : 'Book New Appt'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            userObj?.role == Roles.DOCTOR
              ? handlechangeAppointmentStatus()
              : setBookmodal(true);
          }}
          style={{
            width: wp(45),
            height: hp(5),
            backgroundColor: '#50B148',
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{color: 'white', fontFamily: mainFont, fontSize: hp(1.8)}}>
            {userObj?.role == Roles.DOCTOR ? 'Update' : `Follow Up`}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={bookmodal}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        onBackButtonPress={() => setBookmodal(false)}
        style={{marginLeft: 0, marginRight: 0}}>
        <View
          style={{
            width: wp(85),
            paddingBottom: hp(3),
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: 5,
          }}>
          <View
            style={{
              height: hp(6),
              width: wp(85),
              backgroundColor: maincolor,
              borderTopRightRadius: 5,
              borderTopLeftRadius: 5,
              justifyContent: 'center',
              paddingLeft: wp(5),
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: hp(1.8),
                fontFamily: mainFontmedium,
              }}>
              Follow Up
            </Text>
          </View>
          <View style={{width: wp(75), alignSelf: 'center'}}>
            <View style={{marginTop: hp(2)}}>
              <Text
                style={{
                  fontSize: hp(1.8),
                  color: 'black',
                  fontFamily: mainFontmedium,
                }}>
                Date
              </Text>
              <Calendar
                onDayPress={(day: any) => {
                  setSelectedDate(day.dateString);
                }}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: '#F1EFFE',
                    selectedTextColor: '#7954FA',
                  },
                }}
                minDate={`${new Date()}`}
              />
            </View>

            <View style={{marginTop: hp(2)}}>
              <Text
                style={{
                  fontSize: hp(1.8),
                  color: 'black',
                  fontFamily: mainFontmedium,
                }}>
                Slot
              </Text>
              <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={timeSlot}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Slot"
                value={selectedTimeSlot}
                onChange={(item: any) => {
                  setSelectedTimeSlot(item.value);
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(2),
                alignSelf: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => setBookmodal(false)}
                style={{
                  width: wp(25),
                  height: hp(5),
                  backgroundColor: '#BD2626',
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    color: 'white',
                    fontFamily: mainFontmedium,
                  }}>
                  Close
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleAddFollowUps()}
                style={{
                  width: wp(25),
                  height: hp(5),
                  backgroundColor: '#50B148',
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: wp(5),
                }}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    color: 'white',
                    fontFamily: mainFontmedium,
                  }}>
                  Book
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  inputFildsstyls: {
    height: hp(6.1),
    borderTopWidth: 0.5,
    marginTop: hp(0.5),
    backgroundColor: '#F2F2F2E5',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 0.7,
    fontSize: hp(2),
  },
  dropdown: {
    height: hp(5.5),
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: hp(1),
    width: wp(75),
    backgroundColor: '#F2F2F2E5',
  },
  uint: {
    height: hp(6.1),
    borderTopWidth: 0.5, // Top border width
    borderBottomWidth: 0.5, // Bottom border width
    borderLeftWidth: 0, // Left border width set to 0 to remove
    borderRightWidth: 0.5, // Right border width
    borderTopColor: 'gray', // Top border color
    borderBottomColor: 'gray', // Bottom border color
    borderRightColor: 'gray', // Right border color
    borderRadius: wp(1.2),
    paddingHorizontal: 8,
    marginTop: hp(1),
    width: wp(17),
    fontSize: hp(2),
    backgroundColor: '#F2F2F2E5',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    fontSize: hp(1.7),
  },
  placeholderStyle: {
    color: '#8E8E8E',
    fontSize: hp(2),
  },
  selectedTextStyle: {
    fontSize: hp(2),
    color: '#8E8E8E',
  },
  dropdown1: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: hp(1),
    width: wp(95),
    backgroundColor: '#F2F2F2E5',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#8E8E8E',
  },
});

export default Appointment_History;
