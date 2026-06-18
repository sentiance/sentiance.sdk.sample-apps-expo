import React, {FC} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import Button from '../../components/Button';
import colors from '../../constants/colors';
import styles from './styles';
import {InitializationProps} from './typings';

const Initialization: FC<InitializationProps> = ({error, onRetry}) => {
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.title}>SDK initialization failed</Text>
        <Text style={styles.reason}>Reason: {error.reason}</Text>
        {!!error.message && <Text style={styles.message}>{error.message}</Text>}
        <View style={styles.retryButton}>
          <Button type="default" text="Retry" onClick={onRetry} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.progressText}>Initializing the Sentiance SDK…</Text>
    </View>
  );
};

export default Initialization;
