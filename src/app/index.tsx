import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'expo-router';
import SentianceCore, {
  SdkInitializationError,
} from '@sentiance-react-native/core';
import Initialization from '../views/Initialization';

export default function InitializationScreen() {
  const router = useRouter();
  const [error, setError] = useState<SdkInitializationError | null>(null);

  const awaitInitialization = useCallback(async () => {
    setError(null);
    try {
      await SentianceCore.ensureInitialized();
      router.replace('/home');
    } catch (e) {
      if (e instanceof SdkInitializationError) {
        setError(e);
      } else {
        setError(new SdkInitializationError('UNKNOWN', String(e)));
      }
    }
  }, [router]);

  useEffect(() => {
    awaitInitialization();
  }, [awaitInitialization]);

  return <Initialization error={error} onRetry={awaitInitialization} />;
}
