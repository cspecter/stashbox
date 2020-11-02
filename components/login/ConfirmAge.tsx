import React, { useState } from 'react';
import { StyleSheet, Text, Dimensions } from 'react-native';
import { Button, Container, Content, Header, Left, Body, Title, Right, H1 } from 'native-base';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {  Row, Grid } from 'react-native-easy-grid';
import { AWS } from '../../lib/aws';
import {styles} from '../../styles/styles'

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
    } catch (err) {
      console.log(err);
      setError(err.message)
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

export default ConfirmAge

