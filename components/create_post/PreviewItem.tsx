import React, { useState} from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../../components/MediaQueries'
import { Text, Image, Switch } from 'react-native';
import { Video } from 'expo-av';
import { Col, Grid } from 'react-native-easy-grid';
import { isImage, isVideo } from '../../lib';

import {styles, PreviewItemHolder, PreviewControlsHolder} from '../../styles/styles'

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

export default PreviewItem