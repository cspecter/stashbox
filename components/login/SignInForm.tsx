import React, { useState } from 'react';
import { Text } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1 } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';
import { AWS } from '../../lib/aws';
import { validate } from 'validate.js';
import { useRouter } from 'next/router'
import {styles, FormBox} from './LoginStyles'

const constraints = {
    from: {
      email: {
        message: "^Please enter a valid email address."
      }
    }
  };

// Sign in form

const SignInForm = ({ onChange, previousPage }) => {
  const router = useRouter()
  const [params, setParams] = useState({ email: null, password: null });
  const [error, setError] = useState("");

  function updateEmail(email: string) {
    let p = params;
    p["email"] = email;
    setParams(p);
    const validationResult = validate({ from: email }, constraints);
    setError(!!validationResult ? validationResult.from[0] : "");
  }

  function updatePassword(password: string) {
    let p = params;
    p["password"] = password;
    setParams(p);
  }

  async function signin() {
    let p = params;
    if (!p.email) {
      setError("Please enter an email address.")
    } else if (!p.password) {
      setError("Please enter a password.")
    } else {
      setError("");
      const user = await AWS.signIn(p);
      router.push(previousPage || "/")
    }
  }

  function forgot() {
    onChange(6)
  }

  return (
    <Container style={styles.container}>
      <Header iosBarStyle={"light-content"} transparent>
        <Left>
          <Button transparent onPress={() => onChange(0)}>
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

export default SignInForm