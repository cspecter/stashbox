import React, { useState } from 'react';
import {  Text } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1 } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';
import { AWS } from '../../lib/aws';
import { validate } from 'validate.js';
import {styles, FormBox} from './LoginStyles'

// Forgotten password form
// TODO: Hook up the forgotten password form and confirmation pages

const constraints = {
    from: {
      email: {
        message: "^Please enter a valid email address."
      }
    }
  };

const ForgottenPasswordForm = ({ onChange }) => {
  const [email, setEmail] = useState(null);
  const [error, setError] = useState("");

  function updateEmail(email: string) {
    setEmail(email);
    const validationResult = validate({ from: email }, constraints);
    setError(!!validationResult ? validationResult.from[0] : "");
  }

  async function signin() {
    if (!email) {
      setError("Please enter an email address.")
    } else {
      setError("");
      const user = await AWS.signIn(p);
    }
  }

  function forgot() {
    onChange(6)
  }

  function updatePassword() {

  }

  return (
    <Container style={styles.container}>
      <Header iosBarStyle={"light-content"} transparent>
        <Left>
          <Button transparent onPress={() => onChange(5)}>
            <Icon name='arrow-back' />
          </Button>
        </Left>
        <Body>
          <Title>Sign in</Title>
        </Body>
        <Right />
      </Header>
      <Content contentContainerStyle={styles.content}>
        <Grid style={styles.grid}>
          <Row style={styles.center}>
            <Text>
              <H1>Welcome back!</H1>
            </Text>
          </Row>
          <Row style={styles.center2}>
            <FormBox>
              <Item rounded style={styles.item}>
                <Input
                  placeholder='Email'
                  onChangeText={text => updateEmail(text)}
                />
              </Item>
              <Item rounded style={styles.item}>
                <Input
                  placeholder='Enter password'
                  secureTextEntry={true}
                  onChangeText={text => updatePassword(text)}
                />
              </Item>
            </FormBox>
            <Text style={{ flex: 1, textAlign: 'center', color: 'red', height: 60, paddingTop: 10 }}>
              {error}
            </Text>
          </Row>
          <Row style={styles.bottom}>
            <div style={{ flex: 1 }}>
              <Button transparent onPress={forgot} >
                <Text>Forgot my password.</Text>
              </Button>
            </div>
            <div style={{ flex: 1, width: "100%" }}>
              <Button block dark rounded bordered onPress={() => signin()} >
                <Text>CREATE ACCOUNT</Text>
              </Button>
            </div>
          </Row>
        </Grid>
      </Content>
    </Container>
  )
}

export default ForgottenPasswordForm

