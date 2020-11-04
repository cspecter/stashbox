import React from 'react';
import NativeBaseStyle from './NativeBaseStyle';
import Grad1 from './Grad1'
import Grad2 from './Grad2';

const Backgrounds = (props) => {

    if (props.background === "Grad1") {
        return (
            <NativeBaseStyle>
                <Grad1>
                    {props.children}
                </Grad1>
            </NativeBaseStyle>
        )
    } else if (props.background === "Grad2") {
        return (
            <NativeBaseStyle>
                <Grad2>
                    {props.children}
                </Grad2>
            </NativeBaseStyle>

        )
    } else {
        return (
            <NativeBaseStyle>
                {props.children}
            </NativeBaseStyle>
        )
    }

}

export default Backgrounds;