import React from 'react';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import NaviveBaseStyle from './NativeBaseStyle';

const { width, height } = Dimensions.get('window');

const Grad2 = (props) => {
    return (
        <NaviveBaseStyle>
            <LinearGradient
                // Background Linear Gradient
                colors={['#D6F1F85C', 'rgba(249, 223, 255, 0)', 'rgba(249, 225, 255, 0)', '#D6F1F85C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.34, 0.61, 1]}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    width,
                    height
                }}
            >
                <LinearGradient
                    // Background Linear Gradient
                    colors={['rgba(255, 255, 255, 0)', '#E9FDF647', '#FFE4E147', 'rgba(255, 255, 255, 0)']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    locations={[0, 0.34, 0.61, 1]}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        width,
                        height
                    }}
                >
                    {props.children}
                </LinearGradient>
            </LinearGradient>
        </NaviveBaseStyle>
    )
}

export default Grad2