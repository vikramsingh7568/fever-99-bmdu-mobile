import {useIsFocused, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Clode_icons from 'react-native-vector-icons/AntDesign';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import RNFetchBlob from 'rn-fetch-blob';
import {LoginContext} from '../../App';
import Headerr from '../ReuseableComp/Headerr';
import {
  getAppointments,
  updateAppointmentCallStatus,
  updateAppointments,
} from '../Services/appointments.service';
import {SendNotification} from '../Services/notificationSevice';
import {addSupportComplaint} from '../Services/support.service';
import url, {generateFilePath} from '../Services/url.service';
import {
  deleteJwt,
  getJwt,
  getUser,
  isUserLoggedIn,
} from '../Services/user.service';
import {Roles, appointmentStatus, consultationMode} from '../utils/constant';
import {toastError, toastSuccess} from '../utils/toast.utils';
import isEqual from 'lodash/isEqual';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';

import Profiles_setting_icons from 'react-native-vector-icons/AntDesign';
import Money_icons from 'react-native-vector-icons/FontAwesome';
import Mans_icons from 'react-native-vector-icons/Entypo';
import Status_icons from 'react-native-vector-icons/FontAwesome6';
import Calendar_icons from 'react-native-vector-icons/FontAwesome5';
import Walkink_Video_icons from 'react-native-vector-icons/FontAwesome5';
import FeedBack from '../allModals/FeedBack';

import {useNetInfo} from '@react-native-community/netinfo'; // <--- internet connection
import InterNetError from '../noInterNet/InterNetError';
import Reschedule from '../allModals/Reschedule';
import CompleteFollowupModal from '../allModals/CompleteFollowupModal';
import axios from '../Services/axios.service';
const {height, width} = Dimensions.get('window');
const mainFontBold = 'Montserrat-Bold';

const Appointment = (proper: any) => {
  const serverUrl = url;
  const handleLogout = async () => {
    try {
      await deleteJwt();
    } catch (err) {
      //   toastError(err);
    }
  };
  const CheckIsUserLoggedIn = async () => {
    try {
      let token = await getJwt();
      if (token) {
        const {data: res}: any = await isUserLoggedIn();
        if (res.status == false) {
          handleLogout();
        } else {
          navigation.navigate('BookAppt');
        }
      } else {
        navigation.navigate('BookAppt');
      }
    } catch (err) {
      //   toastError(err);
    }
  };

  const netInfo = useNetInfo();
  const isConnected = netInfo.isConnected;
  const [loading, setLoading] = useState(true);
  const [bookmodal, setBookmodal] = useState(false);
  const [showConModal, setShowCnfMOdal] = useState(false);
  const mainFont = 'Montserrat-Regular';
  const mainFontBold = 'Montserrat-Bold';
  const mainFontmedium = 'Montserrat-Medium';
  const maincolor = '#1263AC';
  const navigation: any = useNavigation();

  const [meetingConfirmation, setMeetingConfirmation] = useState(false);
  const [user, setUser] = useContext(LoginContext);

  const [userObj, setUserObj] = useState<any>('');
  const [dateModal, setDateModal] = useState(false);
  const [dateToModal, setDateToModal] = useState(false);

  const [selectedMeeting, setSelectedMeeting] = useState<any>({});
  const [appointmentsArr, setAppointmentsArr] = useState<any[]>([]);
  const [completID, setComtedID] = useState(null);
  const [id, setid] = useState(null);
  const [lastPageReached, setLastPageReached] = useState(false);
  const [prevLimit, setPrevLimit] = useState(10);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const focused = useIsFocused();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [complaintModal, setComplaintModal] = useState(false);

  const [fromDate, setFromDate] = useState('');
  const [toDate, settoDate] = useState('');
  const [filterData, setFilterData] = useState(proper?.route?.params?.baseurl);

  const [animation] = useState(new Animated.Value(1));

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 0.5,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const HandleGetAppointmentsPaginated = async (pageValue: any) => {
    try {
      
      let queryString = `page=${pageValue}&limit=${limit}`;
      if (proper?.route?.params?.baseurl !== undefined) {
        queryString = `page=${pageValue}&limit=${limit}&${filterData}`;
      }
      console.log(queryString)
      if (fromDate && fromDate != '') {
        queryString = `${queryString}&fromDate=${fromDate}`;
      }
      if (toDate && toDate != '') {
        queryString = `${queryString}&toDate=${toDate}`;
      }
      let {data: res} = await getAppointments(queryString);

      if (res.data) {
        if (pageValue == 1) {
          setAppointmentsArr([...res.data]);
        } else {
          setAppointmentsArr((prev: any) => [...prev, ...res.data]);
          setLastPageReached(true);
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setLastPageReached(true);

      // toastError(err);
    }
  };

  const HandleGetAppointmentsWithFilterPaginated = async () => {
    try {
      setFilterData('');
      setPage(1);
      let queryString = `page=${1}&limit=${limit}`;

      if (fromDate && fromDate !== '') {
        queryString = `${queryString}&fromDate=${fromDate}`;
      }
      if (toDate && toDate !== '') {
        queryString = `${queryString}&toDate=${toDate}`;
      }

      let {data: res} = await getAppointments(queryString);

      if (res.data) {
        if (!isEqual(res.data, appointmentsArr)) {
          setAppointmentsArr([...res.data]);
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      // toastError(err);
    }
  };

  useEffect(() => {
    HandleGetAppointmentsPaginated(1);
    const tempInterval = setInterval(
      () => HandleGetAppointmentsPaginated(1),
      20000,
    );
    return () => {
      setAppointmentsArr([]);
      setPage(1);
      clearInterval(tempInterval);
    };
  }, [proper?.route?.params?.baseur]);

  const handleGetAndSetUser = async () => {
    let userData = await getUser();
    if (userData) {
      setUserObj(userData);
    }
  };

  useEffect(() => {
    if (focused) {
      handleGetAndSetUser();
    }
  }, []);

  const handlechangeAppointmentStatus = async (
    id: string,
    statusString: string,
  ) => {
    try {
      let obj = {
        status: statusString,
      };
      let {data: res} = await updateAppointments(id, obj);
      if (res) {
        setPage(1);
        setFromDate('');
        settoDate('');
        // setAppointmentsArr([]);
        HandleGetAppointmentsWithFilterPaginated();
        toastSuccess(res.message);
      }
    } catch (error) {
      // toastError(error);
    }
  };

  const handleJoinMeeting = async (id: string, callProgress: boolean) => {
    try {
      let obj = {
        callInprogress: callProgress,
      };
      let {data: res} = await updateAppointmentCallStatus(id, obj);
      if (res) {
        setPage(1);
        setAppointmentsArr([]); // remove this line of code this make list as empty when dr  make the call
        if (callProgress) {
          let {data: notificationRes} = await SendNotification({
            appointmentId: id,
            userId: userObj?._id,
          });
          if (notificationRes) {
            setMeetingConfirmation(false);
            navigation.navigate('Meeting', {data: id});
          }
        } else {
          handlechangeAppointmentStatus(id, appointmentStatus.COMPLETED);
        }
      }
    } catch (error) {
      // toastError(error);
    }
  };


  // const requestStoragePermission = async () => {
  //   if (Platform.OS === 'android' && Platform.Version < 29) {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         {
  //           title: 'Storage Permission Required',
  //           message: 'This app needs access to your storage to download files',
  //         }
  //       );
  
  //       return granted === PermissionsAndroid.RESULTS.GRANTED;
  //     } catch (err) {
  //       console.warn(err);
  //       return false;
  //     }
  //   } else {
  //     // For Android 10 and above, no need to request WRITE_EXTERNAL_STORAGE permission
  //     return true;
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


const handleDownloadPrescription = async (_id: string) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      toastError('Storage permission denied');
      return;
    }

    const url = `${serverUrl}/prescription/${_id}`;
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
            path: `${downloadDir}/Prescription_${_id}.pdf`,
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
            path: `${downloadDir}/Prescription_${_id}.pdf`,
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

  // const handleDownloadPrescription = async (_id: string) => {
  //   try {
  //     const hasPermission = await requestStoragePermission();
  //     if (!hasPermission) {
  //       toastError('Storage permission denied');
  //       // setDownloding(false);
  //       return;
  //     }

  //     if (Platform.OS == 'android') {
  //       const android = RNFetchBlob.android;
  //       RNFetchBlob.config({
  //         fileCache: true,
  //         addAndroidDownloads: {
  //           useDownloadManager: true,
  //           notification: true,
  //           path: RNFetchBlob.fs.dirs.DownloadDir + '/Prescription' + '.pdf',
  //           mime: 'application/pdf',
  //           description: 'File downloaded by download manager.',
  //         },
  //       })
  //         .fetch('GET', `${url}/prescription/${id}`, {
  //           responseType: 'blob',
  //         })
  //         .then(res => {
  //           android.actionViewIntent(res.path(), 'application/pdf');
  //           toastSuccess('Prescription Downloaded');
  //         })
  //         .catch(err => {
  //           console.log(err);
  //         });
  //     } else {
  //       toastError('Not Configured');
  //     }
  //   } catch (error) {
  //     // toastError(error);
  //   }
  // };




  const handleAddComplaint = async () => {
    try {
      if (selectedAppointmentId == '') {
        toastError('Please select an appointment !!!');
        return;
      }
      if (title == '') {
        toastError('Please enter title !!!');
        return;
      }
      if (details == '') {
        toastError('Please enter message !!!');
        return;
      }
      let obj = {
        title,
        details,
        appointmentId: selectedAppointmentId,
      };
      let {data: res} = await addSupportComplaint(obj);

      if (res.message) {
        toastSuccess(res.message);
        setComplaintModal(false);
      }
    } catch (err) {
      // toastError(err);
    }
  };
  // ***********feedback function
  const [modalVisible, setModalVisible1] = useState(false);
  const [provideId, setProvideId] = useState('');

  const submitFeedback = (id: String) => {
    setProvideId(`${id}`);
    setModalVisible1(true);
  };

  const closeModal = () => {
    setModalVisible1(false);
    setProvideId('');
  };

  // *************** reschedule and state of
  interface Item {
    _id: string;
    doctor: {
      _id: string;
    };
    mode: string;
  }
  //  this is common code for the Reschedule btn
  const [pacentID, setpacentID] = useState<string>('');
  const [soModalreschedule, setSoModalreschedule] = useState<boolean>(false);
  const [drIds, setDrisd] = useState<string>('');
  const [modeOftreetement, setModeoftreetment] = useState<string>('');
  const onPressReschedule = (item: Item) => {
    setpacentID(item._id);
    setSoModalreschedule(true);
    setDrisd(item.doctor._id);
    setModeoftreetment(item.mode);
  };
  const closeRescheduleModal = () => {
    setSoModalreschedule(false);
  };
  //  this code for upodate status botton
  const [soUpdateModals, setSoupdateModals] = useState<boolean>(false);
  const onPressUpdateStatus = (item: Item) => {
    setpacentID(item._id);
    setDrisd(item.doctor._id);
    setModeoftreetment(item.mode);
    setSoupdateModals(true);
  };
  const closeUpdateStatusModal = () => {
    setSoupdateModals(false);
  };

  // clacling pai
  const handleCancelApi = async (_id: string) => {
    try {
      const response = await axios.put(
        `${serverUrl}/appointment/canceled/${_id}`,
      );
      if (response.data.message === 'Cancel appointment not allowed') {
        toastError(response.data.message);
      } else {
        toastSuccess(response.data.message);
        HandleGetAppointmentsWithFilterPaginated();
      }
    } catch (error) {
      // toastError(error);
    }
  };
  const handleCancleApt = (itms: Item) => {
    Alert.alert(
      'Cancel!',
      'Are you sure you want to cancel the appointment?',
      [
        {
          text: 'Cancel Appointment',
          onPress: () => handleCancelApi(itms?._id),
        },
        {
          text: 'Not Now',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };
  //  reject api
  const handleRejectAlert = async (_id: String) => {
    try {
      const response = await axios.put(
        `${serverUrl}/appointment-rejected/${_id}`,
      );
      if (response.status == 200) {
        toastSuccess('Appointment Rejected');
        HandleGetAppointmentsWithFilterPaginated();
      } else {
        toastError('Unable to Reject');
      }
    } catch (error) {
      // toastError(error);
    }
  };

  // reject Alert
  const handleReject = (item: Item) => {
    Alert.alert(
      'Reject!',
      'Are you sure you want to reject the appointment?',
      [
        {
          text: 'Reject Appointment',
          onPress: () => handleRejectAlert(item?._id),
        },
        {
          text: 'Not Now',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };
  const handleOnEndReached = () => {
    if (!lastPageReached) {
      // Check if the loading state is false and the last page has not been reached
      if (limit !== prevLimit) {
        // Check if the current limit is different from the previous limit
        setPrevLimit(limit); // Update the previous limit
        setLimit(limit + 10); // Increase the limit
      }
    }
  };

  if (isConnected === false) {
    return <InterNetError labels={'Appointment'} />;
  } else {
    return (
      <View style={{flex: 1, width: width, backgroundColor: '#eee'}}>
        {/* sending the header */}
        <Headerr
          secndheader={true}
          label="Appointment"
          btn={
            userObj?.role == Roles.PATIENT || userObj?.role == Roles.FRANCHISE
              ? true
              : false
          }
          btnlbl="Book Appointment"
        />
        {/* this is feedback  */}
        <Modal
          isVisible={modalVisible}
          animationIn={'bounceIn'}
          animationOut={'slideOutDown'}
          onBackButtonPress={() => setModalVisible1(false)}
          style={{marginLeft: 0, marginRight: 0}}>
          <TouchableWithoutFeedback onPress={() => setModalVisible1(false)}>
            <FeedBack cartId={provideId} onCloseModal={closeModal} />
          </TouchableWithoutFeedback>
        </Modal>

        {user == 'DOCTOR' && (
          <View
            style={{
              width: wp(95),
              alignSelf: 'center',
              marginTop: hp(1),
              flexDirection: 'row',
              // marginBottom: hp(1),
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => setDateModal(true)}
              style={{width: wp(35)}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.8),
                  fontFamily: mainFont,
                }}>
                From Date:
              </Text>
              <TextInput
                editable={false}
                placeholder="YYYY-MM-DD"
                value={fromDate}
                placeholderTextColor={'gray'}
                style={{
                  height: hp(6),
                  width: wp(35),
                  backgroundColor: '#F2F2F2E5',
                  marginTop: hp(0.5),
                  borderRadius: 5,
                  borderColor: 'gray',
                  borderWidth: 0.7,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDateToModal(true)}
              style={{width: wp(35)}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.8),
                  fontFamily: mainFont,
                }}>
                To Date:
              </Text>
              <TextInput
                editable={false}
                placeholder="YYYY-MM-DD"
                value={toDate}
                placeholderTextColor={'gray'}
                style={{
                  height: hp(6),
                  width: wp(35),
                  backgroundColor: '#F2F2F2E5',
                  marginTop: hp(0.5),
                  borderRadius: 5,
                  borderColor: 'gray',
                  borderWidth: 0.7,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                HandleGetAppointmentsWithFilterPaginated();
                setPage(1);
              }}
              style={{
                width: wp(18),
                backgroundColor: maincolor,
                height: hp(6),
                marginTop: hp(3),
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: hp(1.7),
                  fontFamily: mainFont,
                }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          isVisible={bookmodal}
          animationIn={'bounceIn'}
          animationOut={'bounceOut'}
          onBackButtonPress={() => setBookmodal(false)}
          style={{marginLeft: 0, marginRight: 0}}>
          <View
            style={{
              width: wp(85),
              paddingTop: hp(3),
              paddingBottom: hp(3),
              backgroundColor: 'white',
              alignSelf: 'center',
              borderRadius: 5,
              paddingLeft: wp(4),
              paddingRight: wp(4),
            }}>
            <TouchableOpacity
              onPress={() => setBookmodal(false)}
              style={{alignSelf: 'flex-end'}}>
              <Image
                source={require('../../assets/images/close.png')}
                style={{tintColor: 'black', height: wp(5), width: wp(5)}}
              />
            </TouchableOpacity>
            <View
              style={{
                height: wp(14),
                width: wp(14),
                backgroundColor: '#D8D8D8E5',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                borderRadius: wp(8),
              }}></View>
            <Text
              style={{
                color: 'black',
                fontSize: hp(2),
                marginTop: hp(3),
                textAlign: 'center',
              }}>
              Are you sure You want to Cancel Appointment?
            </Text>
            <View
              style={{
                width: wp(75),
                alignSelf: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => setBookmodal(false)}
                style={{
                  height: hp(5),
                  marginTop: hp(2),
                  width: wp(35),
                  borderColor: maincolor,
                  alignSelf: 'center',
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 0.8,
                }}>
                <Text
                  style={{
                    color: maincolor,
                    fontFamily: mainFont,
                    fontSize: hp(2),
                  }}>
                  Back
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setBookmodal(false)}
                style={{
                  height: hp(5),
                  marginTop: hp(2),
                  width: wp(35),
                  backgroundColor: maincolor,
                  alignSelf: 'center',
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: mainFont,
                    fontSize: hp(2),
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/*  this modal created to submit the feedback option */}

        <FlatList
          showsVerticalScrollIndicator={false}
          data={appointmentsArr}
          ListEmptyComponent={
            <>
              {loading ? (
                <View style={styles.mainView}>
                  <Pressable
                    style={{
                      display: 'flex',
                      height: hp(80),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Animated.Image
                      source={require('../../assets/images/Logo.png')}
                      style={{
                        resizeMode: 'contain',
                        height: wp(10),
                        width: wp(30),
                        transform: [{scale: animation}],
                      }}
                    />
                  </Pressable>
                </View>
              ) : (
                <View
                  style={{
                    display: 'flex',
                    height: height,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>No appointments found </Text>
                  {userObj?.role == Roles.PATIENT && (
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: wp(3.5),
                        marginTop: hp(2),
                        backgroundColor: '#1263AC',
                        borderRadius: 5,
                        padding: wp(1.5),
                      }}
                      onPress={() => CheckIsUserLoggedIn()}>
                      Book Your Appointments
                    </Text>
                  )}
                </View>
              )}
              {loading ? (
                <View style={styles.mainView}>
                  <Pressable
                    style={{
                      display: 'flex',
                      height: hp(80),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Animated.Image
                      source={require('../../assets/images/Logo.png')}
                      style={{
                        resizeMode: 'contain',
                        height: wp(10),
                        width: wp(30),
                        transform: [{scale: animation}],
                      }}
                    />
                  </Pressable>
                </View>
              ) : (
                <View
                  style={{
                    display: 'flex',
                    height: hp(85),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: hp(2)}}>No appointments found </Text>
                  {userObj?.role == Roles.PATIENT && (
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: wp(3),
                        marginTop: hp(1),
                        backgroundColor: '#1263AC',
                        borderRadius: 5,
                        padding: wp(1.5),
                      }}
                      onPress={() => navigation.navigate('BookAppt')}>
                      Book Your Appointments
                    </Text>
                  )}
                </View>
              )}
            </>
          }
          removeClippedSubviews={true}
          contentContainerStyle={{paddingBottom: hp(10)}}
          onEndReached={() => {
            setPage(page + 1);
            HandleGetAppointmentsPaginated(page + 1);
          }}
          onEndReachedThreshold={0.5}
          initialNumToRender={limit}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: width,
                  paddingTop: hp(2),
                  paddingBottom: hp(2),
                  backgroundColor: 'white',
                  elevation: 3,
                  marginBottom: hp(1),
                }}>
                {userObj?.role !== Roles.DOCTOR &&
                  userObj?.role !== Roles.EXPERT && (
                    <View
                      style={{
                        width: wp(95),
                        alignSelf: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={{uri: generateFilePath(item?.doctor?.image)}}
                          style={{height: wp(15), width: wp(15)}}
                        />
                        <View
                          style={{
                            marginLeft: wp(2),
                            height: wp(15),
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: hp(1.8),
                              fontFamily: mainFontBold,
                              textTransform: 'capitalize',
                            }}>
                            {item?.doctor?.name}
                          </Text>
                          <Text
                            style={{
                              color: '#7E7B7B',
                              fontSize: hp(1.8),
                              fontFamily: mainFont,
                              width: wp(100 - 45),
                            }}>
                            {item?.doctor?.specialization}
                          </Text>
                          <Text
                            style={{
                              color: '#7E7B7B',
                              fontSize: hp(1.8),
                              fontFamily: mainFont,
                            }}>
                            Fee : ₹{item?.doctor?.serviceCharge}/-
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        {item.status === 'pending' ? (
                          <View
                            style={{
                              backgroundColor: '#eee',

                              height: hp(4),
                              borderRadius: 5,
                              marginTop: hp(3),
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: wp(2),
                            }}>
                            <Text
                              style={{
                                color: '#cb9608',
                                fontFamily: mainFontBold,
                                textTransform: 'capitalize',
                                fontSize: hp(1.7),
                              }}>
                              Pending
                            </Text>
                          </View>
                        ) : item.status === 'completed' ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <TouchableOpacity
                              style={{
                                backgroundColor: 'rgba(65, 129, 139, 0.96)',
                                height: hp(4),
                                borderRadius: 5,
                                marginTop: hp(3),
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: wp(2),
                              }}
                              onPress={() => submitFeedback(item?.doctor?._id)}>
                              <Text
                                style={{
                                  fontSize: hp(1.7),
                                  color: '#fff',
                                  fontFamily: mainFont,
                                  textTransform: 'capitalize',
                                }}>
                                Feedback
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View
                            style={{
                              backgroundColor:
                                item.status === 'rejected'
                                  ? '#eee'
                                  : 'rgba(11, 116, 46, 0.7)',
                              height: hp(4),
                              borderRadius: 5,
                              marginTop: hp(3),
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: wp(2),
                            }}>
                            <Text
                              style={{
                                fontSize: hp(1.7),
                                color:
                                  item.status === 'rejected' ? 'red' : '#fff',
                                fontFamily:
                                  item.status === 'rejected'
                                    ? 'mainFontBold'
                                    : 'mainFont',
                                textTransform: 'capitalize',
                              }}>
                              {item?.status}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                <View style={{width: width, flexDirection: 'row'}}>
                  <View
                    style={{
                      width: wp(45),
                      paddingLeft: wp(3),
                      paddingTop: hp(2),
                    }}>
                    <View
                      style={[
                        styles.common_displayFlex,
                        {justifyContent: 'space-between'},
                      ]}>
                      <View
                        style={[styles.common_displayFlex, {width: wp(50)}]}>
                        <Profiles_setting_icons
                          name="profile"
                          style={styles.iconsStyls}
                        />
                        <Text style={{fontSize: hp(2)}}>Patient Name:</Text>
                      </View>
                      <Text
                        style={{
                          color: '#8A8988',
                          textTransform: 'capitalize',
                          fontSize: hp(2),
                        }}>
                        {item?.patientName}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.common_displayFlex,
                        {justifyContent: 'space-between'},
                      ]}>
                      <View
                        style={[styles.common_displayFlex, {width: wp(50)}]}>
                        <Mans_icons name="man" style={styles.iconsStyls} />
                        <Text style={{fontSize: hp(2)}}>Age:</Text>
                      </View>
                      <Text
                        style={{
                          color: 'gray',
                          fontSize: hp(1.8),
                        }}>
                        {item?.age === 0 || item?.age === undefined
                          ? ''
                          : `${item?.age} Year `}
                        {item?.months == 0 || item?.months === undefined
                          ? ''
                          : item?.age > 0 || item?.months > 0
                          ? `${item?.months} Month`
                          : ''}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.common_displayFlex,
                        {justifyContent: 'space-between'},
                      ]}>
                      <View
                        style={[styles.common_displayFlex, {width: wp(50)}]}>
                        <Profiles_setting_icons
                          name="setting"
                          style={styles.iconsStyls}
                        />
                        <Text style={{fontSize: hp(2)}}>Service Booked:</Text>
                      </View>
                      <View style={styles.common_displayFlex}>
                        <Text
                          style={{
                            color: 'gray',
                            textTransform: 'capitalize',
                            fontSize: hp(2),
                          }}>
                          {item.mode === 'Offline'
                            ? 'Clinic visit'
                            : 'Video Call'}
                        </Text>
                        <Walkink_Video_icons
                          name={item.mode === 'Offline' ? 'walking' : 'video'}
                          style={{
                            color:
                              item.status === 'canceled'
                                ? item.mode === 'Offline'
                                  ? 'red'
                                  : 'blue'
                                : item.mode === 'Offline'
                                ? 'green'
                                : 'blue',
                            marginLeft: 7,

                            fontSize: item.mode === 'Offline' ? hp(3) : hp(2),
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={[
                        styles.common_displayFlex,
                        {justifyContent: 'space-between'},
                      ]}>
                      <View
                        style={[styles.common_displayFlex, {width: wp(50)}]}>
                        <Money_icons name="money" style={styles.iconsStyls} />
                        <Text style={{fontSize: hp(2)}}>Price:</Text>
                      </View>
                      <Text
                        style={{
                          color: 'gray',
                          textTransform: 'capitalize',
                          fontSize: hp(2),
                        }}>
                        ₹ {item?.appointmentCharge}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.common_displayFlex,
                        {justifyContent: 'space-between'},
                      ]}>
                      <View
                        style={[styles.common_displayFlex, {width: wp(50)}]}>
                        <Calendar_icons
                          name="calendar-day"
                          style={styles.iconsStyls}
                        />
                        <Text style={{fontSize: hp(2)}}>Appointment Date:</Text>
                      </View>
                      <Text
                        style={{
                          color: 'gray',
                          fontSize: hp(1.8),
                          fontFamily: 'mainFont',
                        }}>
                        {moment(item?.dateTime).format('DD-MM-YYYY')}
                        {'  '}
                        <Text style={{fontFamily: mainFontmedium}}>
                          {item.selectedTimeSlot}
                        </Text>
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.common_displayFlex,
                        {justifyContent: 'space-between'},
                      ]}>
                      <View
                        style={[styles.common_displayFlex, {width: wp(50)}]}>
                        <Status_icons
                          name="money-bill"
                          style={styles.iconsStyls}
                        />
                        <Text style={{fontSize: hp(2)}}>Payment Status:</Text>
                      </View>
                      <Text
                        style={{
                          color: 'gray',
                          textTransform: 'capitalize',
                          fontSize: hp(2),
                        }}>
                        {item.paymentStatus}
                      </Text>
                    </View>
                    <View style={[styles.common_displayFlex, ,]}>
                      <View
                        style={[styles.common_displayFlex, {width: wp(50)}]}>
                        <Status_icons
                          name="money-bill-transfer"
                          style={styles.iconsStyls}
                        />
                        <Text style={{fontSize: hp(2)}}>
                          Appointment Status:
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: hp(2),
                          color:
                            item.status === 'rejected'
                              ? 'red'
                              : item.status === 'completed'
                              ? 'green'
                              : item.status === 'cancelled'
                              ? '#98980c'
                              : '#0c1599',
                          fontFamily: mainFontBold,
                          textTransform: 'capitalize',
                        }}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>

                {item.status !== 'canceled' && (
                  <View
                    style={{
                      width: wp(90),
                      alignSelf: 'center',
                      alignItems: 'center',
                      marginTop: hp(2),
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {(userObj?.role == Roles.DOCTOR ||
                      userObj?.role == Roles.FRANCHISE ||
                      userObj?.role == Roles.PATIENT) &&
                      item.mode === consultationMode.ONLINE &&
                      (item.status === appointmentStatus.CONFIRMED ||
                        item.status === appointmentStatus.COMPLETED ||
                        item.status === appointmentStatus.RESCHEDULE ||
                        item.status === appointmentStatus.FOLLOWUP) && (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('AppointHistory', {data: item})
                          }
                          style={{
                            flex: 1,
                            minWidth: wp(41),
                            marginRight: 10,
                            marginTop: 15,
                            height: hp(5),
                            backgroundColor: '#1263AC',
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: mainFont,
                              fontSize: hp(1.8),
                            }}>
                            History
                          </Text>
                        </TouchableOpacity>
                      )}
                    {(userObj?.role == Roles.DOCTOR ||
                      userObj?.role == Roles.FRANCHISE ||
                      userObj?.role == Roles.PATIENT) &&
                      (item.status === appointmentStatus.CONFIRMED ||
                        item.status === appointmentStatus.COMPLETED ||
                        item.status === appointmentStatus.RESCHEDULE ||
                        item.status === appointmentStatus.FOLLOWUP) && (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Chat', {data: item._id})
                          }
                          style={{
                            flex: 1,
                            minWidth: wp(41),
                            marginRight: 10,
                            marginTop: 15,
                            height: hp(5),
                            backgroundColor: '#1263AC',
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: mainFont,
                              fontSize: hp(1.8),
                            }}>
                            Chat
                          </Text>
                        </TouchableOpacity>
                      )}
                    {(userObj?.role == Roles.PATIENT ||
                      userObj?.role == Roles.FRANCHISE) &&
                      item.isPrescription === 'ready' &&
                      item.mode == consultationMode.ONLINE && (
                        <TouchableOpacity
                          onPress={() => handleDownloadPrescription(item._id)}
                          style={{
                            flex: 1,
                            minWidth: wp(41),
                            marginRight: 10,
                            marginTop: 15,
                            height: hp(5),
                            backgroundColor: '#50B148',
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: mainFont,
                              fontSize: hp(1.8),
                            }}>
                            Downloade Prescription
                          </Text>
                        </TouchableOpacity>
                      )}
                    {userObj?.role == Roles.DOCTOR &&
                      item.status === appointmentStatus.PENDING && (
                        <TouchableOpacity
                          onPress={() => handleReject(item)}
                          style={{
                            flex: 1,
                            minWidth: wp(41),
                            marginRight: 10,
                            marginTop: 15,
                            alignSelf: 'center',
                            height: hp(5),
                            backgroundColor: '#1263AC',
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: mainFont,
                              fontSize: hp(1.8),
                            }}>
                            Reject
                          </Text>
                        </TouchableOpacity>
                      )}
                    {userObj?.role == Roles.DOCTOR &&
                      (item.status === appointmentStatus.PENDING ||
                        item.status === appointmentStatus.RESCHEDULE) && (
                        <TouchableOpacity
                          onPress={() =>
                            handlechangeAppointmentStatus(
                              item._id,
                              appointmentStatus.CONFIRMED,
                            )
                          }
                          style={{
                            flex: 1,
                            minWidth: wp(41),
                            marginRight: 10,
                            marginTop: 15,
                            alignSelf: 'center',
                            height: hp(5),
                            backgroundColor: '#1263AC',
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: mainFont,
                              fontSize: hp(1.8),
                            }}>
                            Accept
                          </Text>
                        </TouchableOpacity>
                      )}

                    {/* {(userObj?.role === Roles.PATIENT ||
                      userObj?.role === Roles.FRANCHISE) &&
                      (item.status === appointmentStatus.CONFIRMED ||
                        item.status === appointmentStatus.COMPLETED) &&
                      item.mode === consultationMode.ONLINE &&
                      item.callInprogress && (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedMeeting(item);
                            handleJoinMeeting(item._id, true);
                          }}
                          style={{
                            flex: 1,
                            minWidth: wp(41),
                            marginRight: 10,
                            marginTop: 15,
                            alignSelf: 'center',
                            height: hp(5),
                            backgroundColor: '#1263AC',
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: mainFont,
                              fontSize: hp(1.8),
                            }}>
                            Start Call
                          </Text>
                        </TouchableOpacity>
                      )} */}
                    {userObj?.role === Roles.DOCTOR &&
                      item.mode === consultationMode.ONLINE &&
                      (item.status === appointmentStatus.CONFIRMED ||
                        item.status === appointmentStatus.COMPLETED) && (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedMeeting(item);
                            handleJoinMeeting(item._id, true);
                          }}
                          style={{
                            flex: 1,
                            minWidth: wp(41),
                            marginRight: 10,
                            marginTop: 15,
                            alignSelf: 'center',
                            height: hp(5),
                            backgroundColor: '#1263AC',
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: mainFont,
                              fontSize: hp(1.8),
                            }}>
                            Start Call
                          </Text>
                        </TouchableOpacity>
                      )}

                    {(item.status == appointmentStatus.CONFIRMED ||
                      item.status == appointmentStatus.FOLLOWUP) &&
                      userObj?.role == Roles.DOCTOR && (
                        <TouchableOpacity
                          onPress={() => onPressUpdateStatus(item)}
                          style={{
                            flex: 1,
                            minWidth: wp(41),
                            marginRight: 10,
                            marginTop: 15,
                            alignSelf: 'center',
                            height: hp(5),
                            backgroundColor: '#1263AC',
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: mainFont,
                              fontSize: hp(1.8),
                            }}>
                            Update Status
                          </Text>
                        </TouchableOpacity>
                      )}
                    {(userObj?.role == Roles.FRANCHISE ||
                      userObj?.role == Roles.PATIENT) &&
                      item.status === appointmentStatus.COMPLETED && (
                        <TouchableOpacity
                          onPress={() => {
                            setComplaintModal(true);
                            setSelectedAppointmentId(item?._id);
                          }}
                          style={{
                            flex: 1,
                            minWidth: wp(41),
                            marginRight: 10,
                            marginTop: 15,
                            alignSelf: 'center',
                            height: hp(5),
                            backgroundColor: 'red',
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: mainFont,
                              fontSize: hp(1.8),
                            }}>
                            Raise Issue
                          </Text>
                        </TouchableOpacity>
                      )}
                    {/* reascudle */}
                    {(userObj?.role == Roles.FRANCHISE ||
                      userObj?.role == Roles.PATIENT ||
                      userObj?.role == Roles.DOCTOR) &&
                      (item.status === appointmentStatus.CONFIRMED ||
                        item.status === appointmentStatus.RESCHEDULE ||
                        item.status === appointmentStatus.PENDING) && (
                        <TouchableOpacity
                          onPress={() => onPressReschedule(item)}
                          style={{
                            flex: 1,
                            minWidth: wp(41),
                            marginRight: 10,
                            marginTop: 15,
                            alignSelf: 'center',
                            height: hp(5),
                            backgroundColor: '#1263AC',
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: mainFont,
                              fontSize: hp(1.8),
                            }}>
                            Reschedule
                          </Text>
                        </TouchableOpacity>
                      )}
                    {/* cancling  by patent*/}

                    {(userObj?.role == Roles.FRANCHISE ||
                      userObj?.role == Roles.PATIENT) &&
                      item.status === appointmentStatus.PENDING && (
                        <TouchableOpacity
                          onPress={() => handleCancleApt(item)}
                          style={{
                            flex: 1,
                            minWidth: wp(41),
                            marginRight: 10,
                            marginTop: 15,
                            alignSelf: 'center',
                            height: hp(5),
                            backgroundColor: '#eee',
                            borderColor: '#1263AC',
                            borderWidth: 0.8,
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: '#1263AC',
                              fontFamily: mainFont,
                              fontSize: hp(1.8),
                            }}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                      )}
                  </View>
                )}
              </View>
            );
          }}
        />

        <Modal
          isVisible={soModalreschedule}
          animationIn={'bounceIn'}
          animationOut={'slideOutDown'}
          onBackButtonPress={() => setSoModalreschedule(false)}
          style={{marginLeft: 0, marginRight: 0}}>
          <TouchableWithoutFeedback onPress={() => setSoModalreschedule(false)}>
            <Reschedule
              cartID={pacentID}
              closeModal={closeRescheduleModal}
              drrIdes={drIds}
              modeOf={modeOftreetement}
              // reRenderFun={HandleGetAppointmentsPaginate(1)}
            />
          </TouchableWithoutFeedback>
        </Modal>

        {/* this is code for the update the status  of pacent appointment by dr */}
        <Modal
          isVisible={soUpdateModals}
          animationIn={'bounceIn'}
          animationOut={'bounceOut'}
          onBackButtonPress={() => setSoupdateModals(false)}
          style={{marginLeft: 0, marginRight: 0}}>
          <View>
            <CompleteFollowupModal
              cartID={pacentID}
              closeModal={closeUpdateStatusModal}
              drrIdes={drIds}
              modeOf={modeOftreetement}
            />
          </View>
        </Modal>

        <Modal
          isVisible={dateModal}
          animationIn={'bounceIn'}
          animationOut={'bounceOut'}
          onBackButtonPress={() => setDateModal(false)}
          style={{marginLeft: 0, marginRight: 0}}>
          <View
            style={{
              width: wp(85),
              paddingTop: hp(1),
              paddingBottom: hp(3),
              backgroundColor: 'white',
              alignSelf: 'center',
              borderRadius: 5,
              paddingLeft: wp(4),
              paddingRight: wp(4),
            }}>
            <TouchableOpacity
              onPress={() => setDateModal(false)}
              style={{alignSelf: 'flex-end'}}>
              <Clode_icons
                name="close"
                style={{
                  fontSize: hp(4),
                  paddingLeft: wp(6),
                  marginBottom: hp(1),
                }}
              />
            </TouchableOpacity>
            <Calendar
              onDayPress={day => {
                setFromDate(day.dateString);
                setDateModal(false);
              }}
            />
          </View>
        </Modal>

        <Modal
          isVisible={dateToModal}
          animationIn={'bounceIn'}
          animationOut={'bounceOut'}
          onBackButtonPress={() => setDateToModal(false)}
          style={{marginLeft: 0, marginRight: 0}}>
          <View
            style={{
              width: wp(85),
              paddingTop: hp(1),
              paddingBottom: hp(3),
              backgroundColor: 'white',
              alignSelf: 'center',
              borderRadius: 5,
              paddingLeft: wp(4),
              paddingRight: wp(4),
            }}>
            <TouchableOpacity
              onPress={() => setDateToModal(false)}
              style={{alignSelf: 'flex-end'}}>
              <Clode_icons
                name="close"
                style={{
                  fontSize: hp(4),
                  paddingLeft: wp(6),
                  marginBottom: hp(1),
                }}
              />
            </TouchableOpacity>
            <Calendar
              onDayPress={day => {
                settoDate(day.dateString);
                setDateToModal(false);
              }}
              minDate={
                fromDate && fromDate != ''
                  ? `${new Date(fromDate)}`
                  : `${new Date()}`
              }
            />
          </View>
        </Modal>

        <Modal
          isVisible={complaintModal}
          animationIn={'bounceIn'}
          animationOut={'slideOutDown'}
          onBackButtonPress={() => setComplaintModal(false)}
          style={{marginLeft: 0, marginRight: 0}}>
          <View
            style={{
              width: wp(85),
              paddingTop: hp(3),
              paddingBottom: hp(3),
              backgroundColor: 'white',
              alignSelf: 'center',
              borderRadius: 5,
              paddingLeft: wp(4),
              paddingRight: wp(4),
            }}>
            <TouchableOpacity
              onPress={() => setComplaintModal(false)}
              style={{alignSelf: 'flex-end'}}>
              <Image
                source={require('../../assets/images/close.png')}
                style={{tintColor: 'black', height: wp(5), width: wp(5)}}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                color: 'black',
                fontFamily: mainFont,
                fontWeight: 'bold',
              }}>
              Raise an issue
            </Text>

            <TextInput
              placeholder="Title"
              style={{marginTop: 15, color: 'gray', backgroundColor: '#e6edf7'}}
              onChangeText={e => setTitle(e)}
              value={title}
              placeholderTextColor="gray"
            />
            <TextInput
              placeholder="Message"
              style={{
                marginVertical: 15,
                color: 'gray',
                backgroundColor: '#e6edf7',
              }}
              onChangeText={e => setDetails(e)}
              value={details}
              multiline
              placeholderTextColor="gray"
            />
            <TouchableOpacity
              onPress={() => handleAddComplaint()}
              style={{
                minWidth: wp(80),
                height: 42,
                marginTop: 15,
                alignSelf: 'center',
                backgroundColor: '#1263AC',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: mainFont,
                  fontSize: hp(1.8),
                }}>
                Raise an issue / complaint
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          isVisible={meetingConfirmation}
          animationIn={'zoomIn'}
          animationOut={'zoomOut'}
          onBackButtonPress={() => setMeetingConfirmation(false)}
          style={{marginLeft: 0, marginRight: 0}}>
          <View
            style={{
              width: wp(85),
              height: hp(70),
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
              <Text style={{color: 'white', fontSize: hp(1.8)}}>
                CONSENT FORM FOR TELECOMMUNICATION{' '}
              </Text>
              <Text style={{color: 'white', fontSize: hp(1.8)}}>
                दूरसंचार के लिए सहमति{' '}
              </Text>
            </View>
            <ScrollView
              contentContainerStyle={{
                marginTop: 15,
                width: wp(75),
                alignSelf: 'center',
                paddingBottom: 25,
              }}>
              <Text
                style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
                - जांच कराने के लिए दूर-दराज के ओपीडी डॉक्टर के पास जाने के लिए
                विकल्प नहीं है। इस ओपीडी के पीछे मुख्य विचार दूर-दराज के इलाकों
                में जहां डॉक्टर की उपलब्धता कम है, मरीज़ों को योग्य डॉक्टरों की
                आसानी से उपलब्धता कराना है ताकि मरीज़ उनके लक्षणों को नज़रअंदाज़
                न करें और गंभीर बीमारियों की चपेट में जल्दी आ जाएं।
              </Text>
              <Text
                style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
                - ⁠सभी परामर्श एमसीआई में पंजीकृत डाक्टरों द्वारा ही दिये
                जाएँगे। रोगी की बीमारी के कारण किसी भी अप्रिय घटना के लिए फीवर
                99 जिम्मेदार नहीं होगा।
              </Text>
              <Text
                style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
                - ⁠दूर रहने वाले और चलने-फिरने में असमर्थ मरीज़ भी एक ओपीडी के
                माध्यम से अपना फ़ॉलोअप या रिपोर्ट जाँच करा सकते हैं।
              </Text>
              <Text
                style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
                - ⁠स्वास्थ्य कार्यकर्ता या आर.एम.पी की उपस्थिति में ही विशेषज्ञ
                और सुपर विशेषज्ञ परामर्श दिया जाएगा।
              </Text>
              <Text
                style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
                - ⁠यदि परामर्श के बाद भी स्वास्थ्य एवं रोग में कोई सुधार न हो तो
                तुरंत नज़दीकी अस्पताल में जाकर चिकित्सा की सलाह लें।
              </Text>
              <Text
                style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
                - डॉक्टर अपनी समझ या बताई गई समस्याओं के अनुसार आपको सलाह देगा,
                लेकिन कई लक्षण बिना आत्म-जांच के छूट सकते हैं, ऐसी स्थिति में
                सुझाव देने वाले डॉक्टर को दोषी नहीं ठहराया जा सकता है।
              </Text>
              <Text
                style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
                - काउंटर पर मिलने वाली दवाओं के लिये ही प्रिसक्रिप्शन दिया
                जाएगा।
              </Text>
              <Text
                style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
                - ⁠यह सलाह किसी भी चिकित्सकीय क़ानूनी अद्देश्यों के लिए मान्य
                नहीं है।
              </Text>
              <Text
                style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
                - यह सुविधा आपातकालीन स्थितियों के लिए नहीं है, किसी भी
                आपातकालीन सेवा के लिए तुरंत नज़दीकी डॉक्टर से संपर्क करें !!
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(2),
                  alignSelf: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => setMeetingConfirmation(false)}
                  style={{
                    width: wp(25),
                    height: hp(5),
                    backgroundColor: '#BD2626',
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontSize: hp(1.8), color: 'white'}}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleJoinMeeting(selectedMeeting._id, true)}
                  style={{
                    width: wp(25),
                    height: hp(5),
                    backgroundColor: '#50B148',
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: wp(5),
                  }}>
                  <Text style={{fontSize: hp(1.8), color: 'white'}}>
                    I Agree
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
};

export default Appointment;
const styles = StyleSheet.create({
  common_displayFlex: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  iconsStyls: {
    color: '#1263AC',
    fontSize: hp(2.5),
    marginRight: wp(3),
    marginVertical: 4,
    width: wp(5),
    textAlign: 'center',
  },
  mainView: {
    height: hp(99),
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontFamily: mainFontBold,
    color: 'gray',
    fontSize: wp(3),
  },
});
