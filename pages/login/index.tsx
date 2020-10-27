import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Dimensions } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1 } from 'native-base';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Col, Row, Grid } from 'react-native-easy-grid';
import styled from 'styled-components';
import { AWS } from '../../lib/aws';
import Grad1 from '../../components/backgrounds/grad1';
import Logo from '../../components/design/Logo';
import { validate } from 'validate.js';
import { useRouter } from 'next/router'

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
  const [isOver21, setIsOver21] = useState(false);
  useEffect(() => {
    if (!mode) {
      AWS.current()
      .then(u => {
        setMode(init || !!u ? 7 : 0)
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
      await AWS.signInAfterSignUp(params);
      setMode(3);
    } catch (error) {
      console.log(error);
    }
  }

  function onAgeConfirm(val) {
    setIsOver21(val);
    setMode(4);
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
      case 4: //Sign Up completion
        return <SignUpFinish isOver21={isOver21} />
      case 5: // Sign in form
        return <SignInForm onChange={changeMode} />
      case 6: // Forgotten password
        return <ForgottenPasswordForm onChange={changeMode} />
      case 7: // Logged In
        return <LoggedIn onChange={changeMode} />
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

// Age verification

const ConfirmAge = ({ onAgeConfirm }) => {
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");

  function updateDate(newDate) {
    setDate(newDate);
  }

  async function submitAge() {
    // 662840281498
    const diff = new Date().getTime() - date.getTime();
    const isOver21 = diff > 662840281498;
    try {
      await AWS.updateUserAge({ birthday: date.getTime(), isOver21 })
      onAgeConfirm(isOver21);
    } catch (error) {
      console.log(error);
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
            <Text style={{ textAlign: "center" }}>
              <H1>We need to see your confirm your age</H1>
            </Text>
            <img src="/id.svg" style={{ width: 100, height: "auto", paddingTop: 30 }} />
            <div style={{ flex: 1, marginTop: 30 }}>
              <Text style={{ textAlign: 'center', paddingBottom: 10 }}>
                You need to be over 21 to view some content on Stashbox. Please enter you birthday so we can confirm your age.
              </Text>
            </div>
            <DatePicker
              selected={date}
              onChange={date => updateDate(date)}
              popperClassName="some-custom-class"
              popperPlacement="top-end"
              popperModifiers={{
                offset: {
                  enabled: true,
                  offset: "5px, 10px"
                },
                preventOverflow: {
                  enabled: true,
                  escapeWithReference: false,
                  boundariesElement: "viewport"
                }
              }}
            />
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

// Final Sign Up Confimation

const SignUpFinish = ({ isOver21 }) => {
  const router = useRouter()
  const message = isOver21 ? "Thanks for confirming that you are over 21. You are ready to go." : "You are not quite 21 yet. There is still a lot of enjoy on Stashbox.";

  function complete() {
    router.push("/")
  }

  return (
    <Container style={styles.container}>
      <Header iosBarStyle={"light-content"} transparent>
        <Left />
        <Body>
          <Title>All signed up</Title>
        </Body>
        <Right />
      </Header>
      <Content contentContainerStyle={styles.content}>
        <Grid style={styles.grid}>
          <Row style={styles.center2}>
            <Text style={{ textAlign: "center" }}>
              <H1>Welcome to Stashbox!</H1>
            </Text>
            <img src="/stashbox_icon.svg" style={{ width: 100, height: "auto", paddingTop: 30 }} />
            <div style={{ flex: 1, marginTop: 30 }}>
              <Text style={{ textAlign: 'center', paddingBottom: 10 }}>
                {message}
              </Text>
            </div>
          </Row>
          <Row style={styles.bottom}>
            <div style={{ flex: 1, width: "100%" }}>
              <Button block dark rounded bordered onPress={() => complete()} >
                <Text>LET'S GO!</Text>
              </Button>
            </div>
          </Row>
        </Grid>
      </Content>
    </Container>
  )
}

// Sign in form

const SignInForm = ({ onChange }) => {
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
      router.push("/")
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

// Forgotten password form
// TODO: Hook up the forgotten password form and confirmation pages

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

// Logged In

const LoggedIn = ({ onChange }) => {

  function name() {
    const user = AWS.cosmicUser();
    console.log(user.object.metadata.username);
    return user.object.metadata.username
  }

  async function logOut() {
    try {
      await AWS.signOut();
      onChange(0);
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <Container style={styles.container}>
      <Content contentContainerStyle={styles.content}>
        <Grid style={styles.grid}>
          <Row style={styles.center}>
            <Logo width={240} tone="color" />
            <Text style={{ marginTop: 30 }} >
              <H1>Welcome back {name()}</H1>
            </Text>
          </Row>
          <Row style={styles.bottom}>
            <div style={{ flex: 1, width: "100%" }}>
              <Button block rounded onPress={logOut} >
                <Text>LOG OUT</Text>
              </Button>
            </div>
          </Row>
        </Grid>
      </Content>
    </Container>
  )
}

