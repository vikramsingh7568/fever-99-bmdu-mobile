import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getNotifications, getUser, isReadNotification } from '../Services/user.service';
import Icon from 'react-native-vector-icons/Feather';
import Headerr from './Headerr';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';


import { useNavigation } from '@react-navigation/native';


import moment from 'moment';

const NotificationShow = () => {
  const focused = useIsFocused();



  const navigation = useNavigation()


  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userObj, setUserObj] = useState('');
  const [trackIndex,setTrackIndex] = useState(0);

  const handleGetAndSetUser = async () => {
    let userData = await getUser();
    if (userData) {
      setUserObj(userData?._id);
      getAllNotifications();
    }
  };

  const markAsRead = async (id) => {
    try {
      const { data: res } = await isReadNotification(id);
      console.log('response for mark as read',res)
      getAllNotifications();
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAllNotifications = async () => {
    try {
      const { data: res } = await getNotifications();

      if (res.status === true) {
        setNotifications(res.data); // This will execute after handleGetAndSetUser()
        // markAsRead();
      } else {
        throw new Error(res.error);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAndSetUser();
  }, [focused]);

  const preProcessData = (data) => {
    return data.map((item, index) => {
      const showRelativeTime = index === 0 || data[index - 1].timestamp !== item.timestamp;
      return { ...item, showRelativeTime };
    });
  };


  const renderItem = ({ items, index }) => {
    let iconName;
    let iconColor;

    // Set icon based on notification type
    switch (items.title) {
      case 'Appointment rescheduled':
        iconName = 'clock';
        iconColor = '#d0bb76'; // Example color, adjust as needed
        break;
      case 'Appointment Scheduled':
        iconName = 'calendar';
        iconColor = 'green'; // Example color, adjust as needed
        break;
      case 'Appointment Created':
        iconName = 'plus-circle';
        iconColor = 'green'; // Example color, adjust as needed
        break;
      case 'Appointment cancelled':
        iconName = 'alert-circle';
        iconColor = 'orange'; // Example color, adjust as needed
        break;
      case 'Appointment Rejected':
        iconName = 'x-circle';
        iconColor = 'red'; // Example color, adjust as needed
        break;
      case 'Income Notification':
        iconName = 'trending-up';
        iconColor = '#5566e1'; // Example color, adjust as needed
        break;
      default:
        iconName = 'bell';
        iconColor = 'black'; // Default color
        break;
    }
    
    return (
      <TouchableOpacity
      onPress={()=>{
        markAsRead(items._id)
        setTrackIndex(index)
        navigation.navigate('appointments')
      }}
        key={index}
        style={[styles.notificationItem, { backgroundColor: items.read ? '#FFF' : index === trackIndex ? '#fff' : '#dadde0' }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between',   }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: iconColor,
                height: 40,
                width: 40,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name={iconName} size={23} color={"#fff"} />
            </View>
           
            <View
              style={{
                marginLeft: 10,
                width: '86%'
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>

                <Text style={styles.title}>{items.title}</Text>
                <Text style={styles.timestamp}>{moment(items.timestamp).format('DD-MM-YYYY hh:mm a')}</Text>
              </View>
              <Text style={styles.message}>{items.message}</Text>
            </View>
          </View>

        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Headerr secndheader={true} label='Notification' />
      {
        loading ?
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
          :
          <FlatList
            data={notifications}
            ListEmptyComponent={
              <View style={styles.loadingContainer}>
                <Text style={{ fontSize: hp(2) }}>Oops! No Notifications Found</Text>
              </View>
            }
            renderItem={({ item, index }) => {
              return (
                <View>
                  <Text style={styles.dateH1}>{item.date}</Text>
                  {item.notifications.map((items, index) => (
                    renderItem({ items, index })
                  ))}
                </View>
              );
            }}
          />
      }
    </View>
  );
};


const styles = StyleSheet.create({
  notificationItem: {
    padding: 10,
    marginTop: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  title: {
    fontWeight: 'bold',
    fontSize: hp(1.8),
    marginBottom: 5,
  },
  message: {
    marginBottom: 3,
    fontSize: hp(1.5),
    textAlign: "justify",
    paddingRight: 12
  },
  timestamp: {
    fontSize: hp(1.3),
    color: 'black',
  },
  loadingContainer: {
    height: hp(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateH1: {
    fontSize: hp(2.5),
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10

  }
});

export default NotificationShow;
