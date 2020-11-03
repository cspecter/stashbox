import React, { useEffect, useState, useCallback } from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../../components/MediaQueries'
import { StyleSheet, Text, TouchableHighlight, FlatList, Dimensions, Modal, Alert, Platform, Image, View, ScrollView, Switch } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1, H3, Toast  } from 'native-base';
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
import { styles, ContentHolder, PreviewItemHolder, PreviewControlsHolder, CropControls, ScaleControls, FormItem } from '../../styles/styles'
import { getProducts } from '../../lib'
import ProductMini from '../products/ProductMini';

const { width, height } = Dimensions.get('window');

// Select Products

const SelectProducts = ({ onSelectProducts, closeModal }) => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        const initialFetch = async () => {
            try {
                const data = await getProducts();
                console.log(data);
                setProducts(data);
            } catch (err) {
                console.log(err)
            }
        }
        initialFetch();
    }, [])

    const itemSelect = (slug, selected)=>{
        let p = [...selectedProducts];
        const i = p.indexOf(slug);
        if (selected) {
            if (i === -1) p.push(slug);
        } else {
            if (i > -1) p = p.splice(i, 1);
        }

        if (p.length > 4) {
            Toast.show({
                text: "You can select only 4 items.",
                type: "warning",
                buttonText: "Okay",
                duration: 3000,
                position: "top"
              })
        } else {
            setSelectedProducts(p);
        }
    }

    const renderItem = ({ item }) => {
        return <ProductMini
            item={item}
            selectBadge
            isSelected={selectedProducts.indexOf(item.slug) > -1}
            onSelectChange={itemSelect}
        />;
    };

    const closeAnSelect = ()=>{
        if (selectedProducts.length > 0) {
            let sel = []
            products.forEach(p=>{
                if (selectedProducts.indexOf(p.slug) > -1) sel.push(p)
            })
            onSelectProducts(sel);
        } else {
            closeModal()
        }
    }

    return (
        <View style={stylesModal.centeredView}>
            <View style={stylesModal.modalView}>
                <Container style={styles.container}>
                    <Header iosBarStyle={"light-content"} transparent>
                        <Left>
                            <Button transparent onPress={closeModal}>
                                <Icon name='close' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Select products</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={closeAnSelect}>
                                <Icon name='checkmark' />
                            </Button>
                        </Right>
                    </Header>
                    <Content contentContainerStyle={styles.content}>
                        <FlatList
                            data={products}
                            renderItem={renderItem}
                            keyExtractor={item => item.slug}
                            columnWrapperStyle={stylesModal.list}
                            numColumns={2}
                            extraData={selectedProducts}
                        >

                        </FlatList>
                    </Content>
                </Container>
            </View>
        </View>
    )
}

const stylesModal = StyleSheet.create({
    list: {
        justifyContent: 'space-between'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        width,
        height
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: "100%",
        height: "100%"
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default SelectProducts