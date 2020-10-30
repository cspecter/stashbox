import React, { useEffect, useState } from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../../components/MediaQueries'
import { StyleSheet, Text, Dimensions, Platform, Image, View, ScrollView, Switch } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1 } from 'native-base';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Cropper from 'react-easy-crop';
import WebCamera from './WebCamera';
import Grad2 from '../../components/backgrounds/Grad2';
import Backgrounds from '../../components/backgrounds/Backgrounds';
import styled from 'styled-components';
import { useRouter } from 'next/router'
import { AWS } from '../../lib/aws';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
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
        flex: 1
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width
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
        flexDirection: 'column',
        width
    },
    top: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column'
    }
});

const ImageHolder = styled.div({
    width: width < height ? width : height,
    height: width < height ? width : height,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
});

const SettingsHolder = styled.div({
    marginTop: 20
});

const ContentHolder = styled.div({
    marginTop: 20,
    flex: 1,
    width: "80%",
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
});

const PreviewItemHolder = styled.div({
    width: 350,
    height: 'auto',
    padding: 10
});

const CreatePost = () => {
    const router = useRouter();
    const [media, setMedia] = useState();
    const [user, setUser] = useState();
    const [mode, setMode] = useState(0);
    const [selectionType, setSelectionType] = useState();

    useEffect(() => {
        if (!user) {
            AWS.current()
                .then(u => {
                    setUser(u)
                })
                .catch(error => {
                    router.push('/login')
                })
        }
    })

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            allowsMultipleSelection: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setMedia(result.selected);
            setSelectionType('file');
            setMode(1);
        }
    };

    function renderMode() {
        switch (mode) {
            case 0:
                return <Landing onPick={pickImage} />
            case 1:
                return <SelectionPreview list={media} />
        }
    }

    if (!user) {
        return <View />
    }

    return (
        <Backgrounds background={'Grad2'} >
            {renderMode()}
        </Backgrounds>
    );
}

export default CreatePost

// Components

// Landing selection

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

// Selection preview

const SelectionPreview = ({ list }) => {

    function buildPreview() {
        let p = [];
        for (let i = 0; i < list.length; i++) {
            const m = list[i];
            p.push(
                <PreviewItem
                    uri={m.uri}
                    index={i}
                    onSwitch={onSwitch}
                    key={m.uri}
                />
            )
        }
        return p
    }

    function onSwitch() {

    }

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
                <ScrollView>
                    {buildPreview()}
                </ScrollView>
            </Content>
        </Container>
    )

}

const PreviewItem = ({ uri, index, onSwitch }) => {
    if (!isImage(uri) || !isVideo(uri)) {
        return <div />
    }

    return (
        <PreviewItemHolder>
            {isImage(uri) ?
                <Image source={{ uri }} style={{ height: "auto", width: "100%" }} /> :
                <Video
                    source={{ uri }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={true}
                    resizeMode="cover"
                    style={{ height: "auto", width: "100%" }}
                />
            }
        </PreviewItemHolder>
    )
}

// Cropper


// Post creation and submission form

const SubmissionForm = ({ image }) => {
    return (
        <ScrollView
            contentContainerStyle={{
                //flexGrow: 1,
                //justifyContent: 'space-between',
                //flex: 1,
            }}>
            <ImageHolder>
                {!image ?
                    <div style={{ flex: 1, height: "100%" }}>
                        <Button block dark rounded bordered onPress={pickImage} >
                            <Text>SELECT MEDIA</Text>
                        </Button>
                    </div> :
                    <Image source={{ uri: image }} style={{ height: "100%", width: "100%" }} />
                }
            </ImageHolder>
            <SettingsHolder>
                <Item underline>
                    <Input placeholder='Enter message' />
                </Item>
            </SettingsHolder>

        </ScrollView>
    )
}

// Methods

function isImage(uri) {
    return uri.substr(5, 5) === "image"
}

function isVideo(uri) {
    return uri.substr(5, 5) === "video"
}
