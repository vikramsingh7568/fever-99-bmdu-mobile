import {View, Text, FlatList, Dimensions, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {toastError} from '../../utils/toast.utils';
import Headerr from '../../ReuseableComp/Headerr';
import {getWallet} from '../../Services/wallet.service';

import Profiles_setting_icons from 'react-native-vector-icons/AntDesign';
import Money_icons from 'react-native-vector-icons/FontAwesome';
import Calendar_icons from 'react-native-vector-icons/FontAwesome5';
import Descriptyin_icosn from 'react-native-vector-icons/MaterialIcons';
import Credit_icosn from 'react-native-vector-icons/SimpleLineIcons';
import Loding_service from '../../All_Loding_page/Loding_service';
import moment from 'moment';

const {height, width} = Dimensions.get('window');
export default function Transactions() {
  const navigation: any = useNavigation();
  const mainFont = 'Montserrat-Regular';
  const mainFontBold = 'Montserrat-Bold';
  const [userObj, setUserObj] = useState<any>({});
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState([]);
  const [loading, setLoading] = useState(true);

  const focused = useIsFocused();

  const handleGetWallet = async () => {
    try {
      let {data: res}: any = await getWallet();
      console.log('this is my respons', res);

      if (res) {
        setWallet(res?.data?.transactions?.reverse());
        setBalance(res?.data?.balance);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      // toastError(err);
    }
  };

  useEffect(() => {
    if (focused) {
      handleGetWallet();
    }
  }, [focused]);

  return (
    <View>
      <Headerr
        secndheader={true}
        secondText={`Wallet balance : ₹${balance}`}
        label={`Wallet balance : ₹${balance}`}
        btn={false}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={wallet}
        ListEmptyComponent={
          <>
            {loading ? (
              <View>
                <Loding_service />
                <Loding_service />
                <Loding_service />
              </View>
            ) : (
              <View
                style={{
                  display: 'flex',
                  height: height,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: hp(2)}}>No Transactions found </Text>
              </View>
            )}
          </>
        }
        removeClippedSubviews={true}
        contentContainerStyle={{paddingBottom: hp(10)}}
        renderItem={({item, index}: any) => {
          const timestamp = new Date(item.timestamp);

          const formattedDate = `${('0' + (timestamp.getMonth() + 1)).slice(
            -2,
          )}-${('0' + timestamp.getDate()).slice(
            -2,
          )}-${timestamp.getFullYear()}`;

          return (
            <View
              style={{
                width: width,
                paddingTop: hp(0.75),
                paddingBottom: hp(2),
                backgroundColor: item.type == 'debit' ? '#F3ECEF' : '#E9F5F3',
                elevation: 3,
                marginBottom: hp(2),
              }}>
              <View style={{width: width, flexDirection: 'row'}}>
                <View
                  style={{
                    width: wp(100),
                    paddingLeft: wp(3),
                    paddingTop: hp(1),
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.flexSTYLES}>
                      <Profiles_setting_icons
                        name="profile"
                        style={styles.iconsStyls}
                      />
                      <Text
                        style={{
                          marginLeft: wp(2),
                          fontSize: hp(1.8),
                          color: 'black',
                          fontFamily: mainFontBold,
                        }}>
                        S.no:
                      </Text>
                    </View>
                    <View>
                      <Text style={{color: 'gray', fontSize: hp(2)}}>
                        {index + 1}
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.flexSTYLES}>
                      <Calendar_icons
                        name="calendar-day"
                        style={styles.iconsStyls}
                      />
                      <Text
                        style={{
                          marginLeft: wp(2),
                          fontSize: hp(1.8),
                          color: 'black',
                          fontFamily: mainFontBold,
                        }}>
                        Date and Time:
                      </Text>
                    </View>
                    <View>
                      <Text style={{color: 'gray', fontSize: hp(2)}}>
                        {moment(item.timestamp).format('DD-MM-YYYY hh:mm a')}
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.flexSTYLES}>
                      <Credit_icosn
                        name="credit-card"
                        style={styles.iconsStyls}
                      />
                      <Text
                        style={{
                          marginLeft: wp(2),
                          fontSize: hp(1.8),
                          color: 'black',
                          fontFamily: mainFontBold,
                        }}>
                        Types:
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: 'gray',
                          textTransform: 'capitalize',
                          fontSize: hp(2),
                        }}>
                        {item?.type}
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.flexSTYLES}>
                      <Money_icons name="money" style={styles.iconsStyls} />
                      <Text
                        style={{
                          marginLeft: wp(2),
                          fontSize: hp(1.8),
                          color: 'black',
                          fontFamily: mainFontBold,
                        }}>
                        Amount:
                      </Text>
                    </View>
                    <View>
                      <Text style={{color: 'gray', fontSize: hp(2)}}>
                        ₹ {item?.amount}
                      </Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.flexSTYLES}>
                      <Descriptyin_icosn
                        name="description"
                        style={styles.iconsStyls}
                      />
                      <Text
                        style={{
                          marginLeft: wp(2),
                          fontSize: hp(1.8),
                          color: 'black',
                          fontFamily: mainFontBold,
                        }}>
                        Description:
                      </Text>
                    </View>
                    <View style={{width: wp(50)}}>
                      <Text style={{color: 'gray', fontSize: hp(2)}}>
                        {item?.message}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  common_displayFlex: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  flexSTYLES: {
    flexDirection: 'row',
    width: wp(45),
  },
  iconsStyls: {
    color: '#1263AC',
    fontSize: hp(2.2),
    marginRight: wp(3),
    marginVertical: 4,
  },
});
