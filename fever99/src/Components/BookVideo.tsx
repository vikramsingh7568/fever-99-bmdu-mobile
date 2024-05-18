import {
  View,
  Text,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr';
import Clode_icons from 'react-native-vector-icons/AntDesign';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import {toastError, toastSuccess} from '../utils/toast.utils';
import {addAppointments} from '../Services/appointments.service';
import Modal from 'react-native-modal';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import DocumentPicker from 'react-native-document-picker';
import {fileUpload} from '../Services/fileUpload.service';
import {getstateAndCities} from '../Services/stateCity.service';
import {SendNotificationForMeetingCreation} from '../Services/notificationSevice';
import {getWallet} from '../Services/wallet.service';
const {height, width} = Dimensions.get('window');
import {getUser} from '../Services/user.service';
import url from '../Services/url.service';

const modeOf = 'Video';

const BookVideo = (props: any) => {
  const mainFont = 'Montserrat-Regular';
  const mainFontBold = 'Montserrat-Bold';
  const mainFontmedium = 'Montserrat-Medium';
  const maincolor = '#1263AC';
  const navigation: any = useNavigation();
  const [userObj, setUserObj] = useState<any>('');
  const focused = useIsFocused();
  const [isFocus, setIsFocus] = useState(false);
  const [isGenderFocused, setIsGenderFocused] = useState(false);
  const [dateModal, setDateModal] = useState(false);

  const [page, setPage] = useState(1);

  const [state, setstate] = useState('');
  const [city, setCity] = useState('');

  const [statesArr, setStatesArr] = useState<any[]>([]);
  const [cityArr, setCityArr] = useState<any[]>([]);

  const [meetingConfirmation, setMeetingConfirmation] = useState(false);



  const [heightUnits, setHeightUnit] = useState('ft');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [centimeters, setCentimeters] = useState('');



  const textInputStyle = {
    height: hp(7.1),
    width: wp(29),
    backgroundColor: '#F2F2F2E5',
    marginTop: hp(1),
    borderRadius: wp(1.2),
    fontSize: hp(2),
    borderColor: 'gray',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0,
  };



  const Dropdwndata = [
    {
      label: 'Male',
      value: 'Male',
    },
    {
      label: 'Female',
      value: 'Female',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ];
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

  const [age, setAge] = useState(0);
  const [months, setMonths] = useState(0);
  const [dateTime, setDateTime] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [gender, setGender] = useState('');
  const [mode, setMode] = useState('');
  const [patientName, setPatientName] = useState('');
  const [doctorObj, setDoctorObj] = useState(props?.route?.params?.doctor);

  const [bodyTemperature, setBodyTemperature] = useState('');
  const [bp, setBp] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [oxigne, setOxigne] = useState('');
  const [pulse, setPulse] = useState('');
  const [suger1, setSuger1] = useState('');
  const [suger2, setSuger2] = useState('');
  const [suger3, setSuger3] = useState('');
  const [respiratoryRate, setRespiratoryRate] = useState('');
  const [height, setHeight] = useState(0);
  const [heightUnit, setUnit] = useState('cm');
  const [weight, setWeight] = useState(0);
  const [bmi, setBmi] = useState('');
  const [cityIsFocused, setCityIsFocused] = useState(false);
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState([]);
  const [drrIdes, setDrrIdes] = useState(props?.route?.params?.doctor._id);
  const [timeSlotss, setTimeSlot] = useState([]);

  const tempanount = 10;
  const handleGetAndSetUser = async () => {
    let userData = await getUser();
    if (userData) {
      setUserObj(userData);
    }
  };

  const data = ['ft', 'cm'];

  const chunkSize = 3;
  const chunkedData = Array.from(
    {length: Math.ceil(data.length / chunkSize)},
    (_, index) => data.slice(index * chunkSize, index * chunkSize + chunkSize),
  );

  //------

  // const calculateBMI = () => {
  //   if (height && weight) {
  //     let heightInMeters = 0;
  //     if (heightUnit === 'ft') {
  //       const [feet, inches] = height.split('.');
  //       heightInMeters =
  //         parseInt(feet) * 0.3048 + parseInt(inches || '0') * 0.0254;
  //     } else if (heightUnit === 'cm') {
  //       heightInMeters = parseFloat(height) / 100;
  //     }
  //     const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
  //     setBmi(bmiValue);
  //   }
  // };

  // useEffect(() => {
  //   calculateBMI();
  // }, [heightUnit, height, weight, bmi]);


  //--------


  const [weightUnits, setWeightUnit] = useState('lbs');


  const calculateBMI = () => {
    let heightInMeters;
    if (heightUnits === 'ft') {
      const totalInches = parseFloat(feet) * 12 + parseFloat(inches);
      heightInMeters = totalInches * 0.0254;
    } else {
      heightInMeters = parseFloat(centimeters) * 0.01;
    }

    let weightInKg;
    if (weightUnits === 'lbs') {
      weightInKg = parseFloat(weight) 
    } else {
      weightInKg = parseFloat(weight);
    }

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    console.log('bmi value is this',bmiValue)
    setBmi(bmiValue.toFixed(2));
  };

  useEffect(() => {
    if ((heightUnits === 'ft' && (feet !== '' || inches !== '')) ||
        (heightUnits === 'cm' && centimeters !== '') || weight !== '') {
      calculateBMI();
    }
  }, [feet, inches, centimeters, weight, heightUnits, weightUnits]);
  


  const handleDateChange = async (selectedDate: string) => {
    try {
      setTimeSlot([]);
      const dateObject = new Date(selectedDate);
      // converting into dd/mm/yyyy
      const day = dateObject.getDate();
      const month = dateObject.getMonth() + 1;
      const year = dateObject.getFullYear();
      const formattedDay = day < 10 ? '0' + day : day;
      const formattedMonth = month < 10 ? '0' + month : month;
      const dateString = `${formattedDay}-${formattedMonth}-${year}`;

      const response = await fetch(`${url}/time-slot/${drrIdes}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({dateTime: dateString}),
      });

      console.log({dateTime: dateString});

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Unexpected response type: ${contentType}`);
      }

      const responseData = await response.json();
      console.log('Response:', responseData);

      const timeSlotsArray = responseData[
        modeOf === 'Video' ? 'extractedOnlineTimes' : 'extractedOfflineTimes'
      ].map(time => ({
        label: time,
        value: time,
      }));

      setTimeSlot(timeSlotsArray);
    } catch (error) {
      console.error('Error fetching time slots:', error.message);
    }
  };

  useEffect(() => {
    setTimeSlot([]);
    handleDateChange(dateTime);
  }, [dateTime]);

  const handleCreateBooking = async () => {
    try {
      if (gender == '') {
        setMeetingConfirmation(false);
        setPage(1);
        toastError('Gender is mandatory !!!');
        return;
      }
      if (dateTime == '') {
        setMeetingConfirmation(false);
        setPage(1);
        toastError('Date is mandatory !!!');
        return;
      }
      if (height && !weight) {
        setMeetingConfirmation(false);
        setPage(2);
        toastError('heights or Weight are mandatory !!!');
        return;
      }
      if (age == 0 && months == 0) {
        setMeetingConfirmation(false);
        setPage(1);
        toastError('Age or Months are mandatory !!!');
        return;
      }
      if (age > 120) {
        setMeetingConfirmation(false);
        setPage(1);
        toastError('Please enter a valid age (1-120).');
        return;
      }
      if (months > 11) {
        setMeetingConfirmation(false);
        setPage(1);
        toastError('Please enter a valid Months (1-12).');
        return;
      }
      if (months < 0) {
        setMeetingConfirmation(false);
        setPage(1);
        toastError('Please enter a valid Months (1-12).');
        return;
      }
      if (selectedTimeSlot == '') {
        setMeetingConfirmation(false);
        setPage(1);
        toastError('Time Slot is mandatory !!!');
        return;
      }
      if (patientName == '') {
        setMeetingConfirmation(false);
        setPage(1);
        toastError('Patient Name is mandatory !!!');
        return;
      }
      let userData = await getUser();
      let obj = {
        age,
        bodyTemperature,
        bp,
        months,
        dateTime,
        doctorId: doctorObj?._id,
        expertId: userData._id,
        files,
        gender,
        height,
        heightUnit,
        weight,
        bmi,
        city,
        state,
        mode: 'Video',
        oxigne,
        patientName,
        paymentMode: 'Online',
        pulse,
        respiratoryRate,
        selectedTimeSlot,
        suger1,
        suger2,
        suger3,
      };
      console.log(obj);
      let {data: res} = await addAppointments(obj);
      if (res.appointment.status == 'pending') {
        setMeetingConfirmation(false);
        if (!res.status) {
          setMeetingConfirmation(false);
          toastError(res?.data?.message);
          return;
        }
        if (
          userObj?.role == 'FRANCHISE' &&
          res.appointment.appointmentCharge <= balance
        ) {
          await SendNotificationForMeetingCreation({
            appointment: res.appointment._id,
          });
          navigation.navigate('Appointment');
        } else if (res.appointment.appointmentCharge) {
          navigation.navigate('PayementScreen', {
            amount: res.appointment.appointmentCharge,
            appointmentId: res.appointment._id,
          });
        }
      }
    } catch (err) {
      toastError(err);
    }
  };

  const handleGetWallet = async () => {
    try {
      let {data: res}: any = await getWallet();
      console.log('this is iss is s', res?.data?.balance);
      if (res) {
        setWallet(res.transactions);
        setBalance(res?.data?.balance);
      }
    } catch (err) {
      toastError(err);
    }
  };

  useEffect(() => {
    if (focused) {
      handleGetWallet();
    }
  }, [focused]);

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
      // toastError(error);
    }
  };

  useEffect(() => {
    handleGetAndSetUser();
  }, [focused]);

  const HandleGetStatesAndCities = async () => {
    try {
      let {data: res} = await getstateAndCities();
      if (res.data && res.data.length > 0) {
        setStatesArr([
          ...res?.data?.map((el: any) => ({
            label: el.state,
            value: el.state,
            cities: el.city,
          })),
        ]);
      }
    } catch (err) {
      // toastError(err);
    }
  };
  useEffect(() => {
    if (focused) {
      HandleGetStatesAndCities();
    }
  }, [focused]);

  return (
    <View style={{width: width, flex: 1, backgroundColor: 'white'}}>
      <Headerr secndheader={true} label="Appointment Details" />
      <ScrollView
        style={{width: wp(95), height: height, alignSelf: 'center'}}
        showsVerticalScrollIndicator={false}>
        {page == 1 && (
          <>
            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(1),
                justifyContent: 'space-between',
              }}>
              <View style={{width: wp(45)}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  Date:
                </Text>
                <Pressable onPress={() => setDateModal(true)}>
                  <TextInput
                    placeholder="Select Date"
                    editable={false}
                    onChangeText={e => setDateTime(e)}
                    value={dateTime}
                    style={{
                      height: hp(6.7),
                      backgroundColor: '#F2F2F2E5',
                      marginVertical: hp(1),
                      borderRadius: wp(1.2),
                      borderColor: 'gray',
                      fontSize: hp(2),
                      borderWidth: 0.5,
                    }}
                  />
                </Pressable>
              </View>
              <View style={{width: wp(45)}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  Select Slot:
                </Text>
                <Dropdown
                  style={[styles.dropdown, isFocus && {borderWidth: 0.5}]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={timeSlotss}
                  search
                  maxHeight={300}
                  labelField="label"
                  
                  valueField="value"
                  placeholder="Select Slot"
                  searchPlaceholder="Search..."
                  value={selectedTimeSlot}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item: any) => {
                    setSelectedTimeSlot(item.value);
                    setIsFocus(false);
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
              <View style={{width: wp(45)}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  Patient Name:
                </Text>
                <TextInput
                  onChangeText={e => setPatientName(e)}
                  value={patientName}
                  placeholderTextColor="#8E8E8E"
                  placeholder="Patient Name"
                  style={{
                    height: hp(7.1),
                    fontSize: hp(2),
                    backgroundColor: '#F2F2F2E5',
                    marginTop: hp(1),
                    borderRadius: wp(1.2),
                    borderColor: 'gray',
                    borderWidth: 0.5,
                  }}
                />
              </View>
              <View style={{width: wp(45)}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  Patient Gender:
                </Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isGenderFocused && {borderWidth: 0.5},
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={Dropdwndata}
                  // search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Gender"
                  value={gender}
                  onFocus={() => setIsGenderFocused(true)}
                  onBlur={() => setIsGenderFocused(false)}
                  onChange={item => {
                    setGender(item.value);
                    setIsGenderFocused(false);
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
              <View style={{flexDirection: 'rew'}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  Patient Age:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: wp(45),
                  }}>
                  <View style={{width: wp(21)}}>
                    <TextInput
                      onChangeText={e => setAge(e)}
                      value={age}
                      keyboardType="number-pad"
                      placeholderTextColor="#8E8E8E"
                      placeholder="Years"
                      style={{
                        height: hp(7.1),
                        fontSize: hp(2),
                        backgroundColor: '#F2F2F2E5',
                        marginTop: hp(1),
                        borderRadius: wp(1.2),
                        paddingLeft: 3,
                        borderColor: 'gray',
                        borderWidth: 0.5,
                      }}
                    />
                  </View>
                  <View style={{width: wp(21)}}>
                    <TextInput
                      onChangeText={e => setMonths(e)}
                      value={months}
                      keyboardType="number-pad"
                      placeholderTextColor="#8E8E8E"
                      placeholder="Months"
                      style={{
                        height: hp(7.1),
                        fontSize: hp(2),
                        backgroundColor: '#F2F2F2E5',
                        marginTop: hp(1),
                        borderRadius: wp(1.2),
                        paddingLeft: 3,
                        borderColor: 'gray',
                        borderWidth: 0.5,
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
                  State:
                </Text>
                <Dropdown
                  style={[styles.dropdown]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={statesArr}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select State"
                  searchPlaceholder="Search..."
                  value={state}
                  onChange={(item: any) => {
                    setstate(item.value);
                    setCityArr([
                      ...item.cities.map((el: any) => ({label: el, value: el})),
                    ]);
                    setIsFocus(false);
                  }}
                />
              </View>
            </View>

            {cityArr && cityArr.length > 0 && (
              <>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    marginTop: wp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  City:
                </Text>

                <Dropdown
                  style={[
                    styles.dropdown,
                    {width: wp(95)},
                    cityIsFocused && {borderWidth: 0.5},
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={cityArr}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select City"
                  searchPlaceholder="Search..."
                  value={city}
                  onFocus={() => setCityIsFocused(true)}
                  onBlur={() => setCityIsFocused(false)}
                  onChange={(item: any) => {
                    setCity(item.value);
                    setCityIsFocused(false);
                  }}
                />
              </>
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: hp(2),
                width: wp(95),
              }}>
              <View style={{width: wp(95)}}>
                <TouchableOpacity onPress={handleDocumentPicker}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: mainFontmedium,
                      fontSize: hp(1.8),
                    }}>
                    Upload File
                  </Text>
                  <View
                    style={{
                      width: wp(95),
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
              </View>
            </View>
          </>
        )}
        {page == 2 && (
          <>
            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(1),
                justifyContent: 'space-between',
              }}>
              <View style={{width: wp(45)}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  BP <Text style={{color: 'black'}}>mm of Hg</Text>
                </Text>
                <TextInput
                  onChangeText={e => setBp(e)}
                  value={bp}
                  placeholderTextColor="#8E8E8E"
                  placeholder="Enter BP"
                  style={{
                    height: hp(7.1),
                    fontSize: hp(2),
                    backgroundColor: '#F2F2F2E5',
                    marginTop: hp(1),
                    borderRadius: wp(1.2),
                    borderColor: 'gray',
                    borderWidth: 0.5,
                  }}
                />
              </View>

              <View style={{width: wp(45)}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  Pulse <Text style={{color: 'black'}}>Per minute</Text>
                </Text>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={e => setPulse(e)}
                  value={pulse}
                  placeholderTextColor="#8E8E8E"
                  placeholder="Enter Pulse"
                  style={{
                    height: hp(7.1),
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
              <View style={{width: wp(45)}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  Body Temperature <Text style={{color: 'black'}}>°F</Text>
                </Text>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={e => setBodyTemperature(e)}
                  value={bodyTemperature}
                  placeholderTextColor="#8E8E8E"
                  placeholder="Enter Temperature"
                  style={{
                    height: hp(7.1),
                    fontSize: hp(2),
                    backgroundColor: '#F2F2F2E5',
                    marginTop: hp(1),
                    borderRadius: wp(1.2),
                    borderColor: 'gray',
                    borderWidth: 0.5,
                  }}
                />
              </View>

              <View style={{width: wp(45)}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  SpO2 %
                </Text>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={e => setOxigne(e)}
                  value={oxigne}
                  placeholderTextColor="#8E8E8E"
                  placeholder="Enter SpO2"
                  style={{
                    height: hp(7.1),
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
              <View style={{width: wp(45)}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  Respiratory rate (RR)
                  <Text>(bpm)</Text>
                </Text>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={e => setRespiratoryRate(e)}
                  value={respiratoryRate}
                  placeholderTextColor="#8E8E8E"
                  placeholder="RR"
                  style={{
                    height: hp(7.1),
                    fontSize: hp(2),
                    backgroundColor: '#F2F2F2E5',
                    marginTop: hp(1),
                    borderRadius: wp(1.2),
                    borderColor: 'gray',
                    borderWidth: 0.5,
                  }}
                />
              </View>
              <View style={{width: wp(45)}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  Random Blood Sugar (RBS)
                  <Text style={{color: 'black'}}> mg/dL</Text>
                </Text>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={e => setSuger3(e)}
                  value={suger3}
                  placeholderTextColor="#8E8E8E"
                  placeholder="Random Blood Sugar"
                  style={{
                    height: hp(7.1),
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
              <View style={{width: wp(45)}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  Fasting Blood Sugar (FBS) mg/dL
                </Text>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={e => setSuger1(e)}
                  value={suger1}
                  placeholderTextColor="#8E8E8E"
                  placeholder="Fasting Blood Sugar(FBS)"
                  style={{
                    height: hp(7.1),
                    fontSize: hp(2),
                    backgroundColor: '#F2F2F2E5',
                    marginTop: hp(1),
                    borderRadius: wp(1.2),
                    borderColor: 'gray',
                    borderWidth: 0.5,
                  }}
                />
              </View>
              <View style={{width: wp(45)}}>
                <Text
                  style={{
                    fontSize: hp(1.8),
                    fontFamily: mainFontBold,
                    color: 'black',
                  }}>
                  Postprandial Blood Sugar (PPBS)
                  <Text style={{color: 'black'}}> mg/dL</Text>
                </Text>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={e => setSuger2(e)}
                  value={suger2}
                  placeholderTextColor="#8E8E8E"
                  placeholder="Postprandial (PPBS)"
                  style={{
                    height: hp(7.1),
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
              }}></View>
            {/* new added component */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(1),
                justifyContent: 'space-between',
              }}>


<View style={{width: wp(45)}}>
  <Text style={{fontSize: hp(1.8), fontFamily: mainFontBold, color: 'black'}}>Height</Text>
  {heightUnits === 'ft' ? (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TextInput
        keyboardType="numeric"
        value={feet}
        onChangeText={text => setFeet(text)}
        placeholderTextColor="#8E8E8E"
        placeholder="Feet"
        style={textInputStyle}
      />
      {/* <Text style={{width: wp(2)}}>'</Text> */}
      <TextInput
        keyboardType="numeric"
        value={inches}
        onChangeText={text => setInches(text)}
        placeholderTextColor="#8E8E8E"
        placeholder="Inches"
        style={[textInputStyle,{width: wp(20),marginLeft:2}]}
      />
    </View>
  ) : (
    <TextInput
      keyboardType="numeric"
      value={centimeters}
      onChangeText={text => setCentimeters(text)}
      placeholderTextColor="#8E8E8E"
      placeholder="Centimeters"
      style={textInputStyle}
    />
  )}
  <Dropdown
    style={[styles.uint, isGenderFocused && {borderWidth: 0.5}]}
    placeholderStyle={styles.placeholderStyle}
    selectedTextStyle={styles.selectedTextStyle}
    inputSearchStyle={styles.inputSearchStyle}
    iconStyle={styles.iconStyle}
    data={Unit}
    maxHeight={300}
    labelField="label"
    valueField="value"
    placeholder="unit"
    value={heightUnits}
    onFocus={() => setIsGenderFocused(true)}
    onBlur={() => setIsGenderFocused(false)}
    onChange={item => {
      setHeightUnit(item.value);
      setIsGenderFocused(false);
    }}
  />
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
                    height: hp(7.1),
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
                    height: hp(7.1),
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
          </>
        )}
      </ScrollView>
      <View
        style={{
          width: width,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: wp(2),
        }}>
        {page == 1 ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: wp(45),
              height: hp(5),
              backgroundColor: '#000',
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
        ) : (
          <TouchableOpacity
            onPress={() => setPage(1)}
            style={{
              width: wp(45),
              height: hp(5),
              backgroundColor: '#000',
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
              Go back
            </Text>
          </TouchableOpacity>
        )}
        {page == 1 ? (
          <TouchableOpacity
            onPress={() => setPage(2)}
            style={{
              width: wp(45),
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
              Next
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setMeetingConfirmation(true)}
            style={{
              width: wp(45),
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
              Proceed
            </Text>
          </TouchableOpacity>
        )}
      </View>

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
              setDateTime(day.dateString);
              setDateModal(false);
            }}
            minDate={`${new Date()}`}
          />
          {/* <Calendar
            onDayPress={day => {
              // Format the date string to dd-mm-yyyy
              const formattedDate = moment(day.dateString).format('DD-MM-YYYY');
              setDateTime(formattedDate);
              setDateModal(false);
            }}
            minDate={moment().format('YYYY-MM-DD')} // Ensure minDate is in 'yyyy-mm-dd' format
          /> */}
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
            height: hp(85),
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
                fontSize: hp(1.9),
                textTransform: 'capitalize',
              }}>
              CONSENT FORM FOR TELECOMMUNICATION{' '}
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={{
              marginTop: 15,
              width: wp(75),
              alignSelf: 'center',
              paddingBottom: 25,
            }}
            showsVerticalScrollIndicator={false}>
            <Text style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
              1. Fever99 is offering telemedicine or video consultation where
              patients are not being able to reach the hospital. A video or
              telemedicine consultation can never be compared to a normal
              in-hospital consultation where the doctor is able to physically
              examine the patient.
            </Text>
            <Text style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
              2. You are advised to come to the hospital for consults whenever
              you are in a position for the same. If the consultation cannot
              wait, then only you should opt for a telemedicine or video
              consultation.{' '}
            </Text>
            <Text style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
              3. You are advised to confirm the diagnosis, treatment and
              prescription whenever you are able to come to the hospital for a
              physical consult. In case your symptoms/condition does not
              improve, immediately reach the nearest hospital.
            </Text>
            <Text style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
              4. ⁠By accepting telemedicine consultation , you agree and accept
              that the tele-consultants/doctors and all personnel directly or
              indirectly involved with any part of the Telemedicine set up shall
              not be held responsible in the unlikely event of an error in
              diagnosis or management due to the occurrence of sub optimal
              technical conditions. While every attempt will be made to ensure
              ideal conditions, unforeseen situations may occur.
            </Text>
            <Text style={{color: 'black', fontSize: hp(1.8), marginBottom: 10}}>
              5. Fever99 and/or its doctors shall not be responsible for
              complete accuracy of telemedicine consultation, limited in its
              scope as it is, with no physical examination of the patient being
              possible. While every attempt will be made to ensure
              comprehensiveness of the consultation, unforeseen situations may
              arise. Your accepting telemedicine consultation will be taken as
              your consent for a telemedicine consult with its ingrained
              limitations.
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(2),
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                onPress={() => handleCreateBooking()}
                style={{
                  width: wp(25),
                  height: hp(5),
                  backgroundColor: '#50B148',
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: wp(5),
                }}>
                <Text style={{fontSize: hp(1.8), color: 'white'}}>I Agree</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  dropdown: {
    height: hp(6.6),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: wp(1.2),
    paddingHorizontal: 8,
    marginTop: hp(1),
    width: wp(45),
    fontSize: hp(2),
    backgroundColor: '#F2F2F2E5',
  },
  uint: {
    height: hp(7.1),
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
    color: 'gray',
    fontSize: hp(2),
  },
  selectedTextStyle: {
    fontSize: hp(2),
    color: '#8E8E8E',
  },
  dropdown1: {
    height: hp(6.6),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: wp(1.2),
    paddingHorizontal: 8,
    width: wp(45),
    backgroundColor: '#F2F2F2E5',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: hp(2),
    color: '#8E8E8E',
  },
});

export default BookVideo;
