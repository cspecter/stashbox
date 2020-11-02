import React, { useState } from 'react';
import { Text } from 'react-native';
import { Button, Container, Content, Header, Left, Body, Title, Right, Item, Input, H1 } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';
import { AWS } from '../../lib/aws';
import {styles, FormBox} from './LoginStyles'

// Confirm email address

const ConfirmEmail = ({ email, onConfirmed }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function updateCode(code: string) {
    setCode(code);
  }

  async function submitCode() {
    if (code.length === 0) {
      setError("Please enter a code.")
    } else {
      setError("");
      try {
        const verify = await AWS.verifyEmail(email, code);
        onConfirmed();
      } catch (err) {
        setError("There was a problem verifying your email. Please re-enter the code.")
        console.log(err);
      }
    }
  }

  function resendVerification() {
    AWS.sendVerification(email);
    setError("We just resent your verification code. Please check your email.")
  }

  return (
    <Container style={styles.container}>
      <Header iosBarStyle={"light-content"} transparent>
        <Left />
        <Body>
          <Title>Verify your email</Title>
        </Body>
        <Right />
      </Header>
      <Content contentContainerStyle={styles.content}>
        <Grid style={styles.grid}>
          <Row style={styles.center}>
            <Text>
              <H1>Check your email</H1>
            </Text>
            <Text style={{ textAlign: 'center', marginTop: 30 }}>
              We just sent you an email with a verification code.
              </Text>
          </Row>
          <Row style={styles.center2}>
            <FormBox>
              <Item rounded>
                <Input
                  placeholder='Enter code'
                  onChangeText={text => updateCode(text)}
                />
              </Item>
            </FormBox>
            <Text style={{ flex: 1, textAlign: 'center', color: 'red', height: 60, paddingTop: 10 }}>
              {error}
            </Text>
            <div style={{ flex: 1 }}>
              <Button transparent onPress={resendVerification} >
                <Text>Resend verification email.</Text>
              </Button>
            </div>
          </Row>
          <Row style={styles.bottom}>

            <div style={{ flex: 1, width: "100%" }}>
              <Button block dark rounded bordered onPress={() => submitCode()} >
                <Text>VERIFY EMAIL</Text>
              </Button>
            </div>
          </Row>
        </Grid>
      </Content>
    </Container>
  )
}

export default ConfirmEmail
