import React, { useState } from 'react';
import { Text } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1 } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';
import { AWS } from '../../lib/aws';
import { validate } from 'validate.js';
import {styles, FormBox} from '../../styles/styles'

const constraints = {
    from: {
      email: {
        message: "^Please enter a valid email address."
      }
    }
  };

// Signup Screen

const SignUp = ({ onChange, onSignedUp }) => {
  const [params, setParams] = useState({ username: null, email: null, password: null });
  const [error, setError] = useState("");

  function updateUsername(username: string) {
    let p = params;
    p["username"] = username;
    setParams(p);
  }

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

  async function register() {
    let p = params;
    if (!p.username) {
      setError("Please enter a username.")
    } else if (!p.email) {
      setError("Please enter an email address.")
    } else if (!p.password) {
      setError("Please enter a password.")
    } else {
      setError("");
      const user = await AWS.signUp(p);
      onSignedUp(p, user);
    }
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
          <Row style={styles.center2}>
            <FormBox>
              <Item rounded>
                <Input
                  placeholder='Username'
                  onChangeText={text => updateUsername(text)}
                />
              </Item>
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
              <Text style={{ textAlign: 'center', paddingBottom: 30 }}>
                By selecting Create Account I hearby agree to Stashbox’s Terms of Use and Privacy Policy.
              </Text>
            </div>
            <div style={{ flex: 1, width: "100%" }}>
              <Button block dark rounded bordered onPress={() => register()} >
                <Text>CREATE ACCOUNT</Text>
              </Button>
            </div>
          </Row>
        </Grid>
      </Content>
    </Container>
  )
}

export default SignUp