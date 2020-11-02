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
import Slider from '@react-native-community/slider';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import {styles, ContentHolder, PreviewItemHolder, PreviewControlsHolder, CropControls, ScaleControls, FormItem} from '../../styles/styles'

// Select Products

const SelectProducts = () => {

}

export default SelectProducts