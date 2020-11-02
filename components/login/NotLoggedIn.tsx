import React from 'react';
import { Text } from 'react-native';
import { Button, Container, Content } from 'native-base';;
import { Row, Grid } from 'react-native-easy-grid';
import Logo from '../../components/design/Logo';
import {styles} from '../../styles/styles'

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

export default NotLoggedIn