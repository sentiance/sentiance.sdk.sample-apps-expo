import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, Text, ScrollView, AppState} from 'react-native';
import {useRouter} from 'expo-router';
import styles from '../views/Dashboard/styles';
import CollectingData from '../components/CollectingData';
import Box from '../components/Box';
import InfoText from '../components/InfoText';
import Badge from '../components/Badge';
import TextView from '../components/TextView';
import Button from '../components/Button';
import Header from '../components/Header';
import SentianceCore, {type SdkInitState} from '@sentiance-react-native/core';
import {
  checkPermissions,
  getLocationStatus,
  getMotionStatus,
  permissionLocationRequest,
  permissionMotionRequest,
  permissionText,
  PermissionProps,
} from '../helpers/permissions';
import constants from '../constants';
import {openSettings} from 'react-native-permissions';

export default function DashboardScreen() {
  const router = useRouter();
  const [initState, setInitState] = useState<SdkInitState>('NOT_INITIALIZED');
  const [detectionStatus, setDetectionStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [responsePermission, setResponsePermission] = useState<PermissionProps>({} as PermissionProps);
  const appState = useRef(AppState.currentState);

  const refreshState = useCallback(async () => {
    const response = await checkPermissions();
    setResponsePermission(response);
    SentianceCore.getInitState().then((state: SdkInitState) => {
      setInitState(state);
    });
    SentianceCore.getSdkStatus().then((status: any) => {
      setDetectionStatus(status.detectionStatus);
    });
    SentianceCore.getUserId().then((id: any) => {
      setUserId(id);
    });
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        refreshState();
      }
      appState.current = nextAppState;
    });

    refreshState();

    return () => {
      subscription.remove();
    };
  }, [refreshState]);

  const openPermissions = async () => {
    if (!getLocationStatus(responsePermission)) {
      await permissionLocationRequest();
      await permissionMotionRequest();
    } else {
      openSettings();
    }
  };

  return (
    <>
      <Header />
      <ScrollView>
        <View style={styles.contentView}>
          <View style={styles.boxView}>
            <CollectingData
              status={
                initState === 'INITIALIZED' &&
                detectionStatus === constants.ENABLED_AND_DETECTING
                  ? 'success'
                  : 'error'
              }
            />
            <Box>
              <Badge status={initState} title="Init status" />
              <View style={styles.divider} />
              <Badge status={detectionStatus} title="Detection status" />
            </Box>
            <Box>
              <InfoText title="User ID" text={userId} isCopyable={true} />
            </Box>
            <View style={{position: 'relative'}}>
              <Box>
                <Text style={styles.permissionHeadingText}>
                  Permissions status
                </Text>
                <View style={styles.divider} />
                <TextView
                  type="LOCATION"
                  title="Location"
                  status={getLocationStatus(responsePermission)}
                />
                <View style={styles.divider} />
                <TextView
                  type="MOTION"
                  title="Motion"
                  status={getMotionStatus(responsePermission)}
                />
                <View style={styles.divider} />
                {getLocationStatus(responsePermission) ===
                  constants.PERMISSION_GRANTED &&
                getMotionStatus(responsePermission) ===
                  constants.PERMISSION_GRANTED ? (
                  <Text style={styles.permissionText}>
                    All permissions provided
                  </Text>
                ) : (
                  <Text style={styles.permissionTextError}>
                    {permissionText(
                      getLocationStatus(responsePermission),
                      getMotionStatus(responsePermission),
                    )}
                  </Text>
                )}
                {detectionStatus !== constants.ENABLED_AND_DETECTING && (
                  <Button
                    type="hollow"
                    onClick={openPermissions}
                    text="Give Permissions"
                  />
                )}
              </Box>
            </View>
            <View style={styles.buttonView}>
              <Button
                type="default"
                onClick={async () => {
                  await SentianceCore.reset();
                  router.replace('/');
                }}
                text="Reset SDK"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
