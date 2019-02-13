import React from 'react';
import { TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const BackButton = ({ onPress }) => {
    return (
      <TouchableNativeFeedback onPress={onPress}>
        <Icon name={'arrow-back'} size={24} color='#000' />
      </TouchableNativeFeedback>
    );
  };
