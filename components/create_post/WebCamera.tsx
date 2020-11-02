import React, { useEffect, useState, useRef } from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../MediaQueries'
import { StyleSheet, Text, Dimensions, Platform, Image, View, TouchableOpacity } from 'react-native';
//import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1 } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Cropper from 'react-easy-crop'
import { Camera, CameraType } from "react-camera-pro";
import styled from 'styled-components';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    camera: {
        width,
        height
    }
});

const Control = styled.div`
  position: fixed;
  display: flex;
  right: 0;
  width: 20%;
  min-width: 130px;
  min-height: 130px;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  box-sizing: border-box;
  flex-direction: column-reverse;
  @media (max-aspect-ratio: 1/1) {
    flex-direction: row;
    bottom: 0;
    width: 100%;
    height: 20%;
  }
  @media (max-width: 400px) {
    padding: 10px;
  }
`;

const Button = styled.button`
  outline: none;
  color: white;
  opacity: 1;
  background: transparent;
  background-color: transparent;
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-image: none;
  padding: 0;
  text-shadow: 0px 0px 4px black;
  background-position: center center;
  background-repeat: no-repeat;
  pointer-events: auto;
  cursor: pointer;
  z-index: 2;
  filter: invert(100%);
  border: none;
  &:hover {
    opacity: 0.7;
  }
`;

const TakePhotoButton = styled(Button)`
  background: url('https://img.icons8.com/ios/50/000000/compact-camera.png');
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  border: solid 4px black;
  border-radius: 50%;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const ChangeFacingCameraButton = styled(Button)`
  background: url(https://img.icons8.com/ios/50/000000/switch-camera.png);
  background-position: center;
  background-size: 40px;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  padding: 40px;
  &:disabled {
    opacity: 0;
    cursor: default;
    padding: 60px;
  }
  @media (max-width: 400px) {
    padding: 40px 5px;
    &:disabled {
      padding: 40px 25px;
    }
  }
`;

const ImagePreview = styled.div<{ image: string | null }>`
  width: 120px;
  height: 120px;
  ${({ image }) => (image ? `background-image:  url(${image});` : '')}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  @media (max-width: 400px) {
    width: 50px;
    height: 120px;
  }
`;

const WebCamera = ({ onCapturedImage }) => {
    const [numberOfCameras, setNumberOfCameras] = useState(0);
    const camera = useRef(null);
    const [image, setImage] = useState<string | null>(null);
    const [showImage, setShowImage] = useState<boolean>(false);

    return (
        <View style={{
            position: 'absolute',
            width,
            height,
            zIndex: 1,
        }}
        >
            <Camera
                ref={camera}
                aspectRatio="cover"
                numberOfCamerasCallback={setNumberOfCameras}
                errorMessages={{
                    noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                    permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                    switchCamera:
                        'It is not possible to switch camera to different one because there is only one video device accessible.',
                    canvas: 'Canvas is not supported.',
                }}
            />
            <Control>
                <ImagePreview
                    image={image}
                    onClick={() => {
                        setShowImage(!showImage);
                    }}
                />
                <TakePhotoButton
                    onClick={() => {
                        if (camera.current) {
                            const photo = camera.current.takePhoto();
                            console.log(photo);
                            setImage(photo);
                        }
                    }}
                />
                <ChangeFacingCameraButton
                    disabled={numberOfCameras <= 1}
                    onClick={() => {
                        if (camera.current) {
                            const result = camera.current.switchCamera();
                            console.log(result);
                        }
                    }}
                />
            </Control>
        </View>
    )
}

export default WebCamera;