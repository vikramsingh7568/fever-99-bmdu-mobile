import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { AuthContext } from '../../App';
import url from '../Services/url.service';
import axios from '../Services/axios.service';
import Headerr from '../ReuseableComp/Headerr';
import { generateFilePath } from '../Services/url.service';
import CloseBtnIcon from 'react-native-vector-icons/Entypo';
import {
  deleteJwt,
  getJwt,
  getUser,
  isUserLoggedIn,
  setUser,
  updateUserStatus,
} from '../Services/user.service';
import { Roles } from '../utils/constant';
import { alertError, toastError, toastSuccess } from '../utils/toast.utils';
import { ScrollView } from 'react-native';
// all  icons import form ---> Edit_Phone_icons meen that there is two type  of  icons is there one is Edit and other is Phone icons
import Setting_Sharealt from 'react-native-vector-icons/AntDesign';
import Edit_Phone_icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Feather';
import Phone_icons from 'react-native-vector-icons/FontAwesome5';
import CashRefund_History_LogOut from 'react-native-vector-icons/MaterialCommunityIcons';
import Right_Icons from 'react-native-vector-icons/AntDesign';
import Contacts from 'react-native-vector-icons/AntDesign';
import Mail_icons from 'react-native-vector-icons/Entypo';
import Polocy_Icons from 'react-native-vector-icons/MaterialIcons';
import List_faq from 'react-native-vector-icons/Feather';
import Money_Icons from 'react-native-vector-icons/MaterialIcons';

const { height, width } = Dimensions.get('window');

const mainFont = 'Montserrat-Regular';
const mainFontBold = 'Montserrat-Bold';
const mainFontmedium = 'Montserrat-Medium';
const maincolor = '#1263AC';

const Profile = () => {

  const navigation: any = useNavigation();
  const [bookmodal, setBookmodal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useContext<any>(AuthContext);
  const focused = useIsFocused();
  const [userObj, setUserObj] = useState<any>({});
  const [count, setCount] = useState(0);
  const [paymentModal, setPaymentModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [withdraModal, setWithdrawModal] = useState(false);
  const [withdrawAmounr, setWithdrawAmounr] = useState('');
  const [errorso, setErrorO] = useState("");
  const [getEarning, setGetearning] = useState('');
  const [errorWithdrow, setwodraw] = useState("")
  const [rechargeAmounterr, setRechargeAmounterr] = useState('')
  const [withdrawError, setWithdrawArr] = useState('');

  let baseURL = userObj.role == Roles.DOCTOR ? `${url}/doctor-total-income` : `${url}/franchise-total-income`


  const handleLogout2 = async () => {
    try {
      if (isAuthorized) {
        await deleteJwt();
        setIsAuthorized(false);
      }
    } catch (err) {
      // toastError(err);
    }
  };

  useEffect(() => {
    CheckIsUserLoggedIn();
  }, [])



  const CheckIsUserLoggedIn = async () => {
    try {
      let token = await getJwt();
      if (token) {
        const { data: res }: any = await isUserLoggedIn();
        if (res.status == false) {
          handleLogout2()
          console.log('response from backend', res)
        }
      }
    } catch (err) {
      // toastError(err);
    }
  };

  const handleLogout = async () => {
    try {
      // if(isAuthorized){
      await deleteJwt();
      setIsAuthorized(false);
      // }
    } catch (err) {
      // toastError(err);
    }
  };

  const handleGetAndSetUser = async () => {
    let userData = await getUser();
    if (userData) {
      console.log('user data in profile section', userData)
      setUserObj(userData);
    }
  };
  useEffect(() => {
    if (focused) {
      handleGetAndSetUser();
    }
  }, [focused, count]);

  useEffect(() => { }, [focused, userObj]);

  const handleChangeStatus = async () => {
    try {
      let tempStatus = userObj?.userStatus;

      if (tempStatus == 'online') {
        tempStatus = 'offline';
      } else {
        tempStatus = 'online';
      }

      let { data: res } = await updateUserStatus(userObj?._id, {
        userStatus: tempStatus,
      });
      if (res) {
        await setUser(res.data);
        setUserObj({ ...res.data });
      }
    } catch (err) {
      // toastError(err);
    }
  };

  // share this app clicking
  const shareContent = async () => {
    const result = await Share.share({
      title: 'fever99',
      message: 'Discover expert medical advice at your fingertips with fever99! Download now to connect with knowledgeable doctors for accurate prescriptions and reliable health guidance., Link :https://play.google.com/store/apps/details?id=com.fever99',
      url: 'https://play.google.com/store/apps/details?id=com.fever99'

    });
  };

  const HandleAddAmountToWallet = async () => {
    let tempAmount = parseInt(`${amount}`) || 0;
    if (!tempAmount) {
      setRechargeAmounterr("Please enter amount")
      return;
    }
    if (tempAmount < 10) {
      setRechargeAmounterr("The amount should exceed 10.");
      return;
    }
    try {
      setPaymentModal(false);
      navigation.navigate('PayementScreen', { amount: tempAmount, });
    } catch (error) {
      // toastError(error);
    }
  }
  //  get income amount 
  const getIncomeAmount = async () => {
    try {
      const response = await axios.get(baseURL);
      if (response.data.message = "Wallet not create") {
        setErrorO(response.data.message);
      }
      else {
        setGetearning(response.data.Incomewallet);
      }
    } catch (error) {
      console.error("Error in getting wallet amount:", error);
    }
  };

  useEffect(() => {
    getIncomeAmount();
  }, []);

  const HandleWithdrawAmount = async () => {
    if (withdrawAmounr < 500) {
      setwodraw("Amount must be greater than 500");
      return;
    }
    if (getEarning < withdrawAmounr) {
      try {
        const response = await axios.post(`${url}/withdraw`);
        console.log("respons", response);
        if (response.status === 200) {
          setWithdrawModal(false);
          toastSuccess("Your money will be credited within 3-5 working days.")
        }
        else {
          setWithdrawModal(false);
          // toastError("Please try again later")
        }
      } catch (error) {
        console.error('Error occurred while making withdrawal:', error);
        setWithdrawArr("Failed to withdraw amount");
      }
    }

  };
  const imageSize = Math.min(hp(27), wp(17));

  return (
    <View
      style={{
        width: width,
        // height: height,
        backgroundColor: 'white',
        paddingBottom: hp(2),
      }}>
      <Headerr secndheader={true} label="Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80,
          width: wp(95),
          alignSelf: 'center',
        }}>
        <View style={{ width: wp(95), marginTop: hp(3), flexDirection: 'row' }}>
          <View style={{ position: 'relative' }}>
            <Image
              source={
                userObj?.image &&
                  userObj?.image != '' &&
                  userObj?.image.includes('file')
                  ? { uri: generateFilePath(userObj?.image) }
                  : require('../../assets/images/profile.png')
              }
              style={{
                height: imageSize,
                width: imageSize,
                resizeMode: 'center', // Use 'cover' to ensure the image fills the container
                borderRadius: imageSize / 2, // Set the borderRadius dynamically
                backgroundColor: 'grey',
              }}
            />
            {userObj.role == Roles.DOCTOR && (
              <View
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  backgroundColor:
                    userObj?.userStatus == 'online' ? 'green' : 'red',
                  height: 10,
                  width: 10,
                  borderRadius: 10,
                }}></View>
            )}
          </View>
          <View style={{ height: wp(20), marginLeft: wp(3) }}>



            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: hp(1.9), fontFamily: mainFontBold }}>
                {userObj?.name}
              </Text>

            </View>
            <View style={{ flexDirection: 'row', marginTop: hp(0.5) }}>
              <Mail_icons name="mail" style={styles.profileIcons} />
              <Text
                style={{
                  color: '#4A4D64',
                  fontSize: hp(1.5),
                  fontFamily: mainFontmedium,
                  marginLeft: wp(2),
                }}>
                {userObj?.email}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: hp(0.5) }}>
              <Phone_icons name="phone-alt" style={styles.profileIcons} />
              <Text
                style={{
                  color: '#4A4D64',
                  fontSize: hp(1.5),
                  fontFamily: mainFontmedium,
                  marginLeft: wp(2),
                }}>
                {userObj?.mobile}
              </Text>
            </View>

            {userObj && userObj.role === 'FRANCHISE' && (
              <>
                {userObj.address && (
                  <View style={{ flexDirection: 'row', marginTop: hp(0.5), width: 300 }}>
                    <Icon name="map-pin" style={styles.profileIcons} />
                    <Text
                      style={{
                        color: '#4A4D64',
                        fontSize: hp(1.5),
                        fontFamily: mainFontmedium,
                        marginLeft: wp(2),
                      }}>
                      {userObj.address}
                    </Text>
                  </View>
                )}

                {userObj.createdAt && (
                  <View style={{ flexDirection: 'row', marginTop: hp(0.5), width: 300 }}>
                    <Icon name="calendar" style={styles.profileIcons} />
                    <Text
                      style={{
                        color: '#4A4D64',
                        fontSize: hp(1.5),
                        fontFamily: mainFontmedium,
                        marginLeft: wp(2),
                      }}>
                      {userObj.createdAt.match(/^\d{4}-\d{2}-\d{2}/)[0]}
                    </Text>
                  </View>
                )}

                {userObj.franchiseCode && (
                  <View style={{ flexDirection: 'row', marginTop: hp(0.5), width: 300 }}>
                    <Icon name="hash" style={styles.profileIcons} />
                    <Text
                      style={{
                        color: '#4A4D64',
                        fontSize: hp(1.5),
                        fontFamily: mainFontmedium,
                        marginLeft: wp(2),
                      }}>
                      {userObj.franchiseCode}
                    </Text>
                  </View>
                )}
              </>
            )}

            {/* refrelCode */}

            {userObj.role == Roles.DOCTOR && (
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor:
                    userObj?.userStatus == 'online' ? 'green' : 'red',
                  borderRadius: 10,
                  width: 100,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}
                onPress={() => handleChangeStatus()}>
                <Text>
                  Set {userObj?.userStatus == 'online' ? 'Offline' : 'Online'}
                </Text>
              </Pressable>
            )}

            {userObj?.address &&
              userObj?.address != '' &&
              userObj?.city &&
              userObj?.city != '' &&
              userObj?.state &&
              userObj?.state != '' &&
              userObj?.pincode &&
              userObj?.pincode != '' && (
                <View style={{ flexDirection: 'row', marginTop: hp(0.5) }}>
                  <Image
                    source={require('../../assets/images/Location2.png')}
                    style={{ height: wp(4), width: wp(4) }}
                  />
                  <Text
                    style={{
                      color: '#4A4D64',
                      fontSize: hp(1.5),
                      fontFamily: mainFontmedium,
                      marginLeft: wp(2),
                    }}>
                    {userObj?.address} , {userObj?.city} , {userObj?.state} -{' '}
                    {userObj?.pincode}
                  </Text>
                </View>
              )}
          </View>
        </View>

        <View style={{ width: wp(95), marginTop: hp(6) }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditiProfile')}
            style={styles.clickbleLines}>
            <View
              style={{
                flexDirection: 'row',
                height: wp(8),
                alignItems: 'center',
              }}>
              <Edit_Phone_icons name="edit" style={styles.allIconsStyle} />
              <Text
                style={{
                  fontSize: hp(1.8),
                  color: '#4A4D64',
                  fontFamily: mainFont,
                  marginLeft: wp(2),
                }}>
                Edit Profile
              </Text>
            </View>
            <Right_Icons name="right" style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Appointment')}
            style={styles.clickbleLines}>
            <View
              style={{
                flexDirection: 'row',
                height: wp(8),
                alignItems: 'center',
              }}>
              <CashRefund_History_LogOut
                name="history"
                style={styles.allIconsStyle}
              />
              <Text
                style={{
                  fontSize: hp(1.8),
                  color: '#4A4D64',
                  fontFamily: mainFont,
                  marginLeft: wp(2),
                }}>
                Appointment History
              </Text>
            </View>
            <Right_Icons name="right" style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ContactUs')}
            style={styles.clickbleLines}>
            <View
              style={{
                flexDirection: 'row',
                height: wp(8),
                alignItems: 'center',
              }}>
              <Contacts name="contacts" style={styles.allIconsStyle} />
              <Text
                style={{
                  fontSize: hp(1.8),
                  color: '#4A4D64',
                  fontFamily: mainFont,
                  marginLeft: wp(2),
                }}>
                Contact Us
              </Text>
            </View>
            <Right_Icons name="right" style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.clickbleLines}
            onPress={() => shareContent()}>
            <View
              style={{
                flexDirection: 'row',
                height: wp(8),
                alignItems: 'center',
              }}>
              <Setting_Sharealt name="sharealt" style={styles.allIconsStyle} />
              <Text
                style={{
                  fontSize: hp(1.8),
                  color: '#4A4D64',
                  fontFamily: mainFont,
                  marginLeft: wp(2),
                }}>
                Share App
              </Text>
            </View>
            <Right_Icons name="right" style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.clickbleLines}>
            <View
              style={{
                flexDirection: 'row',
                height: wp(8),
                alignItems: 'center',
              }}>
              <Setting_Sharealt name="setting" style={styles.allIconsStyle} />
              <Text
                style={{
                  fontSize: hp(1.8),
                  color: '#4A4D64',
                  fontFamily: mainFont,
                  marginLeft: wp(2),
                }}>
                Setting
              </Text>
            </View>
            <Right_Icons name="right" style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>

          {userObj.role == Roles.FRANCHISE && (
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => setPaymentModal(true)}
                  style={styles.clickbleLines}>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: wp(8),
                      alignItems: 'center',
                    }}>
                    <Money_Icons name="account-balance-wallet" style={styles.allIconsStyle} />
                    <Text
                      style={{
                        fontSize: hp(1.8),
                        color: '#4A4D64',
                        fontFamily: mainFont,
                        marginLeft: wp(2),
                      }}>
                      Recharge Wallet
                    </Text>
                  </View>
                  <Right_Icons name="right" style={{ fontSize: hp(3.1) }} />
                </TouchableOpacity>

                <Modal
                  isVisible={paymentModal}
                  animationIn={'bounceIn'}
                  animationOut={'slideOutDown'}
                  onBackButtonPress={() => { setPaymentModal(false), setRechargeAmounterr('') }}
                  style={{ marginLeft: 0, marginRight: 0 }}>
                  <View style={styles.modalView}>

                    <View style={styles.textAndClose}>
                      <Text style={styles.modalhi}>
                        Recharge Amount
                      </Text>
                      <TouchableOpacity
                        onPress={() => { setPaymentModal(false), setRechargeAmounterr('') }}>
                        <Image
                          source={require('../../assets/images/close.png')}
                          style={{ tintColor: '#FA6C23', height: wp(4), width: wp(4) }}
                        />
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      placeholder="Amount"
                      keyboardType="number-pad"
                      style={styles.modalInputfilde}
                      onChangeText={(e: any) => setAmount(e)}
                      value={`${amount}`}
                      placeholderTextColor="gray"
                    />
                    <Text style={{ color: "red" }}>{rechargeAmounterr}</Text>
                    <TouchableOpacity
                      onPress={() => HandleAddAmountToWallet()}
                      style={styles.modalBtn}>
                      <Text style={styles.modlaSubmittext}>
                        Recharge
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
            </View>
          )}
          {/* {(userObj.role == Roles.FRANCHISE || userObj.role == Roles.DOCTOR) &&
            <View>
              <TouchableOpacity
                onPress={() => { setWithdrawModal(true), getIncomeAmount() }}
                style={styles.clickbleLines}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: wp(8),
                    alignItems: 'center',
                  }}>
                  <Money_Icons name="account-balance" style={styles.allIconsStyle} />
                  <Text style={{
                    fontSize: hp(1.8),
                    color: '#4A4D64',
                    fontFamily: mainFont,
                    marginLeft: wp(2),
                  }}>
                    Withdraw Money
                  </Text>
                </View>
                <Right_Icons name="right" style={{ fontSize: hp(3.1) }} />
              </TouchableOpacity>
              <Modal
                isVisible={withdraModal}
                animationIn={'bounceIn'}
                animationOut={'slideOutDown'}
                onBackButtonPress={() => { setWithdrawModal(false), setErrorO('') }}
                style={{ marginLeft: 0, marginRight: 0 }}>
                <View style={styles.modalView}>
                  <View style={styles.textAndClose}>

                    <Text style={styles.modalhi}>Withdraw Amount</Text>
                    <TouchableOpacity
                      onPress={() => { setWithdrawModal(false), setErrorO('') }}>
                      <Image
                        source={require('../../assets/images/close.png')}
                        style={{ tintColor: '#FA6C23', height: wp(4), width: wp(4) }}
                      />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    placeholder="Amount"
                    keyboardType="number-pad"
                    style={styles.modalInputfilde}
                    onChangeText={(e: any) => setWithdrawAmounr(e)}
                    value={`${withdrawAmounr}`}
                    placeholderTextColor="gray"
                  />
                  <Text style={{ color: "red" }}>{withdrawError}</Text>
                  <TouchableOpacity
                    onPress={() => HandleWithdrawAmount()}
                    style={styles.modalBtn}>
                    <Text style={styles.modlaSubmittext}>
                      Withdraw
                    </Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          } */}
          {
            userObj.role == Roles.DOCTOR &&
            <TouchableOpacity
              onPress={() => navigation.navigate('SMART PRESCRIPTION')}
              //ProfileTemrs
              style={styles.clickbleLines}>
              <View
                style={{
                  flexDirection: 'row',
                  height: wp(8),
                  alignItems: 'center',
                }}>
                <Polocy_Icons name="policy" style={styles.allIconsStyle} />
                <Text
                  style={{
                    fontSize: hp(1.8),
                    color: '#4A4D64',
                    fontFamily: mainFont,
                    marginLeft: wp(2),
                  }}>
                  Smart Prescription
                </Text>
              </View>
              <Right_Icons name="right" style={{ fontSize: hp(3.1) }} />
            </TouchableOpacity>
          }

          <TouchableOpacity
            onPress={() => navigation.navigate('About Fever99')}

            //ProfileTemrs
            style={styles.clickbleLines}>
            <View
              style={{
                flexDirection: 'row',
                height: wp(8),
                alignItems: 'center',
              }}>
              <List_faq name="list" style={styles.allIconsStyle} />
              <Text
                style={{
                  fontSize: hp(1.8),
                  color: '#4A4D64',
                  fontFamily: mainFont,
                  marginLeft: wp(2),
                }}>
                About Fever99
              </Text>
            </View>
            <Right_Icons name="right" style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => setBookmodal(true)}
            style={styles.clickbleLines}>
            <View
              style={{
                flexDirection: 'row',
                height: wp(8),
                alignItems: 'center',
              }}>
              <CashRefund_History_LogOut
                name="logout"
                style={styles.allIconsStyle}
              />
              <Text
                style={{
                  fontSize: hp(1.8),
                  color: '#4A4D64',
                  fontFamily: mainFont,
                  marginLeft: wp(2),
                }}>
                Logout
              </Text>
            </View>
            <Right_Icons name="right" style={{ fontSize: hp(3.1) }} />
          </TouchableOpacity>
        </View >
      </ScrollView >

      <Modal
        isVisible={bookmodal}
        animationIn={'bounceIn'}
        animationOut={'bounceOut'}
        onBackButtonPress={() => setBookmodal(false)}
        style={{ marginLeft: 0, marginRight: 0 }}>
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
            style={{ alignSelf: 'flex-end' }}>
            <Image
              source={require('../../assets/images/close.png')}
              style={{ tintColor: 'black', height: wp(5), width: wp(5) }}
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
            }}>
            <Image
              source={require('../../assets/images/logouticn.png')}
              style={{ height: wp(9), width: wp(9), resizeMode: 'contain' }}
            />
          </View>
          <Text
            style={{
              color: 'black',
              fontFamily: mainFontmedium,
              fontSize: hp(2),
              marginTop: hp(3),
              textAlign: 'center',
            }}>
            Are you sure you want to logout ?
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
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleLogout()}
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
                style={{ color: 'white', fontFamily: mainFont, fontSize: hp(2) }}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View >
  );
};

export default Profile;
const styles = StyleSheet.create({
  allIconsStyle: {
    color: '#1263AC',
    fontSize: hp(3.4),
  },
  clickbleLines: {
    width: wp(95),
    flexDirection: 'row',
    backgroundColor: '#E8E6E6',
    height: hp(5.5),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: wp(3),
    paddingLeft: wp(3),
    borderRadius: wp(1),
    marginTop: hp(2),
  },
  profileIcons: {
    fontSize: hp(1.75),
  },
  modalView: {
    width: wp(85),
    paddingTop: hp(3),
    paddingBottom: hp(3),
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 5,
    paddingLeft: wp(4),
    paddingRight: wp(4),
  },
  modalhi: {
    fontSize: hp(2),
    color: 'black',
    fontFamily: mainFont,
    fontWeight: 'bold',
  },
  modalInputfilde: {
    marginTop: 15,
    color: 'gray',
    backgroundColor: '#e6edf7',
    fontSize: hp(2)
  },
  modalBtn: {
    height: hp(5),
    width: wp(77),
    maxWidth: hp(80),
    alignSelf: 'center',
    marginTop: hp(1),
    backgroundColor: '#1263AC',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modlaSubmittext: {
    color: 'white',
    fontFamily: mainFont,
    fontSize: hp(1.8),
  },
  closeIcon: {
    fontSize: hp(5),
    padding: 3,
    backgroundColor: '#dfeefc',
    color: '#1263AC',
    borderRadius: wp(40),
  },
  textAndClose: {
    flexDirection: "row",
    justifyContent: "space-between",
  }
});