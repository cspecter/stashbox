import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Dimensions } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styled from 'styled-components';
import { AWS } from '../../lib/aws';
import Grad1 from '../../components/backgrounds/grad1';
import Logo from '../../components/design/Logo';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0)",
    width
  },
  content: {
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
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
  f1: {
    flex: 1
  },
  item: { marginTop: 10 },
  grid: {
    width,
    height,
    maxWidth: 315,
    maxHeight: 876,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  bottom: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const Holder = styled.div({
  maxWidth: 315,
  maxHeight: 876,
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
        <Grid style={styles.grid}>
          <Row style={styles.center}>
            <Logo width={240} tone="color" />
          </Row>
          <Row style={styles.bottom}>
            <div style={{ flex: 1 }}>
              <Button block rounded onPress={() => onChange(1)} >
                <Text>SIGN UP</Text>
              </Button>
              <Button block rounded bordered dark onPress={() => onChange(2)} style={{ marginTop: 10 }}>
                <Text>LOG IN</Text>
              </Button>
            </div>
          </Row>
        </Grid>
      </Content>
    </Container>
  )
}

const FormBox = styled.div({
  marginTop: 78,
  width: '100%',
  flex: 1
});

const SignUp = ({ onChange, onSignedUp }) => {
  

  return (
    <Container style={styles.container}>
      <Header iosBarStyle={"light-content"} transparent>
        <Left>
          <Button transparent onPress={() => onChange(0)}>
            <Icon name='arrow-back' />
          </Button>
        </Left>
        <Body>
          <Title>Create an account</Title>
        </Body>
        <Right />
      </Header>
      <Content contentContainerStyle={styles.content}>
        <Grid style={styles.grid}>
          <Row style={styles.center}>
            <Text>
              <H1>Let's get started!</H1>
            </Text>
          </Row>
          <Row style={styles.center}>
            <FormBox>
              <Item rounded>
                <Input placeholder='Email' />
              </Item>
              <Item rounded style={styles.item}>
                <Input placeholder='Enter password' secureTextEntry={true} />
              </Item>
            </FormBox>
            <Text style={{flex: 1, textAlign: 'center'}}>
            By selecting Create Account I hearby agree to Stashbox’s Terms of Use and Privacy Policy.
            </Text>
          </Row>
          <Row style={styles.bottom}>
          <div style={{ flex: 1}}>
              <Button block dark rounded bordered onPress={() => onChange(1)} >
                <Text>CREATE ACCOUNT</Text>
              </Button>
            </div>
          </Row>
        </Grid>
      </Content>
    </Container>
  )
}