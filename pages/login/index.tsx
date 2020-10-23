import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Button } from 'native-base';
import styled from 'styled-components';
import { AWS } from '../../lib/aws';
import Wrapper from '../../components/wrapper/wrapper';
import Grad1 from '../../components/backgrounds/grad1';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width,
    height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "#FFFFFF"
  },
  headline: {
    fontSize: 32,
  },
  text: {
    fontSize: 16,
  },
  bcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    margin: 2,
  },
});

const Flex = styled.div({
  display: "flex",
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  width
});

const Holder = styled.div({
  width: 376
});

const Login = ({ init }) => {
  const [mode, setMode] = useState(0);
  const [details, setDetails] = useState({});
  useEffect(() => {
    AWS.current()
      .then(u => {
        setMode(init || !!u ? 1 : 0)
      })
      .catch(e => {
        setMode(init || 0)
      })
  });

  function changeMode() {

  }

  const renderMode = () => {
    switch (mode) {
      case 0:
        return <NotLoggedIn onChange={changeMode} />;
      default:
        return <div>Nothing</div>;
    }
  }

  return (
    <Wrapper>
      <Grad1>
        <Flex>
          {renderMode()}
        </Flex>
      </Grad1>
    </Wrapper>
  )
}

export default Login

// Components

const NotLoggedIn = ({ onChange }) => {

  return (
    <Holder>
      <Button block rounded light>
            <Text>Primary</Text>
      </Button>
    </Holder>
  )
}