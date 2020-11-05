import React, { useEffect, useState, useCallback } from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../../components/MediaQueries'
import { Modal, StyleSheet, Text, Dimensions, Platform, Image, View, ScrollView, Switch } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Toast, Title, Right, Spinner, Item, Input, H1, H3, Root } from 'native-base';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Cropper from 'react-easy-crop';
import WebCamera from '../../components/create_post/WebCamera';
import Backgrounds from '../../components/backgrounds/Backgrounds';
import styled from 'styled-components';
import { useRouter } from 'next/router'
import { AWS, imageChecker, isImage, isVideo } from '../../lib';
import * as ImageManipulator from 'expo-image-manipulator';
import { styles } from '../../styles/styles'
import ItemForm from './ItemForm'
import CropMedia from './CropMedia'
import { createPost } from '../../lib/post_api'

// Form Holder

const SubmissionForm = ({ media, onReset, onConfirm, index, length, user }) => {
    const [item, setItem] = useState();
    const [mode, setMode] = useState(0);
    const [crop, setCrop] = useState();
    const [aspect, setAspect] = useState();
    const [title, setTitle] = useState(`Processing  ${index + 1}/${length}`)
    const [postParams, setPostParams] = useState();
    const [workingModalOn, setWorkingModalOn] = useState(false);

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
            } else {
                console.log("Media sized correctly")
                setTitle(`Processing ${index + 1}/${length}`);
                setItem(media);
            }
        }
    }, [])

    function cropSettings(c: any, a: number) {
        setAspect(a);
        setCrop(c);
    }

    function onUpdate(params) {
        setPostParams(params);
    }

    function toast(text: string, type: "danger" | "success" | "warning") {
        Toast.show({
            text,
            type,
            buttonText: "Okay",
            duration: 3000,
            position: "top"
        })
    }

    async function confirm() {
        switch (mode) {
            case 0:
                if (postParams) {
                    if (!postParams.user) {
                        toast("There is a problem, no user.", "warning")
                    } else if (!postParams.products || postParams.products.length === 0) {
                        toast("You need to select at least one product", "warning")
                    } else if (!postParams.image && !postParams.video && !postParams.external_video && !postParams.external_image) {
                        toast("There is a problem, no media. Please try again", "warning")
                    } else {
                        try {
                            setWorkingModalOn(true);
                            const post = await createPost(postParams);
                            setWorkingModalOn(false);
                            toast("Post upload success", "success");
                            onConfirm();
                        } catch (error) {
                            setWorkingModalOn(false);
                            console.log(error)
                            toast(error.message, "danger")
                        }
                    }
                }
            case 1:
                setWorkingModalOn(true);
                try {
                    const cropped = await ImageManipulator.manipulateAsync(
                        media.uri, [
                        { crop }
                    ], { format: ImageManipulator.SaveFormat.PNG }
                    );

                    const resized = await ImageManipulator.manipulateAsync(
                        cropped.uri, [
                        {
                            resize: { width: 1080 }
                        }
                    ], { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
                    );
                    setItem(resized);
                    setTitle(`Processing  ${index + 1}/${length}`);
                    setMode(0);
                    setWorkingModalOn(false);
                } catch (error) {
                    console.log(error);
                    setWorkingModalOn(false);
                    toast("There was a problem processing this image.", "danger")
                }

        }
    }

    function renderMode() {
        if (item) {
            switch (mode) {
                case 0:
                    return <ItemForm
                        media={item}
                        onUpdate={onUpdate}
                        user={user}
                    />
                case 1:
                    return <CropMedia
                        media={item}
                        onEdit={cropSettings}
                    />
            }
        } else {
            return <View />
        }
        
    }

    return (
        <Root>
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
                    <Modal
                        animationType="none"
                        transparent={true}
                        visible={workingModalOn}>

                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Spinner color='blue' />
                            </View>
                        </View>
                    </Modal>
                    {renderMode()}
                </Content>
            </Container>
        </Root>
    )
}

export default SubmissionForm
