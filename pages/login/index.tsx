import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right } from 'native-base';
import styled from 'styled-components';
import { AWS } from '../../lib/aws';
import Grad1 from '../../components/backgrounds/grad1';
import Logo from '../../components/design/Logo';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFFFF",
    width
  },
  content: {
    display: "flex",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width
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
  width: 315,
  height: 876,
});

const BoxUpper = styled.div({
  height: "50%",
  display: "flex",
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const BoxLower = styled.div({
  height: "50%"
});

const Login = ({ init }) => {
  const [mode, setMode] = useState(null);
  const [details, setDetails] = useState({});
  useEffect(() => {
    if (!mode) {
      AWS.current()
        .then(u => {
          setMode(init || !!u ? 1 : 0)
        })
        .catch(e => {
          setMode(init || 0)
        })
    }
  });

  function changeMode(n: number) {
    setMode(n);
    console.log(mode);
  }

  const renderMode = () => {
    switch (mode) {
      case 0:
        return <NotLoggedIn onChange={changeMode} />;
      case 1:
        return <SignUp onChange={changeMode} />
      case 2:

      default:
        return <div>Nothing</div>;
    }
  }

  return (
    <Grad1>
      {renderMode()}
    </Grad1>
  )
}

export default Login

// Components

const NotLoggedIn = ({ onChange }) => {

  return (
    <Container style={styles.container}>
      <Content contentContainerStyle={styles.content}>
        <Holder>
          <BoxUpper>
            <Logo width={240} tone="color" />
          </BoxUpper>
          <BoxLower>
            <Button block rounded onPress={() => onChange(1)}>
              <Text>SIGN UP</Text>
            </Button>
            <Button block rounded light style={{ marginTop: 10 }} onPress={() => onChange(2)}>
              <Text>LOG IN</Text>
            </Button>
          </BoxLower>
        </Holder>
      </Content>
    </Container>
  )
}

const SignUp = ({ onChange }) => {
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent>
            <Icon name='arrow-back' />
          </Button>
        </Left>
        <Body>
          <Title>Create an account</Title>
        </Body>
        <Right />
      </Header>
      <Content>

      </Content>
    </Container>
  )
}