import React, { Component } from 'react';
import { StyleProvider, Root } from 'native-base';
import getTheme from '../../themes/native-base-theme-light/components';
import common from '../../themes/native-base-theme-light/variables/commonColor';

export default function NativeBaseStyle(props) {
    return (
        <Root >
            <StyleProvider style={getTheme(common)}>
                {props.children}
            </StyleProvider>
        </Root>
    )
}