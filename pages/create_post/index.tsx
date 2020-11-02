import React, { useEffect, useState, useCallback } from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../../components/MediaQueries'
import { StyleSheet, Text, Dimensions, Platform, Image, View, ScrollView, Switch } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1, H3 } from 'native-base';
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
import Slider from '@react-native-community/slider';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
    },
    formViewer: {
        width: width < height ? width : height,
        height: width < height ? width : height,
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
    margin: 'auto',
    left: 0,
    right: 0,
    top: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
    zIndex: 10
});

const ScaleControls = styled.div({
    width: 350,
    height: 80,
    position: 'absolute',
    bottom: 40,
    display: "flex",
    margin: 'auto',
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: 'center',
    zIndex: 10
});

const FormItem = styled.div({
    marginTop: 10
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
            index={currIndex}
            length={media.length}
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

const CropMedia = ({ media, onEdit }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [aspect, setAspect] = useState(1)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        onEdit(croppedAreaPixels, aspect);
    }, [])

    return (
        <View style={{ width, height }} >
            <CropControls>
                <Button transparent large>
                    <Icon
                        type="MaterialIcons"
                        name='crop-square'
                        style={{ fontSize: 40, color: aspect === 1 ? "#FFFFFF" : "blue" }}
                        onPress={() => setAspect(1)}
                    />
                </Button>
                <Button transparent large>
                    <Icon
                        type="MaterialIcons"
                        name="crop-5-4"
                        style={{ fontSize: 40, color: aspect === 4 / 5 ? "#FFFFFF" : "blue", transform: "rotate(-90deg)" }}
                        onPress={() => setAspect(4 / 5)}
                    />
                </Button>
                <Button transparent large>
                    <Icon
                        type="MaterialIcons"
                        name="crop-portrait"
                        style={{ fontSize: 40, color: aspect === 9 / 16 ? "#FFFFFF" : "blue" }}
                        onPress={() => setAspect(9 / 16)}
                    />
                </Button>
            </CropControls>
            <ScaleControls>
                {/* <Slider
                    style={{ width: 200, height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    value={1}
                    onValueChange={setZoom}
                /> */}
            </ScaleControls>
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

const ItemForm = ({ media }) => {
    const [date, setDate] = useState(new Date());
    const [dateOn, setDateOn] = useState(false);

    const updateDate = (d)=>{
        setDate(d);
    }

    const switchDate = ()=>{
        setDateOn(!dateOn);
    }

    return (
        <ScrollView>
            {isImage(media.uri) ?
                <Image source={{ uri: media.uri }} style={styles.formViewer} /> :
                <Video
                    source={{ uri: media.uri }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={true}
                    style={styles.formViewer}
                    shouldPlay
                    isLooping
                    resizeMode={Video.RESIZE_MODE_CONTAIN}
                />
            }
            <FormItem>
                <Item underline>
                    <Input placeholder="Underline Textbox" />
                </Item>
            </FormItem>
            <FormItem>
                <Grid>
                    <Col>
                        Schedule post
                    </Col>
                    <Col>
                        <Switch 
                            value={dateOn}
                            onValueChange={switchDate}
                        />
                    </Col>
                    <Col>
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
                            disabled
                            showTimeSelect
                        />
                    </Col>
                </Grid>
            </FormItem>
            <FormItem>
                <Text>
                    <H3>
                        Select products
                    </H3>
                </Text>
            </FormItem>
        </ScrollView>
    )
}

// Select Products

const SelectProducts = () => {

}

// Form Holder

const SubmissionForm = ({ media, onReset, onConfirm, index, length }) => {
    const [item, setItem] = useState();
    const [mode, setMode] = useState(0);
    const [crop, setCrop] = useState();
    const [aspect, setAspect] = useState();
    const [title, setTitle] = useState(`Processing  ${index + 1}/${length}`)

    useEffect(() => {
        if (!item) {
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
                setTitle(`Formatting ${index + 1}/${length}`);
                setItem(media);
                setMode(1);
            }
        }
    })

    function cropSettings(c: any, a: number) {
        setAspect(a);
        setCrop(c);
    }

    function confirm() {
        switch (mode) {
            case 0:

            case 1:
                ImageManipulator.manipulateAsync(
                    media.uri, [
                    { crop }
                ], { compress: 1, format: ImageManipulator.SaveFormat.PNG }
                )
                    .then(res1 => {
                        ImageManipulator.manipulateAsync(
                            res1.uri, [
                            {
                                resize: { width: 1080 }
                            }
                        ], { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
                        )
                            .then(res => {
                                setItem(res);
                                setTitle(`Processing  ${index + 1}/${length}`);
                                setMode(0);
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        // TODO: Handle this error
                    })

        }
    }

    function renderMode() {
        switch (mode) {
            case 0:
                return <ItemForm
                    media={media}
                />
            case 1:
                return <CropMedia
                    media={item}
                    onEdit={cropSettings}
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
