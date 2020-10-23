import React from 'react';
import { Dimensions, View } from 'react-native';
import styled from 'styled-components';

const { width, height } = Dimensions.get('window');

const Wrapper = styled.div({
  width,
  height
});

export default (props) => (
  <View>
    {props.children}
  </View>
);