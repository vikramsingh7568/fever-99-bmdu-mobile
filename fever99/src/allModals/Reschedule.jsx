import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Dropdown } from 'react-native-element-dropdown';
import axios from '../Services/axios.service';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CloseBtnIcon from 'react-native-vector-icons/Entypo';

const mainFont = 'Montserrat-Regular';
const url = 'https://api.fever99.com/api/';

const Reschedule = ({ cartID, closeModal, drrIdes, modeOf }) => {
  const [dateTime, setDatetime] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState('');
  const [timeSlotss, setTimeSlot] = useState([]);


  const openCalendar = () => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setDatetime(formattedDate);
    setShowCalendar(!showCalendar);
  };

  const offModal = () => {
    setTimeSlot([]);
    closeModal();
  };

  const handleDateChange = async (selectedDate) => {
    try {
      setTimeSlot([]);
      const response = await fetch(`${url}time-slot/${drrIdes}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateTime: selectedDate }),
      });
      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Unexpected response type: ${contentType}`);
      }
      const responseData = await response.json();
      console.log("Response:", responseData);
      const timeSlotsArray = responseData[modeOf === "Video" ? "extractedOnlineTimes" : "extractedOfflineTimes"].map(time => ({
        label: time,
        value: time
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


  const handleSubmit = async () => {
    if (!dateTime || !selectedTimeSlot) {
      setErrors('Both fields are required');
      return;
    }
    const requestData = { dateTime: dateTime, selectedTimeSlot: selectedTimeSlot, };
    try {
      const response = await axios.put(`${url}appointment/reschedule/${cartID}`, requestData,);
      if (response.status == 200) {
        setIsLoading(false);
        closeModal();
        reRenderFun();
      }
      if(response.data.status===false){
        setErrors(response.message);
      }
      
    } catch (error) {
      if (error.response) {
        console.error('API Error:', error.response);
        setErrors(error.response.data.message);
      } else if (error.request) {
        setErrors('No response received from the server.');
      } else {
        setErrors('Error in setting up the request.');
      }
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.modalContent}>
        <View style={styles.d_Flex}>
          <Text style={styles.modalTitle}>Reschedule</Text>
          <TouchableOpacity onPress={offModal} style={{ paddingLeft: wp(7) }}>
            <CloseBtnIcon name="cross" style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <View style={{ width: wp(95), marginTop: 0 }}>
          {errors ? <Text style={{ color: 'red', fontSize: hp(1.8) }}>{errors}</Text> : null}
        </View>
        <View style={styles.formContainer}>
          <TouchableOpacity onPress={openCalendar}>
            <Text style={styles.label}>Select Date:</Text>
            <TextInput
              value={dateTime ? dateTime.toString() : ''}
              editable={false}
              placeholder="DD-MM-YYYY"
              placeholderTextColor={'gray'}
              style={[styles.inputField, !dateTime && styles.errorBorder]}
            />
          </TouchableOpacity>
          {showCalendar && (
            <Calendar
              onDayPress={day => {
                const selectedDay = day.dateString;
                const [year, month, date] = selectedDay.split('-');
                const formattedDate = `${date}-${month}-${year}`;
                setDatetime(formattedDate);
                setShowCalendar(false);
              }}
              minDate={new Date()}
            />
          )}
          {!showCalendar && (
            <>
              <View style={styles.dropdownContainer}>
                <Text
                  style={styles.label}
                  onPress={() => generateRandomTimeSlots()}>
                  Select Slot:
                </Text>
                <Dropdown
                  style={[
                    styles.inputField,
                    isFocus && { borderWidth: 0.5 },
                    !selectedTimeSlot && styles.errorBorder,
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
                  {isLoading ? 'Submitting...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default Reschedule;

const styles = StyleSheet.create({
  errorBorder: {
    borderColor: '#b48e8e',
  }, // border color red
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: hp(1),
    width: wp(100),
    alignItems: 'center',
  },
  d_Flex: {
    width: wp(95),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: hp(3),
    fontFamily: mainFont,
    fontWeight: 'bold',
    color: 'black',
  },
  closeIcon: {
    fontSize: hp(5),
    padding: 3,
    backgroundColor: '#dfeefc',
    color: '#1263AC',
    borderRadius: wp(40),
  },
  label: {
    fontSize: hp(1.9),
    fontFamily: mainFont,
    color: 'black',
    marginTop: hp(1),
  },
  inputField: {
    height: hp(6),
    width: wp(95),
    fontSize: hp(2),
    backgroundColor: '#F2F2F2E5',
    marginTop: hp(0.5),
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 0.7,
    paddingLeft: wp(2),
  },
  dropdownContainer: {
    width: wp(95),
    marginTop: hp(1),
  },
  placeholderStyle: {
    fontSize: hp(2),
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: hp(2),
    color: '#8E8E8E',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: hp(2),
    color: '#8E8E8E',
  },
  iconStyle: {
    fontSize: hp(2),
  },
  submitButton: {
    width: wp(95),
    height: hp(7),
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
});
