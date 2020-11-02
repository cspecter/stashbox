import React from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../../components/MediaQueries'
import { Text } from 'react-native';
import { Button, Container, Content, Header, Left, Body, Title, Right, H1 } from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';
import {styles, ContentHolder} from '../../styles/styles'

const Landing = ({ onPick }) => {

    return (
        <Container style={styles.container}>
            <Header iosBarStyle={"light-content"} transparent>
                <Left>

                </Left>
                <Body>
                    <Title>Create a post</Title>
                </Body>
                <Right>

                </Right>
            </Header>
            <Content contentContainerStyle={styles.content}>
                <Grid style={styles.grid}>
                    <Row style={styles.center}>
                        <ContentHolder>
                            <Text>
                                <H1>Upload some media</H1>
                            </Text>
                        </ContentHolder>
                        <ContentHolder>
                            <Text>
                                You can import multiple files at once. Please check out our content guidelines for how to prepare media.
                    </Text>
                        </ContentHolder>
                        <ContentHolder>
                            <Button block dark rounded bordered onPress={onPick} >
                                <Text>SELECT FILES</Text>
                            </Button>
                        </ContentHolder>
                    </Row>
                </Grid>
            </Content>
        </Container>
    )
}

export default Landing