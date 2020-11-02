import React, { useEffect, useState, useCallback } from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../../components/MediaQueries'
import { StyleSheet, Text, Dimensions, Platform, Image, View, ScrollView, Switch } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1, H3 } from 'native-base';
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
import {styles} from '../../styles/styles'
import ItemForm from './ItemForm'
import CropMedia from './CropMedia'

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

export default SubmissionForm
