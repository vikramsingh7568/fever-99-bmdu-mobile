import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions} from 'react-native';
import {getIncomeTransction} from '../../Services/wallet.service';
import {toastError} from '../../utils/toast.utils';
import Headerr from '../../ReuseableComp/Headerr';
import {useIsFocused} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Profiles_setting_icons from 'react-native-vector-icons/AntDesign';
import Money_icons from 'react-native-vector-icons/FontAwesome';
import Calendar_icons from 'react-native-vector-icons/FontAwesome5';
import Descriptyin_icosn from 'react-native-vector-icons/MaterialIcons';
import Credit_icosn from 'react-native-vector-icons/SimpleLineIcons';
import Loding_service from '../../All_Loding_page/Loding_service';
import moment from 'moment';

const {height, width} = Dimensions.get('window');

const mainFont = 'Montserrat-Regular';
const mainFontBold = 'Montserrat-Bold';

const Income = () => {
  const focused = useIsFocused();
  const [incomeTrans, setIncomeTrans] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (focused) {
      handlegetTrasction();
    }
  }, [focused]);

  const handlegetTrasction = async () => {
    try {
      const {data: res} = await getIncomeTransction();
      console.log('Transactions data not found in the response', res.data);
      if (res) {
        setIncomeTrans(res?.data?.transactions?.reverse());
        setBalance(res?.data?.balance);
      } else {
        console.error('Transactions data not found in the response');
      }
      setLoading(false);
    } catch (err) {
      // Handle errors here
      console.error('Error while fetching transactions:', err);
      setLoading(false);
    }
  };
  return (
    <View>
      <Headerr
        secndheader={true}
        secondText={`Total Income : ₹${balance}`}  
        label={`Total Income : ₹${balance}`}
        btn={false}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={incomeTrans}
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
                  height: hp(70),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: hp(2)}}>
                  No income transactions found
                </Text>
              </View>
            )}
          </>
        }
        removeClippedSubviews={true}
        contentContainerStyle={{paddingBottom: hp(10)}}
        renderItem={({item, index}: any) => {
          console.log(item.timestamp);
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
                marginBottom: hp(1),
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
};

export default Income;

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
