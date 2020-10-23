import React, { Component } from 'react';
import { Container, Content, Text, StyleProvider } from 'native-base';
import getTheme from '../../themes/native-base-theme-light/components';
import web from '../../themes/native-base-theme-light/variables/commonColor';

export default function NativeBaseStyle(props) {
    return (
        <StyleProvider style={getTheme(web)}>
            {props.children}
        </StyleProvider>
    )
}