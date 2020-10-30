import React, { useEffect, useState, useCallback } from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../../components/MediaQueries'
import { StyleSheet, Text, Dimensions, Platform, Image, View, ScrollView, Switch } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1 } from 'native-base';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Cropper from 'react-easy-crop';
import WebCamera from './WebCamera';
import Backgrounds from '../../components/backgrounds/Backgrounds';
import styled from 'styled-components';
import { useRouter } from 'next/router'
import { AWS, imageChecker } from '../../lib';
import * as ImageManipulator from 'expo-image-manipulator';

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
    },
    previewItem: {
        maxWidth: 350,
        maxHeight: 350,
        flex: 1
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
    height: 350,
    padding: 10,
    display: "flex",
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(200,200,200,0.25)'
});

const PreviewControlsHolder = styled.div({
    paddingTop: 10
});

const CropControls = styled.div({
    width: 376,
    height: 80,
    position: 'absolute',
    top: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
});

const CreatePost = () => {
    const router = useRouter();
    const [media, setMedia] = useState();
    const [user, setUser] = useState();
    const [mode, setMode] = useState(0);
    const [selectionType, setSelectionType] = useState();
    const [currIndex, setCurrIndex] = useState();

    useEffect(() => {
        if (!user) {
            AWS.current()
                .then(u => {
                    setUser(u)
                })
                .catch(error => {
                    console.log(error);
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

        if (!result.cancelled) {
            let res = result.selected;
            for (let i = 0; i < res.length; i++) {
                if (isImage(res[i].uri)) {
                    res[i]['desc'] = imageChecker(res[i].width, res[i].height)
                }
            }

            setMedia(res);
            setSelectionType('file');
            setMode(1);
        }
    };

    const [view, setView] = useState(<Landing onPick={pickImage} />);

    function reset() {
        setMedia(null);
        setMode(0);
    }

    function onConfirm(list) {
        setMedia(list);
        setCurrIndex(0);
        setMode(3);
    }

    function processMedia() {
        const m = media;
        return <SubmissionForm
            media={m[currIndex]}
            onReset={reset}
            onConfirm={postMedia}
        />
    }

    function postMedia() {

    }

    function renderMode() {
        switch (mode) {
            case 0:
                return <Landing onPick={pickImage} />
            case 1:
                return <SelectionPreview list={media} onConfirm={onConfirm} onReset={reset} />
            case 3:
                return processMedia()
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

const SelectionPreview = ({ list, onConfirm, onReset }) => {
    const [removes, setRemoves] = useState([]);

    function buildPreview() {
        let p = [];
        for (let i = 0; i < list.length; i++) {
            const m = list[i];
            p.push(
                <PreviewItem
                    uri={m.uri}
                    index={i}
                    onSwitch={onSwitch}
                    message={m.desc && m.desc.message}
                    key={m.uri}
                />
            )
        }
        return p
    }

    function onSwitch(val, i) {
        let a = removes;
        if (val && a.indexOf(i) > -1) {
            if (a.length === 1) {
                setRemoves([])
            } else {
                setRemoves(a.splice(a.indexOf(i), 1))
            }
        } else if (a.indexOf(i) === -1) {
            a.push(i);
            setRemoves(a)
        }
    }

    function confirm() {
        let arr = list;
        let r = removes;
        let final = [];
        for (let i = 0; i < list.length; i++) {
            if (r.indexOf(i) === -1) {
                final.push(arr[i])
            }
        }
        onConfirm(final);
    }

    return (
        <Container style={styles.container}>
            <Header iosBarStyle={"light-content"} transparent>
                <Left>
                    <Button transparent onPress={onReset}>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body>
                    <Title>Confirm selection</Title>
                </Body>
                <Right>
                    <Button transparent onPress={confirm}>
                        <Icon name='checkmark' />
                    </Button>
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

const PreviewItem = ({ uri, index, onSwitch, message }) => {
    const [isEnabled, setIsEnabled] = useState(true);

    function onToggle(val) {
        setIsEnabled(val);
        onSwitch(val, index)
    }

    if (!isImage(uri) && !isVideo(uri)) {
        return <div />
    }

    return (
        <PreviewItemHolder>
            {isImage(uri) ?
                <Image source={{ uri }} style={styles.previewItem} /> :
                <Video
                    source={{ uri }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={true}
                    style={styles.previewItem}
                    shouldPlay
                    isLooping
                    resizeMode={Video.RESIZE_MODE_CONTAIN}
                />
            }
            <PreviewControlsHolder>
                <Grid>
                    <Col>
                        <Text>
                            Use this media
                        </Text>
                    </Col>
                    <Col style={{ alignItems: 'flex-end' }}>
                        <Switch
                            onValueChange={val => { onToggle(val) }}
                            value={isEnabled}
                        />
                    </Col>
                </Grid>
                {message && <Text style={{ color: 'red', marginTop: 10 }}>
                    {message}
                </Text>}
            </PreviewControlsHolder>
        </PreviewItemHolder>
    )
}

// Cropper

const CropMedia = ({ media }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [aspect, setAspect] = useState(1)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        console.log(croppedArea, croppedAreaPixels)
    }, [])

    return (
        <View style={{ width, height }} >
            <CropControls>
                <Button transparent large>
                    <Icon
                        type="MaterialIcons"
                        name='crop-square'
                        fontSize={40} />
                </Button>
                <Button transparent large>
                    <Icon
                        type="MaterialIcons"
                        name="crop-5-4"
                        fontSize={40} />
                </Button>
                <Button transparent large>
                    <Icon
                        type="MaterialIcons"
                        name="crop-portrait"
                        fontSize={40} />
                </Button>
            </CropControls>
            <Cropper
                image={media.uri}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
            />
        </View>
    )
}

// Post creation and submission form

const SubmissionForm = ({ media, onReset, onConfirm }) => {
    const [item, setItem] = useState(media);
    const [mode, setMode] = useState(0);
    const [title, setTitle] = useState("Make a post")

    useEffect(() => {
        if (!item) {

        }
        if (media.desc && media.desc.resize) {
            ImageManipulator.manipulateAsync(media.uri, [{ resize: { width: media.desc.resizeWidth, height: media.desc.resizeHeight } }], { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG })
                .then(res => {
                    let i = media;
                    i.desc.resize = false;
                    i.uri = res.uri;
                    setItem(i);
                })
                .catch(err => {
                    console.log(err);
                    // TODO: Handle this error
                })
        } else if (media.desc && !media.desc.approved) {
            setTitle("Format this image");
            setItem(media);
            setMode(1);
        }
    })

    function confirm() {

    }

    function renderMode() {
        switch (mode) {
            case 0:
                return <View />
            case 1:
                return <CropMedia
                    media={item}
                />
        }
    }

    return (
        <Container style={styles.container}>
            <Header iosBarStyle={"light-content"} transparent>
                <Left>
                    <Button transparent onPress={onReset}>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body>
                    <Title>{title}</Title>
                </Body>
                <Right>
                    <Button transparent onPress={confirm}>
                        <Icon name='checkmark' />
                    </Button>
                </Right>
            </Header>
            <Content contentContainerStyle={styles.content}>
                {renderMode()}
            </Content>
        </Container>
    )
}

// Methods

function isImage(uri) {
    return uri.substr(5, 5) === "image"
}

function isVideo(uri) {
    return uri.substr(5, 5) === "video"
}
