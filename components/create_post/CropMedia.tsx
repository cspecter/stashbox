import React, { useState, useCallback } from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../../components/MediaQueries'
import {  Dimensions, View } from 'react-native';
import { Button, Icon } from 'native-base';
import Cropper from 'react-easy-crop';

import {CropControls, ScaleControls, FormItem} from '../../styles/styles'

const { width, height } = Dimensions.get('window');

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
                        name="crop-7-5"
                        style={{ fontSize: 40, color: aspect === 9 / 16 ? "#FFFFFF" : "blue", transform: "rotate(-90deg)" }}
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

export default CropMedia