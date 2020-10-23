import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components';

const { width, height } = Dimensions.get('window');

const Wrapper = styled.div({
  width,
    height
});

export default (props) => (
  <Wrapper>
    {props.children}
  </Wrapper>
);