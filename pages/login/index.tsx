import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Dimensions } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1 } from 'native-base';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styled from 'styled-components';
import { AWS } from '../../lib/aws';
import Grad1 from '../../components/backgrounds/grad1';
import Logo from '../../components/design/Logo';
import { validate } from 'validate.js';

const { width, height } = Dimensions.get('window');

const constraints = {
  from: {
    email: {
      message: "^Please enter a valid email address."
    }
  }
};

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
    width,
    flex: 1
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
    height: "100%",
    maxWidth: 315,
    maxHeight: 876,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  center2: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 2
  },
  bottom: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
});

const Login = ({ init }) => {
  const [mode, setMode] = useState(null);
  const [params, setparams] = useState({ email: null, password: null, username: null });
  useEffect(() => {
    if (!mode) {
      AWS.current()
        .then(u => {
          setMode(init || !!u ? 0 : 0)
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

  function onSignedUp(params, user) {
    setparams(params);
    setMode(2);
  }

  async function onConfirmed() {
    try {
      await AWS.signIn(params);
      setMode(3);
    } catch (error) {
      console.log(error);
    }
  }

  function onAgeConfirm() {

  }

  const renderMode = () => {
    switch (mode) {
      case 0: // Not Logged In
        return <NotLoggedIn onChange={changeMode} />;
      case 1: // Sign up
        return <SignUp onChange={changeMode} onSignedUp={onSignedUp} />
      case 2: // Authenticate Email
        return <ConfirmEmail email={params.email} onConfirmed={onConfirmed} />
      case 3: // Confirm age on signup
        return <ConfirmAge onAgeConfirm={onAgeConfirm} />
      default:
        return <Container style={styles.container} />;
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
            <div style={{ flex: 1, width: "100%" }}>
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
              <Button transparent>
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

// Age verification

const ConfirmAge = ({ onAgeConfirm }) => {
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
  const FORMAT = 'MM/dd/yyyy';

  function updateDate(newDate) {
    setDate(newDate);
  }

  function parseDate(str, format, locale) {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  }

  function formatDate(date, format, locale) {
    return dateFnsFormat(date, format, { locale });
  }

  async function submitAge() {
    // 662840281498
    const diff = new Date().getTime() - date.getTime();
    const isOver21 = diff > 662840281498;
    try {
      await AWS.updateUserAge({ birthday: date.getTime(), isOver21 })

    } catch (error) {

    }
  }

  return (
    <Container style={styles.container}>
      <Header iosBarStyle={"light-content"} transparent>
        <Left />
        <Body>
          <Title>Verify your age</Title>
        </Body>
        <Right />
      </Header>
      <Content contentContainerStyle={styles.content}>
        <Grid style={styles.grid}>
          <Row style={styles.center2}>
          <Text>
              <H1>We need to see your confirm your age</H1>
            </Text>
            <img src="/id.svg" style={{ width: 198, height: "auto" }} />
            <div style={{ flex: 1 }}>
              <Text style={{ textAlign: 'center', paddingBottom: 30 }}>
                You need to be over 21 to view some content on Stashbox. Please enter you birthday so we can confirm your age.
              </Text>
            </div>
            <FormBox>
              <DayPickerInput
              formatDate={formatDate}
              format={FORMAT}
              parseDate={parseDate}
              placeholder={`${dateFnsFormat(new Date(), FORMAT)}`}
              onDayChange={date => setDate(date)} />
            </FormBox>
            <Text style={{ flex: 1, textAlign: 'center', color: 'red', height: 60, paddingTop: 10 }}>
              {error}
            </Text>
          </Row>
          <Row style={styles.bottom}>

            <div style={{ flex: 1, width: "100%" }}>
              <Button block dark rounded bordered onPress={() => submitAge()} >
                <Text>CONFIRM MY AGE</Text>
              </Button>
            </div>
          </Row>
        </Grid>
      </Content>
    </Container>
  )

}