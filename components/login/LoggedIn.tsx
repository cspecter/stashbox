import React from 'react';
import { Text } from 'react-native';
import { Button, Container, Content, H1 } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';
import { AWS } from '../../lib/aws';
import Logo from '../../components/design/Logo';
import {styles} from './LoginStyles'

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

export default LoggedIn
