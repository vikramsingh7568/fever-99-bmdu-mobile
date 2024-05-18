import axios from './axios.service';
import url from './url.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN } from '../utils/constant';
import jwt_decode from "jwt-decode";

const serverUrl = url + '/users';

export const registerUser = async (obj) => {
  return await axios.post(`${url}/user/register`, obj);
};



export const updateSlot = async (obj) => {
  let config = {
    headers: {
      'accept': "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  }

  return await axios.put(`${url}/profile/update`, obj, config);
};

export const updateProfile = async (obj) => {
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      "Access-Control-Allow-Origin": "*"
    }
  }

  return await axios.put(`${url}/doctor/update`, obj, config);
};



export const updateUserStatus = async (id, obj) => {
  let config = {
    headers: {
      'accept': "application/json",
      "Access-control-Allow-Origin": "*"
    }
  }

  console.log(obj, "obj")
  return await axios.put(`${url}/update-user-avaliable/${id}`, obj, config);
};

export const getProfile = async () => {
  return await axios.get(`${serverUrl}/getProfile`);
};



export const saveTokenToDatabase = async token => {
  try {
    return await axios.post(`${serverUrl}/checkAndRegisterFcmToken`, { token });
  } catch (error) {
    console.error(error, "Asd");
    throw error;
  }
};

export const loginUser = async (obj) => {
  return await axios.post(`${url}/login`, obj);
};


export const ProceedToLoginUser = async (obj) => {
  return await axios.post(`${url}/proceed-to-logout`, obj);
};



//notificaion get and check read or not read

export const getNotifications = async (obj) => {
  return await axios.get(`${url}/notifications`);
};

export const isReadNotification = async (id) => {
  console.log("jghjhghghjgvhgfhg",`${url}/notifications/read/${id}`);
  return await axios.put(`${url}/notifications/read/${id}`);
  
};



// using this funciton in profile terms and condition file
export const GetTeam = async (obj) => {
  return await axios.get(`${url}/team`);
};


export const sendOtp = async (obj) => {

  return await axios.post(`${url}/temp-register`, obj);
};

export const forgotPassword = async (obj) => {
  return await axios.post(`${url}/forgotpassword`, obj);
};
export const resetPassword = async (obj) => {
  return await axios.post(`${url}/reset-forgotpassword`, obj);
};


export const updatePassword = async (obj) => {
  return await axios.post(`${url}/login`, obj);
};


export const setJwt = async (token, user) => {
  await AsyncStorage.setItem(AUTH_TOKEN, token);
  await AsyncStorage.setItem("USER-DATA", JSON.stringify(user));
  return
};
export const setUser = async (user) => {
  console.log(JSON.stringify(user, null, 2), "settting")
  await AsyncStorage.setItem("USER-DATA", JSON.stringify(user));
  return
};


export const decodeJwt = async () => {
  let jwtToken = await AsyncStorage.getItem(AUTH_TOKEN);
  if (jwtToken) {
    let decoded = await jwt_decode(jwtToken)
    return decoded;
  } else {
    return null;
  }
};


export const getUser = async () => {
  let userData = await AsyncStorage.getItem("USER-DATA");
  if (userData) {
    return JSON.parse(userData);
  } else {
    
    return null;
  }
};

export const getDoctorWithBankDetails = async (doctorId) => {
  console.log('here all data is ',`${url}/doctor-detail/${doctorId}`)
  return await axios.get(`${url}/doctor-detail/${doctorId}`);
};


export const getJwt = async () => {
  let jwtToken = await AsyncStorage.getItem(AUTH_TOKEN);
  if (jwtToken) {
    return jwtToken;
  } else {
    return null;
  }
};


export const deleteJwt = async () => {
  console.log('delete jwt is working')
  let response= await axios.post(`${url}/logout`);
  console.log(response.status==200);
  if(response.status==200){
    await AsyncStorage.removeItem(AUTH_TOKEN);
  }
  else{
    toastError("Logout Fail")
  }
  return true;
};




export const isUserLoggedIn = async () => {
  let response= await axios.get(`${url}/is-user-loggedIn`);
  return response;
};



export const AppVersioinCheck = async () => {
  let response= await axios.get(`${url}/version`);
  return response
};
