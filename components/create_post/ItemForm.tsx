import React, { useEffect, useState, useCallback } from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../MediaQueries'
import { StyleSheet, Text, Dimensions, Platform, Modal, Alert, Image, View, ScrollView, Switch } from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right, Item, Input, H1, H3, Root } from 'native-base';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styled from 'styled-components';
import { useRouter } from 'next/router'
import { AWS, getProducts, imageChecker, isImage, isVideo } from '../../lib';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { styles, FormItem, Seperator } from '../../styles/styles'
import SelectProducts from './SelectProducts'
import ProductMini from '../products/ProductMini';
import Toast from '../../themes/native-base-theme-light/components/Toast';

// Post creation and submission form
// TODO: Fix the add products button

const ItemForm = ({ media }) => {
    const [date, setDate] = useState(new Date());
    const [dateOn, setDateOn] = useState(false);
    const [modalOn, setModalOn] = useState(false);
    const [remModalOn, setRemModalOn] = useState(false);
    const [remItem, setRemItem] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const updateDate = (d) => {
        setDate(d);
    }

    const switchDate = () => {
        setDateOn(!dateOn);
    }

    function openModal() {
        setModalOn(true);
    }

    function closeModal() {
        setModalOn(false)
    }

    function onSelectProducts(sel) {
        setSelectedProducts(sel);
        setModalOn(false);
    }

    function getProducts() {
        let p = [];
        selectedProducts.forEach(item => {
            p.push(
                <ProductMini
                    item={item}
                    removeBadge
                    onRemove={onRemoveItem}
                />
            )
        });
        return p
    }

    function closeRemModal() {
        setRemModalOn(false);
    }

    function onRemoveItem(slug) {
        let p;
        selectedProducts.forEach(item => {
            if (item.slug === slug) p = item
        });
        setRemItem(p);
        setRemModalOn(true);
    }

    function removeProduct() {
        setRemModalOn(false);
        let p = [];
        selectedProducts.forEach(item => {
            if (item.slug !== remItem.slug) p.push(item)
        });
        setRemItem(null);
        setSelectedProducts(p);
    }

    return (
        <ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalOn}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <Root>
                    <SelectProducts
                        onSelectProducts={onSelectProducts}
                        closeModal={closeModal}
                    />
                </Root>

            </Modal>
            <Modal
                animationType="none"
                transparent={true}
                visible={remModalOn}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Grid>
                            <Row style={{paddingBottom: 10}}>
                                <Text>
                                    Do you want to remove {remItem && remItem.title}
                                </Text>
                            </Row>
                            <Row>
                                <Col style={{padding: 10}}>
                                    <Button block success onPress={closeRemModal}>
                                        <Text> No </Text>
                                    </Button>
                                </Col>
                                <Col style={{padding: 10}}>
                                    <Button block danger onPress={removeProduct}>
                                        <Text> Yes </Text>
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>
                    </View>
                </View>
            </Modal>
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
                    <Input placeholder="Add a message" />
                </Item>
            </FormItem>
            <FormItem>
                <Grid>
                    <Col>
                        <Switch
                            value={dateOn}
                            onValueChange={switchDate}
                        />
                    </Col>
                    <Col>
                        <Text style={{ color: dateOn ? "#000" : "#AAA" }}>
                            Schedule post
                        </Text>
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
                            disabled={!dateOn}
                            showTimeSelect
                        />
                    </Col>
                </Grid>
            </FormItem>
            <Seperator />
            {isVideo(media.uri) &&
                <FormItem>
                    Select a thumbnail image
                </FormItem>
            }
            <FormItem>
                <Text>
                    Associated Products
                </Text>
            </FormItem>
            <FormItem>
                {selectedProducts.length === 0 ?
                    <Button iconLeft onPress={openModal} >
                        <Icon type="FontAwesome" name="plus-square-o" />
                    </Button> :
                    <Grid>
                        <Row>
                            {getProducts()}
                        </Row>
                    </Grid>
                }
            </FormItem>
        </ScrollView>
    )
}

export default ItemForm