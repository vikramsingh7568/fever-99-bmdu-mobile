import React, {useEffect, useState} from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Text} from 'react-native';
import {getMeetingToken} from '../Services/meeting.service';
import {toastError} from '../utils/toast.utils';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const Meeting = (props: any) => {
  const navigation: any = useNavigation();
  const [videoCall, setVideoCall] = useState(true);
  const [uid, setuid] = useState(Math.floor(Math.random() * 1000));
  const [token, setToken] = useState('');

  const connectionData = {
    appId: 'b671aeda83ee48d582e9cc33f83b30cb',
    channel: props.route.params.data,
    // token: token
  };
  const rtcCallbacks = {

    EndCall: () => {
      console.log('this call back is working fine to end call ')
      // alert('wow')
      setVideoCall(false);
      navigation.goBack();
    },
  };
  const focused = useIsFocused();
  const [loading, setLoading] = useState(false);

  const btnStyle = {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#3832a8',
    borderWidth: 0,
  };

  const HandleGetMeetingToken = async () => {
    try {
      setLoading(true);
      let obj = {
        channelName: props.route.params.data,
        role: '',
        uid: uid,
      };
      let {data: res} = await getMeetingToken(obj);
      if (res.tokenA) {
        setLoading(false);
        setToken(res.tokenA);
      }
    } catch (error) {
      setLoading(false);
      // toastError(error)
    }
  };

  useEffect(() => {
    if (focused && props.route.params.data && props.route.params.data != '') {
      HandleGetMeetingToken();
      console.log(props.route.params.data, 'props.route.params.data');
    }
  }, [focused, props.route.params.data]);

  const remoteBtnStyle = {backgroundColor: '#2edb8555'};
  return (
    <>
      <AgoraUIKit
        connectionData={connectionData}
        settings={{
          mode: 0,
        }}
        styleProps={{
          iconSize: 25,
          theme: '#ffffffee',

          overlayContainer: {
            opacity: 1,
          },
          localBtnStyles: {
            muteLocalVideo: btnStyle,
            muteLocalAudio: btnStyle,
            switchCamera: btnStyle,
            endCall: {
              borderRadius: 50,
              width: 50,
              height: 50,
              backgroundColor: '#f66',
              borderWidth: 0,
            },
          },
          localBtnContainer: {
            backgroundColor: 'transparent',
            bottom: 0,
            paddingVertical: 10,
            borderWidth: 0,
            borderColor: 'transparent',
            height: 90,
          },
          maxViewRemoteBtnContainer: {
            top: 0,
            alignSelf: 'flex-end',
          },
          remoteBtnStyles: {
            muteRemoteAudio: remoteBtnStyle,
            muteRemoteVideo: remoteBtnStyle,
            remoteSwap: remoteBtnStyle,
            minCloseBtnStyles: remoteBtnStyle,
          },
          minViewContainer: {
            top: 50,
            left: widthPercentageToDP(65),
            marginRight: 10,
            backgroundColor: 'transparent',
            borderColor: '#2edb85',
            borderWidth: 0,
            borderRadius: 10,
          },
          minViewStyles: {
            height: 215,
            borderRadius: 10,
            width: 120,
            marginLeft: 'auto',
          },
          maxViewStyles: {
            height: '100%',
          },
          UIKitContainer: {height: '100%'},
        }}
        rtcCallbacks={rtcCallbacks}
      />
    </>
  );
};
export default Meeting;
