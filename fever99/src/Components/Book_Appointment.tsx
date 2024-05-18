
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Headerr from '../ReuseableComp/Headerr';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {toastError} from '../utils/toast.utils';
import {getDoctors} from '../Services/doctor.service';
import {generateFilePath} from '../Services/url.service';
import {getstateAndCities} from '../Services/stateCity.service';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {getUser} from '../Services/user.service';
import {Roles} from '../utils/constant';
import LoadingService from '../All_Loding_page/Loding_service';
import DR_icons from 'react-native-vector-icons/FontAwesome6';
import Minus_icon from 'react-native-vector-icons/AntDesign';
import AntDesign from 'react-native-vector-icons/AntDesign';

const {height, width} = Dimensions.get('window');
const Book_Appointment = () => {
  const mainFont = 'Montserrat-Regular';
  const mainFontBold = 'Montserrat-Bold';
  const mainFontmedium = 'Montserrat-Medium';
  const maincolor = '#1263AC';
  const navigation: any = useNavigation();
  const [slctdsec, setSlctdsec] = useState('all');
  const focused = useIsFocused();
  const [userObj, setUserObj] = useState<any>('');

  const [sortType, setSortType] = useState('ASC');

  const [doctorsArr, setDoctorsArr] = useState<any[]>([]);
  const [lastPageReached, setLastPageReached] = useState(false);

  const [specialisationArr, setSpecialisationArr] = useState([]);

  const [specialization, setSpecialisation] = useState([]);

  const [isFocus, setIsFocus] = useState(false);
  const [cityIsFocused, setCityIsFocused] = useState(false);

  const [position, setPosition] = useState(0);
  const [gender, setGender] = useState('');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [prevLimit, setPrevLimit] = useState(10);

  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [showDrname, setSoDrname] = useState(false);

  const [statesArr, setStatesArr] = useState<any[]>([]);
  const [cityArr, setCityArr] = useState<any[]>([]);
  const [price, setPrice] = useState('');
  const [loding, setLoding] = useState(false);

  const HandleGetStatesAndCities = async () => {
    try {
      let {data: res} = await getstateAndCities();
      if (res.data && res.data.length > 0) {
        setStatesArr([
          ...res.data.map((el: any) => ({
            label: el.state,
            value: el.state,
            cities: el.city,
          })),
        ]);
      }
    } catch (err) {
      toastError(err);
    }
  };

  const HandleGetDoctorsPaginated = async (pageValue: number) => {
    setSoDrname(true);
    try {
      let queryString;
      if (query && query != '') {
        // queryString = `${queryString}&query=${query}`;
      }
      if (city && city != '') {
        // queryString = `${queryString}&city=${city}`;
      }
      let {data: res} = await getDoctors(queryString);
      if (res.data && res.data.length > 0) {
        setDoctorsArr((prev: any) => [...prev, ...res.data]);
        setLoding(false);
        setSpecialisationArr(
          res.spacility.map((el: any) => ({label: el, value: el})),
        );
      } else {
        setLastPageReached(true);
      }
    } catch (err) {
      toastError(err);
      setLoding(false);
    }
  };

  const handleSearch = async () => {
    try {
      setPage(1);
      let queryString;
      if (query && query != '') {
        queryString = `${queryString}&query=${query}`;
        setSoDrname(true);
      }
      if (city && city != '') {
        queryString = `${queryString}&city=${city}`;
      }
      if (specialization && specialization.length > 0) {
        queryString = `page=${page}&specialization=${specialization.join(',')}`;
      }
      if (price && price != '') {
        queryString = `${queryString}&price=${price}`;
      }
      if (gender && gender != '') {
        queryString = `${queryString}&gender=${gender}`;
      }
      if (sortType && sortType != '') {
        queryString = `${queryString}&pricesort=${sortType}`;
      }
      let {data: res} = await getDoctors(queryString);
      if (res.data) {
        console.log(res.data);
        console.log(res.data.length);
        setDoctorsArr(res.data);
      } else {
        setLastPageReached(true);
      }
    } catch (err) {
      toastError(err);
    }
  };
  useEffect(() => {
    handleSearch();
  }, [city, specialization, gender, sortType, price, limit]);

  let delay = 900;
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, delay);
    return () => clearTimeout(timer);
  }, [query, price]);

  const handleGetAndSetUser = async () => {
    let userData = await getUser();
    if (userData) {
      setUserObj(userData);
    }
  };

  useEffect(() => {
    if (focused) {
      handleGetAndSetUser();
      HandleGetStatesAndCities();
    }
  }, [focused]);

  useEffect(() => {
    if (focused) {
      HandleGetDoctorsPaginated(1);
    }

    return () => {
      handleClearAllfilter();
    };
  }, [focused]);

  const handleClearAllfilter = () => {
    setPage(1);
    setCity('');
    setQuery('');
    setPrice('');
    setGender('');
    setSpecialisation([]);
    setDoctorsArr([]);
    HandleGetDoctorsPaginated(1);
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

  console.log(';lkjd;gjsdflghslfghflskghflghs', limit);

  return (
    <View style={{width: width, backgroundColor: '#F1F8FF', flex: 1}}>
      <Headerr secndheader={true} label="Book Appointment" />
      <View style={{width: wp(95), alignSelf: 'center', marginTop: hp(1)}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignSelf: 'center',
            flexDirection: 'row',
            paddingBottom: hp(1),
          }}>
          <TouchableOpacity
            onPress={() => {
              setSlctdsec('all');
              setPosition((prev: any) => prev + 1);
              handleClearAllfilter();
            }}
            style={{
              height: hp(5),
              marginRight: 10,
              paddingLeft: wp(3),
              paddingRight: wp(3),
              backgroundColor: slctdsec == 'all' ? maincolor : '#F1F8FF',
              justifyContent: 'center',
              borderRadius: 5,
              borderColor: maincolor,
              borderWidth: slctdsec == 'all' ? 0 : 0.8,
            }}>
            <Text
              style={{
                color: slctdsec == 'all' ? 'white' : maincolor,
                fontFamily: mainFont,
                fontSize: hp(1.8),
              }}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSlctdsec('Doc_name')}
            style={{
              height: hp(5),
              marginRight: 10,
              paddingLeft: wp(3),
              paddingRight: wp(3),
              backgroundColor: slctdsec == 'Doc_name' ? maincolor : '#F1F8FF',
              justifyContent: 'center',
              borderRadius: 5,
              borderColor: maincolor,
              borderWidth: slctdsec == 'Doc_name' ? 0 : 0.8,
            }}>
            <Text
              style={{
                color: slctdsec == 'Doc_name' ? 'white' : maincolor,
                fontFamily: mainFont,
                fontSize: hp(1.8),
              }}>
              Our Doctors
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSlctdsec('spc')}
            style={{
              height: hp(5),
              marginRight: 10,
              paddingLeft: wp(3),
              paddingRight: wp(3),
              backgroundColor: slctdsec == 'spc' ? maincolor : '#F1F8FF',
              justifyContent: 'center',
              borderRadius: 5,
              borderColor: maincolor,
              borderWidth: slctdsec == 'spc' ? 0 : 0.8,
            }}>
            <Text
              style={{
                color: slctdsec == 'spc' ? 'white' : maincolor,
                fontFamily: mainFont,
                fontSize: hp(1.8),
              }}>
              Speacialization
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSlctdsec('loc')}
            style={{
              height: hp(5),
              marginRight: 10,
              paddingLeft: wp(3),
              paddingRight: wp(3),
              backgroundColor: slctdsec == 'loc' ? maincolor : '#F1F8FF',
              justifyContent: 'center',
              borderRadius: 5,
              borderColor: maincolor,
              borderWidth: slctdsec == 'loc' ? 0 : 0.8,
            }}>
            <Text
              style={{
                color: slctdsec == 'loc' ? 'white' : maincolor,
                fontFamily: mainFont,
                fontSize: hp(1.8),
              }}>
              Location
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSlctdsec('gender')}
            style={{
              height: hp(5),
              marginRight: 10,
              paddingLeft: wp(3),
              paddingRight: wp(3),
              backgroundColor: slctdsec == 'gender' ? maincolor : '#F1F8FF',
              justifyContent: 'center',
              borderRadius: 5,
              borderColor: maincolor,
              borderWidth: slctdsec == 'gender' ? 0 : 0.8,
            }}>
            <Text
              style={{
                color: slctdsec == 'gender' ? 'white' : maincolor,
                fontFamily: mainFont,
                fontSize: hp(1.8),
              }}>
              Gender
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSlctdsec('price')}
            style={{
              height: hp(5),
              marginRight: 10,
              paddingLeft: wp(3),
              paddingRight: wp(3),
              backgroundColor: slctdsec == 'price' ? maincolor : '#F1F8FF',
              justifyContent: 'center',
              borderRadius: 5,
              borderColor: maincolor,
              borderWidth: slctdsec == 'price' ? 0 : 0.8,
            }}>
            <Text
              style={{
                color: slctdsec == 'price' ? 'white' : maincolor,
                fontFamily: mainFont,
                fontSize: hp(1.8),
              }}>
              Price
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSlctdsec('sort')}
            style={{
              height: hp(5),
              marginRight: 10,
              paddingLeft: wp(3),
              paddingRight: wp(3),
              backgroundColor: slctdsec == 'sort' ? maincolor : '#F1F8FF',
              justifyContent: 'center',
              borderRadius: 5,
              borderColor: maincolor,
              borderWidth: slctdsec == 'sort' ? 0 : 0.8,
            }}>
            <Text
              style={{
                color: slctdsec == 'sort' ? 'white' : maincolor,
                fontFamily: mainFont,
                fontSize: hp(1.8),
              }}>
              Sort
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {slctdsec == 'Doc_name' && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 7,
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              alignItems: 'center',
            }}>
            <TextInput
              placeholder={`Please search Doctor Name`}
              value={query}
              onChangeText={e => setQuery(e)}
              style={{
                flex: 1,
                paddingLeft: 10,
                height: hp(6.4),
                fontSize: hp(2),
              }}
            />
            <TouchableOpacity
              onPress={() => handleSearch()}
              style={{
                paddingHorizontal: 15,
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
                Search
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {slctdsec == 'price' && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 7,
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              alignItems: 'center',
            }}>
            <TextInput
              placeholder={`Please search price`}
              value={price}
              onChangeText={e => setPrice(e)}
              style={{
                flex: 1,
                paddingLeft: 10,
                fontSize: hp(2),
                height: hp(6.4),
              }}
              keyboardType="number-pad"
            />
          </View>
        )}

        {slctdsec == 'spc' && (
          <View
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 10,
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              flexDirection: 'column-reverse',
            }}>
            <MultiSelect
              style={[styles.dropdown11, {width: wp(93)}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={specialisationArr}
              labelField="label"
              valueField="value"
              placeholder="Select Specialization"
              value={specialization}
              onChange={(item: any) => {
                setSpecialisation(item);
              }}
              renderLeftIcon={() => (
                <AntDesign style={styles.icon} name="Safety" size={20} />
              )}
              selectedStyle={styles.selectedStyle}
            />
          </View>
        )}

        {slctdsec == 'gender' && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 10,
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              alignItems: 'center',
            }}>
            <Dropdown
              style={[styles.dropdown, {width: wp(93)}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={[
                {label: 'Male', value: 'Male'},
                {label: 'Female', value: 'Female'},
              ]}
              labelField="label"
              valueField="value"
              placeholder="Select gender"
              value={gender}
              onChange={(item: any) => {
                setGender(item.value);
              }}
            />
          </View>
        )}
        {slctdsec == 'sort' && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 7,
              paddingVertical: hp(1.1),
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: hp(2), fontWeight: 'bold'}}>
              Price &#8645;
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 5,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setSortType('ASC');
                  }}
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: hp(1),
                    backgroundColor: sortType == 'ASC' ? '#50B148' : 'gray',
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: mainFont,
                      fontSize: hp(2),
                    }}>
                    Ascending
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSortType('DESC');
                  }}
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: hp(1),
                    marginLeft: 10,
                    backgroundColor: sortType == 'DESC' ? '#50B148' : 'gray',
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: mainFont,
                      fontSize: hp(2),
                    }}>
                    Descending
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {slctdsec == 'status' && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 10,
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => handleSearch()}
              style={{
                paddingHorizontal: 15,
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
                Search
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {slctdsec == 'loc' && (
          <View
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 7,
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingHorizontal: 5,
                alignItems: 'center',
              }}>
              {statesArr ? (
                <Dropdown
                  style={[
                    styles.dropdown,
                    {marginBottom: hp(2), width: wp(93)},
                    isFocus && {borderColor: 'blue', borderWidth: 0.5},
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={statesArr}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select One"
                  value={city}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item: any) => {
                    setCityArr([
                      ...item.cities.map((el: any) => ({label: el, value: el})),
                    ]);
                    setIsFocus(false);
                  }}
                />
              ) : null}

              {cityArr && cityArr.length > 0 && (
                <Dropdown
                  style={[
                    styles.dropdown,
                    {width: wp(93)},
                    cityIsFocused && {borderColor: 'blue', borderWidth: 0.5},
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={cityArr}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select One"
                  value={city}
                  onFocus={() => setCityIsFocused(true)}
                  onBlur={() => setCityIsFocused(false)}
                  onChange={(item: any) => {
                    setCity(item.value);
                    setCityIsFocused(false);
                  }}
                />
              )}
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                borderRadius: 10,
                justifyContent: 'space-between',
                paddingHorizontal: 5,
                alignItems: 'center',
              }}></View>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          <View>
            {city ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: wp(3),
                }}>
                <Text style={{fontSize: hp(2)}}>{city}</Text>
                <Minus_icon
                  name="minus"
                  style={{
                    backgroundColor: 'red',
                    color: '#fff',
                    fontSize: hp(2),
                    borderRadius: hp(40),
                    marginLeft: wp(1),
                  }}
                  onPress={() => {
                    setCity('');
                    setCityArr([]);
                  }}
                />
              </View>
            ) : (
              <Text> </Text>
            )}
          </View>
          <View>
            {gender ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: hp(2)}}>{gender}</Text>
                <Minus_icon
                  name="minus"
                  style={{
                    backgroundColor: 'red',
                    color: '#fff',
                    fontSize: hp(2),
                    borderRadius: hp(40),
                    marginLeft: wp(1),
                  }}
                  onPress={() => setGender('')}
                />
              </View>
            ) : (
              <Text> </Text>
            )}
          </View>
        </View>
        <View
          style={{width: wp(95), marginTop: hp(1), height: height - hp(7),marginBottom:hp(2)}}>
          <FlatList
            data={doctorsArr}
            showsVerticalScrollIndicator={false}
            // ListFooterComponent={
            //   <>
            //     {lastPageReached == false && (
            //       <View>
            //         <LoadingService />
            //         <LoadingService />
            //       </View>
            //     )}
            //   </>
            // }
            onEndReached={() => {
              handleOnEndReached();
            }}
            ListEmptyComponent={
              loding ? (
                <>
                  <LoadingService />
                  <LoadingService />
                  <LoadingService />
                </>
              ) : (
                <View style={{height: hp(100), width: wp(100)}}>
                  <LoadingService />
                  <LoadingService />
                </View>
              )
            }
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    width: wp(95),
                    padding: 7,
                    backgroundColor: 'white',
                    marginBottom: hp(2),
                    elevation: 2,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('About Doctor', {doctorId: item})}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '89%',
                      }}>
                      <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => navigation.navigate('About Doctor', {doctorId: item})}>
                        <Image
                          source={{uri: generateFilePath(item.image)}}
                          style={{height: wp(18), width: wp(18)}}
                        />
                        <View
                          style={{
                            marginLeft: wp(2),
                            minHeight: wp(18),
                            justifyContent: 'center',
                          }}>
                          <View style={{flexDirection: 'row'}}>
                            <DR_icons
                              name="user-doctor"
                              style={{fontSize: hp(1.5)}}
                            />
                            <View
                            style={{
                              display: 'flex',
                              maxWidth: wp(25),
                            }}
                            >
                            <Text
                              style={{
                                fontSize: hp(1.5),
                                paddingLeft: wp(0.75),
                              }}>
                              {item.specialization}
                            </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              maxWidth: wp(25),
                            }}>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: hp(1.8),
                                maxWidth: wp(35),
                                fontFamily: mainFont,
                              }}>
                              {item?.name}
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: '#7E7B7B',
                              fontSize: hp(1.5),
                              fontFamily: mainFont,
                              marginTop: hp(0.5),
                            }}>
                            {item?.userExtraDetails?.totalExperience} years of
                            experience
                          </Text>

                          <Text
                            style={{
                              color: '#7E7B7B',
                              fontSize: hp(1.5),
                              maxWidth: wp(35),
                              fontFamily: mainFont,
                              marginTop: hp(0.5),
                            }}>
                            {item?.userExtraDetails?.degree}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View
                        style={{
                          width: wp(25),
                          height: wp(18),
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flexDirection: 'row', maxWidth: wp(35)}}>
                          <Image
                            source={require('../../assets/images/location.png')}
                            style={{height: wp(4), width: wp(4)}}
                          />
                          <Text
                            style={{
                              color: '#4A4D64',
                              fontSize: hp(1.6),
                              fontFamily: mainFont,
                              marginLeft: wp(1),
                            }}>
                            {item?.city} {item?.state}
                          </Text>
                        </View>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 15,
                          }}>
                          <Text
                            style={{
                              height: 10,
                              width: 10,
                              borderRadius: 10,
                              backgroundColor:
                                item?.userStatus == 'online' ? 'green' : 'red',
                            }}></Text>
                          <Text style={{marginLeft: 5}}>
                            {item?.userStatus == 'online'
                              ? 'Available'
                              : 'Not available'}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: '#7E7B7B',
                            fontSize: hp(1.5),
                            fontFamily: mainFont,
                            marginLeft: wp(1),
                          }}>
                          Fee : ₹{item?.serviceCharge}/-{' '}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignSelf: 'baseline',
                      paddingTop: hp(1.5),
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('BookVdo', {doctor: item})
                      }
                      style={{
                        flex: 1,
                        marginRight: 5,
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
                          fontSize: hp(1.7),
                        }}>
                        Book Video Consult
                      </Text>
                    </TouchableOpacity>
                    {userObj?.role !== Roles.FRANCHISE && (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('BookClient', {doctor: item})
                        }
                        style={{
                          flex: 1,
                          marginLeft: 5,
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
                            fontSize: hp(1.7),
                          }}>
                          Book Clinic Visit
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  dropdown: {
    height: hp(6.4),
    borderRadius: 8,
    width: wp(93),
    backgroundColor: '#fff',
    color: '#000',
  },
  dropdown11: {
    height: hp(6.4),
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: hp(1),
    width: wp(95),
  },
  placeholderStyle: {
    fontSize: hp(2),
    color: '#000',
  },
  selectedTextStyle: {
    fontSize: hp(2),
    color: '#000',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: hp(2),
    color: '#000',
  },
  icon: {
    marginRight: wp(1),
    fontSize: hp(2.5),
  },
  selectedStyle: {
    borderRadius: 12,
    // backgroundColor:"red",
  },
});
export default Book_Appointment;
