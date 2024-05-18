import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  Alert,
} from 'react-native';
import axios from '../Services/axios.service';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Calendar } from 'react-native-calendars';
import { Dropdown } from 'react-native-element-dropdown';
import RemoveIcon from 'react-native-vector-icons/MaterialIcons';
import Close_Icons from 'react-native-vector-icons/AntDesign';

const mainFont = 'Montserrat-Regular';
const mainColor = '#1263AC';
const mainFontBold = 'Montserrat-Bold';
const mainFontMedium = 'Montserrat-Medium';

const CompleteFollowupModal = ({ cartID, closeModal, drrIdes, modeOf }) => {
  const url = 'https://api.fever99.com/api/';
  const [soInputField, setSoInputField] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [timeSlotss, setTimeSlot] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDateEmpty, setIsDateEmpty] = useState(false);
  const [isSlotEmpty, setIsSlotEmpty] = useState(false);
  const [errorss, setSoerrorss] = useState('');

  const offModal = () => {
    closeModal();
  };

  const fetchTimeSlot = async () => {
    const response = await axios.get(`${url}time-slot/${drrIdes}`);
    if (modeOf == 'Video') {
      setTimeSlot(response.data.data.extractedOnlineTimes);
    } else {
      setTimeSlot(response.data.data.extractedOfflineTime);
    }
  };

  useEffect(() => {
    fetchTimeSlot();
  }, [drrIdes]);

  const openCalendar = () => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    setSelectedDate(formattedDate);
    setShowCalendar(!showCalendar);
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedTimeSlot) {
      setSoerrorss('Please fill all the fields');
      return;
    }
    if (!selectedDate) {
      setIsDateEmpty(true);
    }
    if (!selectedTimeSlot) {
      setIsSlotEmpty(true);
    }
    Alert.alert('Submitted');
  };

  const completedStatus = async () => {
    try {
      const response = await axios.put(`${url}appointments/${cartID}`, {
        status: 'completed',
      });
      console.log(response);
      if (response.status === 200) {
        offModal();
      } else {
        
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFinalSubmit = () => {
    Alert.alert(
      'Completed!',
      'Appointment completed successfully.',
      [
        {
          text: 'Completed',
          onPress: () => completedStatus(),
          // style: 'default', // or 'cancel' for iOS
          color: 'blue', // text color
          backgroundColor: 'lightblue' // background color
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
      ],
      { cancelable: false }
    );

  };

  return (
    <View style={styles.mainView}>
      {soInputField ? null : (
        <View
          style={{
            width: wp(100),
            maxWidth: 700,
            alignItems: 'flex-end',
            backgroundColor: '#fff',
            paddingHorizontal: hp(1),
            paddingVertical: hp(0.5),
            backgroundColor: '#a3b9cd',
          }}>
          <TouchableOpacity onPress={() => closeModal()}>
            <Close_Icons name="closecircleo" style={[styles.minusIcons]} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.subView}>
        {!soInputField ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity
              style={[styles.bothButton, { borderColor: mainColor }]}
              onPress={() => setSoInputField(true)}>
              <Text
                style={{
                  color: mainColor,
                  fontFamily: mainFont,
                  fontSize: hp(2),
                }}>
                Follow Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleFinalSubmit()}
              style={[styles.bothButton, { backgroundColor: mainColor }]}>
              <Text
                style={{ color: 'white', fontFamily: mainFont, fontSize: hp(2) }}>
                Completed
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.d_flex}>
              <Text style={styles.follupText}>Follow Up</Text>
              <TouchableOpacity onPress={() => setSoInputField(false)}>
                <RemoveIcon name="remove" style={styles.minusIcons} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: 'red', fontFamily: mainFont }}>{errorss}</Text>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={openCalendar}>
                <Text style={styles.label}>Select Date:</Text>
                <TextInput
                  value={selectedDate ? selectedDate.toString() : ''}
                  editable={false}
                  placeholder="DD-MM-YYYY"
                  placeholderTextColor={'gray'}
                  style={[
                    styles.inputField,
                    !selectedDate && isDateEmpty && styles.errorBorder,
                  ]}
                />
              </TouchableOpacity>
              <View style={{ width: wp(100), maxWidth: 700 }}>
                {showCalendar && (
                  <Calendar
                    onDayPress={day => {
                      const selectedDay = day.dateString;
                      const [year, month, date] = selectedDay.split('-');
                      const formattedDate = `${date}-${month}-${year}`;
                      setSelectedDate(formattedDate);
                      setShowCalendar(false);
                    }}
                    minDate={new Date()}
                  />
                )}
              </View>

              {showCalendar ? null : (
                <>
                  <View style={styles.dropdownContainer}>
                    <Dropdown
                      style={[
                        styles.inputField,
                        isFocus && { borderWidth: 0.5 },
                        !selectedTimeSlot && isSlotEmpty && styles.errorBorder,
                      ]}
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
                      onChange={item => {
                        setSelectedTimeSlot(item.value);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={isLoading}>
                    <Text style={styles.submitButtonText}>
                      {isLoading ? 'Updating...' : 'Update'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default CompleteFollowupModal;

const styles = StyleSheet.create({
  mainView: {
    alignItems: 'center',
  },
  subView: {
    backgroundColor: '#fff',
    width: wp(100),
    maxWidth: 700,
    paddingHorizontal: wp(4),
    paddingBottom: wp(4),
    paddingTop: wp(2),
  },
  d_flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorBorder: {
    borderColor: 'red',
  },
  minusIcons: {
    fontSize: hp(4),
    backgroundColor: 'red',
    color: '#fff',
    borderRadius: wp(50),
  },
  follupText: {
    fontSize: hp(2),
    fontFamily: mainFontBold,
  },
  bothButton: {
    height: hp(5),
    width: wp(35),
    alignSelf: 'center',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.8,
  },
  inputField: {
    height: hp(6),
    width: wp(90),
    maxWidth: 650,
    backgroundColor: '#F2F2F2E5',
    marginTop: hp(0.5),
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 0.7,
    paddingLeft: wp(2),
  },
  dropdownContainer: {
    marginTop: hp(1),
  },
  label: {
    fontSize: hp(1.8),
    fontFamily: mainFont,
    color: 'black',
    marginTop: hp(1),
  },
  submitButton: {
    width: wp(90),
    height: hp(7),
    maxWidth: 650,
    backgroundColor: '#1263AC',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(2),
  },
  submitButtonText: {
    color: 'white',
    fontSize: hp(2),
    fontFamily: mainFont,
  },
  placeholderStyle: {
    fontSize: 14,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#8E8E8E',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#8E8E8E',
  },
});
