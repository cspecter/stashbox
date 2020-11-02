import React from 'react';
import { Text } from 'react-native';
import { Button, Container, Content, Header, Left, Body, Title, Right, H1 } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';
import { useRouter } from 'next/router'
import {styles} from '../../styles/styles'

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

export default SignUpFinish