import {SdkInitializationError} from '@sentiance-react-native/core';

export interface InitializationProps {
  error: SdkInitializationError | null;
  onRetry: () => void;
}
