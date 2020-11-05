import React, { useEffect, useState, useCallback } from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../../components/MediaQueries'
import { StyleSheet, Text, Dimensions, Platform, Image, View, ScrollView, Switch } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1, H3 } from 'native-base';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Backgrounds from '../../components/backgrounds/Backgrounds';
import { useRouter } from 'next/router'
import { AWS, imageChecker, isImage, isVideo } from '../../lib';

import {styles, ContentHolder, PreviewItemHolder, PreviewControlsHolder, CropControls, ScaleControls, FormItem} from '../../styles/styles'

import Landing from '../../components/create_post/Landing'
import SelectionPreview from '../../components/create_post/SelectionPreview'
import SubmissionForm from '../../components/create_post/SubmissionForm'

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
            user={user}
        />
    }

    function postMedia() {
        if ( media.length-1 > currIndex) {
            setCurrIndex(currIndex + 1);
        } else {
            console.log("All done");
            setMode(0)
            setMedia(null);
        }
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
