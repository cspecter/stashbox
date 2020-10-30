import React from 'react';
import Grad1 from './Grad1';
import Grad2 from './Grad2';

const Backgrounds = (props) => {

    if (props.background === "Grad1") {
        return (
            <Grad1>
                {props.children}
            </Grad1>
        )
    } else if (props.background === "Grad2") {
        return (
            <Grad2>
                {props.children}
            </Grad2>
        )
    } else {
        return (
            <Grad1>
                {props.children}
            </Grad1>
        )
    }

}

export default Backgrounds;