import React, {useEffect, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import axios from 'axios';
import {useRouter} from 'expo-router';
import BoxButton from '../components/BoxButton';
import Header from '../components/Header';
import styles from '../views/Home/styles';
import SentianceCore from '@sentiance-react-native/core';
import constants from '../constants';

const requestAuthCode = async () => {
  console.log('Fetching auth code from the sample backend service');
  return await axios.get(`${constants.BASE_URL}/auth/code`);
};

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    SentianceCore.userExists().then((exists: boolean) => {
      if (exists) {
        router.replace('/dashboard');
      }
    });
  }, []);

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const authCodeResponse = await requestAuthCode();
      const {auth_code: authCode} = authCodeResponse.data;
      const createUserResult = await SentianceCore.createUser({
        authCode,
        platformUrl: constants.PLATFORM_URL,
      });
      console.log(
        'Created a new user with the following ID: ',
        createUserResult.userInfo.userId,
      );

      try {
        const result = await SentianceCore.enableDetections();
        console.log('Detections are now ' + result.detectionStatus);
      } catch (err: any) {
        console.log(err.code);
      }
      setLoading(false);
      router.replace('/dashboard');
    } catch (err: any) {
      console.log('error:' + err.code + ' ' + 'message: ' + err.message);
      setLoading(false);
      Alert.alert(`Error: ${err}`);
    }
  };

  return (
    <>
      <Header />
      <View style={styles.contentView}>
        <View style={styles.helloTextView}>
          <Text style={styles.helloText}>Hello there!</Text>
        </View>
        <BoxButton
          inactive={loading}
          onPress={() => handleCreateUser()}
          title="Create SDK User"
        />
      </View>
    </>
  );
}
