import  { useReducer } from 'react';

import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1, H3, Text } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';
import { AWS } from '../../lib/aws';
import validator from 'validator';
import { styles, FormBox } from '../../styles/styles'
import { SignUpI } from '../../interfaces'

const USER_NAME = 'username';
const EMAIL = 'email';
const PASSWORD = 'password';

const initialState = {
    username: '',
    email: '',
    password: ''
};


function reducer(state, action) {
    switch (action.type) {
        case USER_NAME:
            if (action.payload === "") return { ...state, username: '' }
            return { ...state, username: action.payload };
        case EMAIL:
            const validationResult = validator.isEmail(action.payload); //=> true
            if (!validationResult) return { ...state, email: '' };
            return { ...state, email: action.payload };
        case PASSWORD:
            if (action.payload === "") return { ...state, password: '' };
            return { ...state, password: action.payload };
        default:
            throw new Error();
    }
}

async function register(state: SignUpI, onSignedUp) {
    if (state.username && state.email && state.password) {
        const user = await AWS.signUp(state);
        onSignedUp(state, user);
    }
}


const SignUp = ({ onChange, onSignedUp }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    

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
                                    onChangeText={text => dispatch({ type: USER_NAME, payload: text })}
                                />
                            </Item>
                            <Item rounded style={styles.item}>
                                <Input
                                    placeholder='Email'
                                    onChangeText={text => dispatch({ type: EMAIL, payload: text })}
                                />
                            </Item>
                            <Item rounded style={styles.item}>
                                <Input
                                    placeholder='Enter password'
                                    secureTextEntry={true}
                                    onChangeText={text => dispatch({ type: PASSWORD, payload: text })}
                                />
                            </Item>
                        </FormBox>

                        {/* <Text style={{ flex: 1, textAlign: 'center', color: 'red', height: 60, paddingTop: 10 }}>
                            {error}
                        </Text> */}




                    </Row>
                    <Row>
                        <Content style={{ flex: 1 }}>

                            {!state.username && errorJsxMessage("user name")}
                            {!state.email && errorJsxMessage("valid email")}
                            {!state.password && errorJsxMessage("password")}
                        </Content>
                    </Row>
                    <Row style={styles.bottom}>
                        <Content style={{ flex: 1 }}>
                            <Text style={{ textAlign: 'center', paddingBottom: 30 }}>
                                By selecting Create Account I hearby agree to Stashbox’s Terms of Use and Privacy Policy.
                            </Text>
                        </Content>
                        <Content style={{ flex: 1, width: "100%" }}>
                            <Button block dark rounded bordered
                                onPress={
                                    () => {
                                        // dispatch({ type: CREATE_ACCOUNT });
                                        register(state, onSignedUp);
                                    }
                                }>
                                <Text>CREATE ACCOUNT</Text>
                            </Button>
                        </Content>
                    </Row>
                </Grid>
            </Content>
        </Container>
    )
}


const errorJsxMessage = (_msg) => (
    <H3 style={{ flex: 1, textAlign: 'center', color: 'red', height: 60, paddingTop: 10 }}>
        Please enter a {_msg}
    </H3>
);
export default SignUp