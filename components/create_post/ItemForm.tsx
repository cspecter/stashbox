import React, { useEffect, useState, useCallback } from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../MediaQueries'
import { StyleSheet, Text, Dimensions, Platform, Image, View, ScrollView, Switch } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1, H3 } from 'native-base';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styled from 'styled-components';
import { useRouter } from 'next/router'
import { AWS, imageChecker, isImage, isVideo} from '../../lib';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import {styles, FormItem} from '../../styles/styles'

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

export default ItemForm