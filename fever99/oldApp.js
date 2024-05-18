
// import messaging from '@react-native-firebase/messaging';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import { NavigationContainer, useLinkTo } from '@react-navigation/native';
import React, { createContext, useEffect, useState } from 'react';
import { Linking,PermissionsAndroid, Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import PushNotification from 'react-native-push-notification';
import Toast from 'react-native-toast-message';
// import { navigationRef } from './index';
import {navigationRef,gotoInitialRoute} from './NavigationService';


import Root from './src/Navigation/Root';
export const LanguageContext = createContext<any>(null);
export const LoginContext = createContext<any>(null);
export const UserDataContext = createContext<any>(null);
export const AuthContext = createContext<any>(false)

import { LogBox } from 'react-native';
import UpdateModal from './updateModal';
import { AppVersioinCheck, deleteJwt, getJwt, getUser, isUserLoggedIn } from './src/Services/user.service';
import { toastError } from './src/utils/toast.utils';
import DeviceInfo from 'react-native-device-info';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

  import InCallManager from 'react-native-incall-manager';

  import io from 'socket.io-client';

import notifee, {
  EventType, 
  AndroidImportance,
  AuthorizationStatus,
  AndroidColor,
  AndroidCategory,
  AndroidStyle,
 } from '@notifee/react-native';


 //calling icons
import acceptCall from './callingIcons/incoming.png';
import rejectCall from './callingIcons/missed-call.png';
import { addAppointmentHistory } from './src/Services/appointmentHistory.service';
import { fileurl } from './src/Services/url.service';


// import ringtone from './callingIcons/ringtone.mp3'

///android/app/src/main/res/raw/hollow.mp3
//if you want to change ringtone then go to this directory in root android folder

function App(): JSX.Element {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const linkTo = useLinkTo()

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
    };
    getUrlAsync();
  }, []);


  const handleLogout = async () => {
    try {
      if(isAuthorized){
      await deleteJwt();
      setIsAuthorized(false);
    }
    } catch (err) {
      // toastError(err);
    }
  };


  useEffect(() => {
    appVersioinCheckInApp();
    CheckIsUserLoggedIn();
  },[])


  const CheckIsUserLoggedIn = async () => {
    try {
      let token = await getJwt();
      if(token){
      const {data: res}: any = await isUserLoggedIn();
      if (res.status == false) {
        handleLogout()
        console.log('response from backend',res)
        // throw new Error(res.error);
      }
    }
    } catch (err) {
      // toastError(err);
    }
  };



  //getting this device id 
  const [deviceVersion, setDeviceVersion] = useState(0);
  const [backendVeriosn,setBackendVersion] = useState(0)
  useEffect(() => {
    const fetchDeviceVersion = async () => {
      let  version =  DeviceInfo.getBuildNumber();
      // console.log('this is deviceverions',version)
      setDeviceVersion(parseInt(version));
    };

    fetchDeviceVersion();
  }, []);

  
  const appVersioinCheckInApp = async () => {
    try {
      const { data: res } = await AppVersioinCheck();
      if (res.data && res.data.length > 0 && res.data[0].versionCode) {
        // console.log('App Version Check in App', res.data[0].version);
        setBackendVersion(parseInt(res.data[0].version));
      } else {
        // If version code is not present in the response
        toastError("Version code not found in response.");
      }
    } catch (err) {
      // toastError(err);
    }    
  };


  useEffect(() => {
    // requestPermissions();
  }, []);


  RNCallKeep.addEventListener('answerCall', async ({ callUUID }) => {
    Linking.openURL(`fever99://app/Meeting/${callUUID}`)
    // console.log('incoming call in rnclall keep 127 line ',callUUID)
    RNCallKeep.rejectCall(callUUID)
    // navigationRef.current?.navigate(`Meeting`, { data: callUUID })
    // linkTo()
  });
  RNCallKeep.addEventListener('didReceiveStartCallAction', async ({ callUUID }) => {
    Linking.openURL(`fever99://app/Meeting/${callUUID}`)
    // console.log('incoming call in rnclall keep 133 line ',callUUID)
    if (callUUID) {
      RNCallKeep.rejectCall(callUUID)
    }
    // navigationRef.current?.navigate(`Meeting`, { data: callUUID })
    // linkTo()
  });


 
  //rn

// Handle incoming call event
const handleIncomingCall = async (callUUID) => {
    // Open the meeting URL
    Linking.openURL(`fever99://app/Meeting/${callUUID}`);
    // console.log('Incoming call in incallmanager: ', callUUID);
    // Reject the call
    InCallManager.stopRingtone(); // Stop ringing
    InCallManager.start({ media: 'audio' }); // Start the call
};

  //rn

  const [language, setLanguage] = useState('EN')
  const [user, setUser] = useState('')
  const [userData, setUserData] = useState('')

  // const notifyChannel = () => {
  //   console.log('message background')
  //   PushNotification.createChannel(
  //     {
  //       channelId: 'fever99', // (required)
  //       channelName: 'General', // (required)
  //       channelDescription: 'General Channel', // (optional) default: undefined.
  //       playSound: true, // (optional) default: true
  //       soundName: 'my_sound.mp3', // (optional) See `soundName` parameter of `localNotification` function
  //       importance: 4, // (optional) default: 4. Int value of the Android notification importance
  //       vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  //     },
  //     created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  //   );
  // };


  RNCallKeep.addEventListener('didReceiveStartCallAction', ({ handle, callUUID, name }) => {
    console.log(handle, callUUID, name, "handle, callUUID, name")
    // console.log('incoming call in rnclall keep 164 line ',callUUID)
  });

  RNCallKeep.addEventListener('didDisplayIncomingCall', ({ error, callUUID, handle, localizedCallerName, hasVideo, fromPushKit, payload }) => {
    // you might want to do following things when receiving this event:
    console.log('incoming call in rnclall keep 169 line ',callUUID)
    console.log(error, callUUID, handle, localizedCallerName, hasVideo, fromPushKit, payload, " error, callUUID, handle, localizedCallerName, hasVideo, fromPushKit, payload")
    // - Start playing ringback if it is an outgoing call
  });



  RNCallKeep.canMakeMultipleCalls(false);

  const [calluuid,setcalluuid] = useState(0)

//one

  // useEffect(() => {
  //   // console.log('comin inside useeffect in app.js file')
  //   // notifyChannel();
  //   // Geocoder.init("AIzaSyCtkZzuFSZ94CSPnDArwvPMqxkk58Fzfno")

  //   const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
  //        console.log('inside unsbscribe noticicoan line 248')
  //     // const handleGetAndSetUser = async () => {
  //       let userData = await getUser();
  //       // let socket: any;
  //       // socket = io(fileurl);
  //       // console.log('this is hanle get data',userData._id);
  //       // if (userData) {
  //       //   socket?.emit('join', userData?._id);
  //       //   setUserObj(userData);
  //       // }
  //     // };
  //     // handleGetAndSetUser();

  //     if (remoteMessage?.data?.otherData == "show") {
  //       // let temp = await RNCallKeep.backToForeground();
  //       // console.log(temp, "temp")
  //       console.log('incoming call',remoteMessage);
  //       RNCallKeep.displayIncomingCall(remoteMessage?.data?.appointmentId, "Doctor", "Fever99");
  //       // showIncomingCallNotification(remoteMessage);
  //       DisplayNotification();
       
  //       setcalluuid(remoteMessage?.data?.appointmentId);
  //     }     
  //     else if(remoteMessage?.data?.title ===  "New Message!" && userData?._id == remoteMessage.data.toId){
  //       console.log('id',userData?._id, remoteMessage.data.toId)
  //       console.log('remote data is here',remoteMessage?.data)
  //         setAppointmentId(remoteMessage.data.appointmentId)
  //         setToUserId(remoteMessage.data.fromId)

  //     // console.log('remote message new chat line 227',remoteMessage, "remoteMessage")

  //     const channelId = await  notifee.createChannel({
  //       id: "Chat",
  //       name: "Chatting",
  //       importance: AndroidImportance.HIGH,
  //     });

  //     await notifee.displayNotification({
  //       title:`You have a new message from ${remoteMessage.data.fromName}`,
  //       body: remoteMessage.data.description,
  //       android: {
  //         channelId ,
  //         actions: [
  //           {
  //             title: 'Reply',
  //             icon: 'https://my-cdn.com/icons/reply.png',
  //             pressAction: {
  //               id: 'reply',
  //             },
  //             input: true, // enable free text input
  //           },
  //         ],
  //       },
  //     });
  //   }
  //     else if(remoteMessage?.data?.title !== "New Message!"){
  //     PushNotification.localNotification({
  //       /* Android Only Properties */
  //       channelId: 'fever99', // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
  //       ticker: 'My Notification Ticker', // (optional)
  //       showWhen: true, // (optional) default: true
  //       autoCancel: true, // (optional) default: true
  //       largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
  //       // largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
  //       smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
  //       // bigText: `${remoteMessage.data.title}`, // (optional) default: "message" prop
  //       bigLargeIcon: 'ic_launcher', // (optional) default: undefined
  //       // bigLargeIconUrl: "https://www.example.tld/bigicon.jpg", // (optional) default: undefined
  //       // color: "blue", // (optional) default: system default
  //       vibrate: true, // (optional) default: true
  //       vibration: 2000, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  //       tag: 'some_tag', // (optional) add tag to message
  //       group: 'group', // (optional) add group to message
  //       groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
  //       ongoing: false, // (optional) set whether this is an "ongoing" notification
  //       priority: 'high', // (optional) set notification priority, default: high
  //       visibility: 'private', // (optional) set notification visibility, default: private
  //       ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
  //       shortcutId: 'shortcut-id', // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
  //       onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false

  //       when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
  //       usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
  //       timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

  //       messageId: 'google:message_id', // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.

  //       // actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
  //       invokeApp: false, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
  //       /* iOS only properties */
  //       category: '', // (optional) default: empty string

  //       /* iOS and Android properties */
  //       id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
  //       title: `${remoteMessage?.data?.title}`, // (optional)
  //       // title:'vikram',
  //       // message : 'vikram',
  //       message: `${remoteMessage?.data?.description}`, // (required)
  //       userInfo: `${remoteMessage.data.redirectTo}`, // (optional) default: {} (using null throws a JSON value '<null>' error)
  //       playSound: true, // (optional) default: true
  //       soundName: 'my_sound.mp3', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
  //       number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  //       // repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
  //     });
  //   }
  //   });
  //   return unsubscribe;
  // }, []);

  // useEffect(() => {
  //   const handleForegroundEvent = async ({ type, detail }) => {
  //     if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'reply') {
  //       console.log('Reply pressed',detail);
  //       await handleSendReplayFromNotification(detail.input);
  //       await notifee.cancelNotification(detail.notification.id);
  //     }
  
  //     if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'accept') {
  //       console.log('User pressed an action with the id: ', detail.pressAction.id);
  //       handleIncomingCall(calluuid);
  //     }
  
  //     if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'reject') {
  //       console.log('User pressed an action with the id: ', detail.pressAction.id);
  //       await notifee.cancelNotification('incoming-call-notification');
  //       InCallManager.stopRingtone(); // Stop ringing
  //     }
  
  //     if (type === EventType.DISMISSED) {
  //       console.log('User dismissed notification', detail.notification);
  //       await notifee.cancelNotification('incoming-call-notification');
  //       InCallManager.stopRingtone(); // Stop ringing
  //     }
  //   };
  
  //   const unsubscribe = notifee.onForegroundEvent(handleForegroundEvent);
  
  //   // Cleanup on unmount
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);
  
  
  
  // useEffect(()=>{
  //   const permission = async () =>{
  //   await notifee.requestPermission();
  //   }
  //   permission();
  // })
  
  
  // const handleSendReplayFromNotification = async (userMessage: any) => {
  
  //   let userData = await getUser();
  
  //   console.log('getting user details',userMessage)
  //   console.log('socket data',{
  //     toUserId: toUserId,
  //     message: userMessage,
  //     userId: userData._id,
  //     appointmentId:appointmentId
  //   })
  
  //  if (!appointmentId) return;
  //  let socket: any;
  //  socket = io(fileurl);
  // socket?.emit('message', {
  //         toUserId: toUserId,
  //         message: userMessage,
  //         userId: userObj._id,
  //         type: 'text',
  //       });
  //       socket.close();
  
  
  //   await addAppointmentHistory(appointmentId, {
  //               message: userMessage,
  //               toId: toUserId,
  //               type: 'text',
  //             });
  //             return
  // }

//one

//two

  useEffect(() => {
    const handleForegroundEvent = async ({ type, detail }) => {
      console.log('detials ',detail.notification.data)
    let  data = detail

      // # Extract values
    let  appointment_id = data["notification"]["data"]["appointmentId"]
     let    from_id = data["notification"]["data"]["fromId"]
      
      console.log("Appointment ID:", appointment_id)
      console.log("From ID:", from_id)
      
      if (type === EventType.ACTION_PRESS) {
        if (detail.pressAction.id === 'reply') {
          // const { appointmentId, fromId } = detail.notification.android?.data || {};
          console.log('Reply pressed', detail);
          await handleSendReplayFromNotification(detail.input,appointment_id, from_id);
          await notifee.cancelNotification(detail.notification.id);
        } else if (detail.pressAction.id === 'accept') {
          console.log('User pressed an action with the id: ', detail.pressAction.id);
          handleIncomingCall(calluuid);
        } else if (detail.pressAction.id === 'reject') {
          console.log('User pressed an action with the id: ', detail.pressAction.id);
          await notifee.cancelNotification('incoming-call-notification');
          InCallManager.stopRingtone(); // Stop ringing
        }
      } else if (type === EventType.DISMISSED) {
        console.log('User dismissed notification', detail.notification);
        await notifee.cancelNotification('incoming-call-notification');
        InCallManager.stopRingtone(); // Stop ringing
      }
    };

    const unsubscribeForeground = notifee.onForegroundEvent(handleForegroundEvent);

    const unsubscribeMessaging = messaging().onMessage(async (remoteMessage) => {
      let userData = await getUser();

      if (remoteMessage?.data?.otherData === "show") {
        console.log('incoming call', remoteMessage);
        RNCallKeep.displayIncomingCall(remoteMessage?.data?.appointmentId, "Doctor", "Fever99");
        DisplayNotification();
        setcalluuid(remoteMessage?.data?.appointmentId);
      } else if (remoteMessage?.data?.title === "New Message!" && userData?._id === remoteMessage.data.toId) {
        console.log('id', userData?._id, remoteMessage.data.toId);
        console.log('remote data is here', remoteMessage?.data);
        setAppointmentId(remoteMessage.data.appointmentId);
        setToUserId(remoteMessage.data.fromId);

        const channelId = await notifee.createChannel({
          id: "Chat",
          name: "Chatting",
          importance: AndroidImportance.HIGH,
        });

        await notifee.displayNotification({
          title: `You have a new message from ${remoteMessage.data.fromName}`,
          body: `${remoteMessage.data.description}`,
          data: {appointmentId:remoteMessage.data.appointmentId,fromId:remoteMessage.data.fromId},
          android: {
            channelId,
            actions: [
              {
                title: 'Reply',
                icon: 'https://my-cdn.com/icons/reply.png',
                pressAction: {
                  id: 'reply',
                },
                input: true, // enable free text input
              },
            ],
          },
        });
      } else if (remoteMessage?.data?.title !== "New Message!") {
        PushNotification.localNotification({
          channelId: 'fever99',
          ticker: 'My Notification Ticker',
          showWhen: true,
          autoCancel: true,
          largeIcon: 'ic_launcher',
          smallIcon: 'ic_notification',
          vibrate: true,
          vibration: 2000,
          tag: 'some_tag',
          group: 'group',
          groupSummary: false,
          ongoing: false,
          priority: 'high',
          visibility: 'private',
          ignoreInForeground: false,
          shortcutId: 'shortcut-id',
          onlyAlertOnce: false,
          when: null,
          usesChronometer: false,
          timeoutAfter: null,
          messageId: 'google:message_id',
          invokeApp: false,
          title: `${remoteMessage?.data?.title}`,
          message: `${remoteMessage?.data?.description}`,
          userInfo: `${remoteMessage.data.redirectTo}`,
          playSound: true,
          soundName: 'my_sound.mp3',
          number: 10,
        });
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeMessaging();
    };
  }, [calluuid]);

  const handleSendReplayFromNotification = async (userMessage,appointmentId,toUserId) => {
    let userData = await getUser();

    console.log('getting user details', userMessage);
    console.log('socket data', {
      toUserId,
      message: userMessage,
      userId: userData._id,
      appointmentId,
    });

    if (!appointmentId) return;
    let socket = io(fileurl);
    socket.emit('message', {
      toUserId,
      message: userMessage,
      userId: userData._id,
      type: 'text',
    });
    socket.close();

    await addAppointmentHistory(appointmentId, {
      message: userMessage,
      toId: toUserId,
      type: 'text',
    });
  };


//two

  
  const [routeName, setRouteName] = useState<any>();




// Call the function to request phone state permission
// requestPhonePermission();

  useEffect(() => {
    // requestPhonePermission();
  }, []); // Run only once when the component mounts


 


  const setup = async () => {
   const options = {
  ios: {
    appName: 'My app name',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'phone_account_icon',
    additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
    // Required to get audio in background when using Android 11
    foregroundService: {
      channelId: 'com.company.my',
      channelName: 'Foreground service for my app',
      notificationTitle: 'My app is running on background',
      notificationIcon: 'Path to the resource icon of the notification',
    }, 
  }
};

// RNCallKeep.setup(options).then(accepted => {});
    //  RNCallKeep.setAvailable(true); // Only used for Android, see doc above.

     const optionns = {
      alertTitle: 'Default not set',
      alertDescription: 'Please set the default phone account'
    };
    
    RNCallKeep.hasDefaultPhoneAccount(options);
    RNCallKeep.checkPhoneAccountEnabled();
    RNCallKeep.checkPhoneAccountEnabled();
    RNCallKeep.backToForeground();
    // RNCallKeep.registerPhoneAccount(optionns);
  
  }




async function requestContactPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts Permission',
        message: 'This application needs access to your contacts to function properly.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Contacts permission granted');
    } else {
      console.log('Contacts permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}


const askPermission = async () => {
  try {
    const permissions = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      // PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      // PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      // PermissionsAndroid.PERMISSIONS.BIND_TELECOM_CONNECTION_SERVICE,
      // PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE,
    ]);

    // Check if all required permissions are granted
    const allGranted = Object.values(permissions).every(
      result => result === PermissionsAndroid.RESULTS.GRANTED
    );

    if (allGranted) {
      console.log('All permissions granted');
      // Proceed with setup
      // RNCallKeep.setup();
      // RNCallKeep.setAvailable(true); // Only used for Android
    } else {
      console.log('Some permissions were not granted');
      // Handle case where some permissions were not granted
    }
  } catch (err) {
    console.log('Error requesting permissions:', err);
    // Handle permission request error
  }
};



const requestIndividualPermissions = async () => {
  try {
    const readCallLogGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG
    );

    const readPhoneStateGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
    );

    const callPhoneGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE
    );

    // Check if all permissions are granted
    if (
      readCallLogGranted === PermissionsAndroid.RESULTS.GRANTED &&
      readPhoneStateGranted === PermissionsAndroid.RESULTS.GRANTED &&
      callPhoneGranted === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('All permissions granted');
      // Proceed with your logic here
    } else {
      console.log('Some permissions were not granted');
      // Handle case where some permissions were not granted
    }
  } catch (err) {
    console.error('Error requesting permissions:', err);
    // Handle permission request error
  }
};



//--------------------

//sendig replay to user back




//---------

// notifee.onForegroundEvent(async ({ type, detail }) => {
//   //console.log('details is here for all the users for incoming call',detail)
//   // if (type === 'notification_action_press') {
//     // console.log('notification action pressed',EventType.ACTION_PRESS);
//     //this if for chatting in notifee 
//     // if (type === EventType.ACTION_PRESS && pressAction.id === 'reply') {
//     //   updateChatOnServer(notification.data.conversationId, input);
//     // }

//     if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'reply') {
//       console.log('replay pressed')
//       await handleSendReplayFromNotification(detail.input);
//       await notifee.cancelNotification(detail.notification.id);
//     }

//     if (type === EventType.ACTION_PRESS && detail.pressAction.id && 'accept' === detail.pressAction.id) {
//       console.log('User pressed an action with the id: ', detail.pressAction.id);
//       handleIncomingCall(calluuid);
//     }
//     if (type === EventType.ACTION_PRESS && detail.pressAction.id && 'reject' === detail.pressAction.id) {
//       console.log('User pressed an action with the id: ', detail.pressAction.id);
//       await notifee.cancelNotification('incoming-call-notification');
//       InCallManager.stopRingtone(); // Stop ringing
//     }

//     switch (type) {
//       case EventType.DISMISSED:
//         console.log('User dismissed notification', detail.notification);
//         await notifee.cancelNotification('incoming-call-notification');
//         InCallManager.stopRingtone(); // Stop ringing
//         break;
//       // case EventType.PRESS:
//       //   console.log('User pressed notification', detail.notification);
//       //   handleIncomingCall(calluuid);
//       //   // Linking.openURL(`fever99://app/Meeting/${calluuid}`);
//       //   break;      
//     }
// });








async function DisplayNotification(): Promise<void> {
  // Request permission if not already granted
  // await notifee.requestPermission();

  InCallManager.startRingtone('_Default_');
      const channelId = await  notifee.createChannel({
        id: "custom-sound",
        name: "System Sound",
        importance: AndroidImportance.HIGH,
      });

  // Display a notification with two action buttons
  await notifee.displayNotification({
    title: 'You have an incoming call',
    body: 'Someone is calling',
    // body: 'Full-screen notification',
    android: {
    category: AndroidCategory.CALL,
    // Recommended to set importance to high
    importance: AndroidImportance.HIGH,
    fullScreenAction: {
      id: 'default',
    },
      // importance: AndroidImportance.HIGH,
      channelId,
      largeIcon: 'https://as2.ftcdn.net/v2/jpg/04/63/63/59/1000_F_463635935_IweuYhCqZRtHp3SLguQL8svOVroVXvvZ.jpg',
      // style: {
        // type: AndroidStyle.BIGPICTURE,
        // picture: 'https://as2.ftcdn.net/v2/jpg/04/63/63/59/1000_F_463635935_IweuYhCqZRtHp3SLguQL8svOVroVXvvZ.jpg',
      // },
      actions: [
        {
          title: 'Accept',
          // icon: 'https://my-cdn.com/icons/snooze.png',
          // icon : '@drawable/ic_accept',
          pressAction: {
            id: 'accept',
          },
        },
        {
          title: 'Reject',
          // icon: 'https://my-cdn.com/icons/snooze.png',
          pressAction: {
            id: 'reject',
          },
        },
      ],
    },
    ios: {
      foregroundPresentationOptions: {
        badge: true,
        sound: true,
        banner: true,
        list: true,
      },
    } 
  });
}


// useEffect(() => {
//   const unsubscribe = messaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
//     //console.log('remoteMessage', JSON.stringify(remoteMessage));
//     //console.log('getting message from firebase');
//     // DisplayNotification();
//     // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//   });
//   return unsubscribe;
// }, []);




 //background event is here


 //background event is here


async function checkNotificationPermission() {
  const settings = await notifee.getNotificationSettings();

  if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
    console.log('Notification permissions has been authorized');
  } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
    console.log('Notification permissions has been denied');
  }
}


  // Call the function to show incoming call notification when needed
   
  useEffect(()=>{
    // setup()
    // showIncomingCallNotification();
    // requestNotificationPermission();
    // checkNotificationPermission();
  },[])







//------------------

useEffect(()=>{
  // requestContactPermission();
  // askPermission();
  requestIndividualPermissions();
},[])

// Call this function where appropriate in your app





//.......

  // const options = {
  //   ios: {
  //     appName: 'fever99',
  //   },

    
  //   android: {
  //     alertTitle: 'Permission required',
  //     alertDescription: 'This application needs to access your phone accounts',
  //     cancelButton: 'Cancel',
  //     okButton: 'OK',
  //     imageName: "ic_launcher",
  //     additionalPermissions: [
  //       'android.permission.READ_PHONE_STATE',
  //       'android.permission.CALL_PHONE',
  //       'android.permission.RECORD_AUDIO',
  //       'android.permission.MODIFY_AUDIO_SETTINGS',
  //       'android.permission.BIND_TELECOM_CONNECTION_SERVICE',
  //       'android.permission.FOREGROUND_SERVICE',
  //     ],
  //     callKitEnabled: true,
  //     foregroundService: {
  //       channelId: "com.fever99",
  //       channelName: "fever99",
  //       notificationTitle: "Call from background",
  //       notificationIcon: "ic_launcher"
  //     }
  //   }
  // };



//   PushNotification.configure({
//     // (required) Called when a remote or local notification is opened or received
//     onNotification: async function (notification) {
//         console.log("NOTIFICATIONNOTIFICATIONNOTIFICATIONNOTIFICATIONNOTIFICATIONNOTIFICATIONNOTIFICATION:", notification);
//         console.log('notification pressed in app.js file in line no 658');
//         DisplayNotification();
//         // await Linking.openURL("fever99://app/Meeting" + notification.redirectTo)
//         console.log("a1", notification)
//         // await Linking.openURL("fever99://app/Meeting/" + notification.data.id);
//         console.log("a2")


       
          
//         // navigationRef.current.navigate("Meeting", { data: notification.data.id })
//         // Process the notification here
//         // You can add other navigation logic here
//     },
//     // IOS ONLY: (optional) Called when Action is pressed (IOS)
//     onAction: function (notification) {
//         console.log("ACTION:", notification.action);
//         console.log("NOTIFICATION:", notification);

//     },
//     // Should the initial notification be popped automatically
//     // default: true
//     popInitialNotification: true,

//     /**
//      * (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
//      */
//     requestPermissions: true,
// });


  // RNCallKeep.setup(options).then(() => {
  //   console.log('CallKeep setup done');
  // }).catch(error => {
  //   console.error('CallKeep Setup Error:', error);
  // });

//......

  const [showUpdateModal, setShowUpdateModal] = useState(false); // State to control the visibility of UpdateModal


  useEffect(() => {
    // Open UpdateModal after 10 seconds when the user is authorized
    if (isAuthorized) {
      const timer = setTimeout(() => {
        setShowUpdateModal(true);
      }, 10000);

      return () => clearTimeout(timer); // Cleanup function
    }
  }, [isAuthorized]);


  const linking = {
    prefixes: ['fever99://app'],
    config: {
      screens: {
        PAC: 'PAC',
        Meeting: 'Meeting/:data',
      },
    },
  };
  // return (
  //   <UserDataContext.Provider value={[userData, setUserData]}>
  //     <LoginContext.Provider value={[user, setUser]}>
  //       <LanguageContext.Provider value={[language, setLanguage]}>
  //         <AuthContext.Provider value={[isAuthorized, setIsAuthorized]}>

  //           <NavigationContainer
  //             ref={navigationRef}
  //             linking={linking}
  //             onReady={() => {
  //               setRouteName(navigationRef.getCurrentRoute()?.name);
  //             }}
  //             onStateChange={async () => {
  //               const previousRouteName = routeName;
  //               const currentRouteName = navigationRef.getCurrentRoute()?.name;
  //               setRouteName(currentRouteName);
  //             }}>
  //             <Root />
  //             <Toast />
  //           </NavigationContainer>
  //           {deviceVersion < backendVeriosn && 
  //           <UpdateModal isVisible={showUpdateModal} onClose={() => setShowUpdateModal(false)} />
  //           }
  //           {/* Render UpdateModal */}
  //         </AuthContext.Provider>
  //       </LanguageContext.Provider>
  //     </LoginContext.Provider>
  //   </UserDataContext.Provider>
  // );

  return (
    <UserDataContext.Provider value={[userData, setUserData]}>
      <LoginContext.Provider value={[user, setUser]}>
        <LanguageContext.Provider value={[language, setLanguage]}>
          <AuthContext.Provider value={[isAuthorized, setIsAuthorized]}>
  
            <NavigationContainer
              ref={navigationRef}
              linking={linking}
              onReady={() => {
                gotoInitialRoute()
                if (navigationRef && navigationRef.current) {
                  setRouteName(navigationRef.current.getCurrentRoute()?.name);
                }
              }}
              onStateChange={async () => {
                if (navigationRef && navigationRef.current) {
                  const previousRouteName = routeName;
                  const currentRouteName = navigationRef.current.getCurrentRoute()?.name;
                  setRouteName(currentRouteName);
                }
              }}>
              <Root />
              {/* <Toast /> */}
            </NavigationContainer>
            {deviceVersion < backendVeriosn && 
            <UpdateModal isVisible={showUpdateModal} onClose={() => setShowUpdateModal(false)} />
            }
            {/* Render UpdateModal */}
          </AuthContext.Provider>
        </LanguageContext.Provider>
      </LoginContext.Provider>
    </UserDataContext.Provider>
  );
  
}



export default App;
