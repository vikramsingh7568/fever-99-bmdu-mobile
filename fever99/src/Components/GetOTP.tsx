import { View, Text, Pressable, Dimensions, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { toastError, toastSuccess } from '../utils/toast.utils';
import { resetPassword } from '../Services/user.service';

const { height, width } = Dimensions.get('window')
import Openeye_closeEye from 'react-native-vector-icons/Ionicons';


const GetOTP = (props: any) => {
    const mainFont = 'Montserrat-Regular'
    const mainFontBold = 'Montserrat-Bold'
    const navigation: any = useNavigation()
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [hide, setHide] = useState(true);
    const [hide2, setHide2] = useState(true);



    const handleRegister = async () => {
        try {
            if (!otp || otp == "") {
                toastError("Please enter otp to register !!!");
                return
            }
            if (password == "") {
                toastError("Password is mandatory !!!");
                return
            }
            if (rePassword == "") {
                toastError("Confirm Password is mandatory !!!");
                return
            }
            if (rePassword !== password) {
                toastError("Password and Confirm Password does not match !!!");
                return
            }

            let obj = {
                otp,
                mobile: props.route.params.data,
                password,
                rePassword,
            }

            console.log(obj, "obj")
            let { data: res } = await resetPassword(obj);
            if (res.message) {
                toastSuccess(res.message);
                navigation.navigate("Login")
            }
        }
        catch (err) {
            console.error(JSON.stringify(err))
            toastError(err);
        }
    }
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ width: width }}>
                <View>
                    <View>
                        <Image source={require('../../assets/images/final1.png')} resizeMode='stretch' style={{ height: hp(30), width: wp(100) }} />
                    </View>
                    <View style={{}}>
                        <Text style={{ fontSize: hp(3), marginLeft: wp(5), fontFamily: mainFont, color: '#1263AC', fontWeight: 'bold' }}>OTP Verification</Text>
                        <View style={{ width: wp(90), alignSelf: 'center', marginTop: hp(2) }}>
                            {/* OTP section >>>>>>>>>>>>>>>>>>>>>*/}
                            <Text style={{ color: '#1263AC', fontWeight: 'bold', fontSize: hp(1.8) }}>OTP</Text>
                            <View style={{ width: '100%', height: hp(5.5), backgroundColor: '#E8E8E8', marginTop: hp(1), borderRadius: 5, alignItems: 'center', paddingLeft: wp(1.5), flexDirection: 'row' }}>
                                <TextInput placeholder='Enter OTP' onChangeText={(e) => setOtp(e)} value={otp} placeholderTextColor="gray"
                                    style={{ marginLeft: 5, width: wp(70), fontSize: hp(2) }} />
                            </View>
                            <Text style={{ marginTop: hp(2), color: '#1263AC', fontWeight: 'bold', fontSize: hp(1.8) }}>Password</Text>
                            <View style={{ width: '100%', height: hp(5.5), backgroundColor: '#E8E8E8', marginTop: hp(1), borderRadius: 5, alignItems: 'center', paddingLeft: wp(1.5), flexDirection: 'row', justifyContent: "space-between" }}>
                                <TextInput placeholder='Enter Password'
                                    placeholderTextColor="gray"
                                    secureTextEntry={hide}
                                    onChangeText={(e) => setPassword(e)}
                                    value={password}
                                    style={{ marginLeft: 5, width: wp(70), fontSize: hp(2) }} />
                                <Pressable onPress={() => setHide(!hide)} style={{ padding: wp(2) }}>
                                    <Openeye_closeEye
                                        name={hide ? "eye-off" : "eye"}
                                        style={{
                                            color: '#696968',
                                            fontSize: hp(3),
                                        }}
                                    />
                                </Pressable>

                            </View>
                            <Text style={{ marginTop: hp(2), color: '#1263AC', fontWeight: 'bold', fontSize: hp(1.8) }}>Confirm password</Text>
                            <View style={{ width: '100%', height: hp(5.5), backgroundColor: '#E8E8E8', marginTop: hp(1), borderRadius: 5, alignItems: 'center', paddingLeft: wp(1.5), flexDirection: 'row', justifyContent: "space-between" }}>
                                <TextInput placeholder='Enter Confirm Password'
                                    placeholderTextColor="gray"
                                    onChangeText={(e) => setRePassword(e)}
                                    value={rePassword}
                                    secureTextEntry={hide2}
                                    style={{ marginLeft: 5, width: wp(70), fontSize: hp(2) }} />
                                <Pressable onPress={() => setHide2(!hide2)} style={{ padding: wp(2) }}>
                                    <Openeye_closeEye
                                        name={hide2 ? "eye-off" : "eye"}
                                        style={{
                                            color: '#696968',
                                            fontSize: hp(3),
                                        }}
                                    />
                                </Pressable>
                            </View>

                            {/* Button section >>>>>>>>>>>>>>>>>> */}
                            <TouchableOpacity
                                onPress={() => handleRegister()}
                                style={{ width: '100%', height: hp(6), backgroundColor: '#1263AC', marginTop: hp(4), borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontFamily: mainFont, fontSize: hp(2) }}>Submit</Text>
                            </TouchableOpacity>

                        </View>
                        <View>

                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>

    )
}

export default GetOTP