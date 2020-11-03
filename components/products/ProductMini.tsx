import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ProductItemMini } from '../../styles/styles'
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Container, Header, Content, Badge, Icon, Button } from 'native-base';
import styled from 'styled-components';

const styles = StyleSheet.create({
    container: {
        margin: 10
    },
    title: {
        fontSize: 12,
        fontWeight: "bold",
        lineHeight: 14,
        letterSpacing: -0.24,
        color: "#4F4F4F",
        wigth: "50%",
        marginTop: 10
    },
    price: {
        fontSize: 12,
        fontWeight: "bold",
        lineHeight: 14,
        letterSpacing: -0.24,
        color: "#4F4F4F",
        marginTop: 10
    },
    image: {
        width: 150,
        height: 150,
        border: "1px solid rgba(0, 0, 0, 0.2)",
        boxSizing: "border-box",
        borderRadius: 10
    },
    brand: {
        fontSize: 12,
        lineHeight: 14,
        letterSpacing: -0.24,
        color: "#BDBDBD",
        marginTop: 10
    },
    productButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    badge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        textAlign: 'center'
    },
    unselectedBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        border: '2px solid #000'
    },
    selectedBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        textAlign: 'center',
        backgroundColor: 'green',
        border: '2px solid #000'
    },
    removeBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        textAlign: 'center',
        backgroundColor: 'red',
        border: '2px solid #000'
    },
    selectBadgeIconUnselected: {
        fontSize: 13,
        color: "#000",
        lineHeight: 20
    },
    selectBadgeIconSelected: {
        fontSize: 13,
        color: "white",
        lineHeight: 20
    }
});

export const ProductItemMiniBadgeBox = styled.div({
    top: -10,
    right: -10,
    position: 'absolute'
});

const ProductMini = ({ item, isSelected, selectBadge, onSelectChange, removeBadge, onRemove }) => {

    function onAction() {
        if (selectBadge) {
            const selectState = !isSelected;
            onSelectChange(item.slug, selectState);
        } else if (removeBadge) {
            onRemove(item.slug);
        }
    }

    function badges() {
        const areBadges = selectBadge || removeBadge;

        const selectBadgeIcon = isSelected ? "check" : "plus"

        if (areBadges) {
            return <ProductItemMiniBadgeBox>
                {selectBadge && <Badge style={isSelected ? styles.selectedBadge : styles.unselectedBadge}>
                    <Icon
                        type="FontAwesome"
                        name={selectBadgeIcon}
                        style={isSelected ? styles.selectBadgeIconSelected : styles.selectBadgeIconUnselected} />
                </Badge>}
                {removeBadge && <Badge style={styles.removeBadge}>
                    <Icon
                        type="FontAwesome"
                        name={"minus"}
                        style={styles.selectBadgeIconUnselected} />
                </Badge>}
            </ProductItemMiniBadgeBox>
        }
    }

    return (
        <ProductItemMini>
            <Button
                transparent
                style={styles.productButton}
                onPress={onAction}
            >
                <Image
                    source={item.metadata.image.url}
                    style={styles.image}
                />
                <Grid style={{ flexShrink: 0 }}>
                    <Row>
                        <Text style={styles.title}>
                            {item.title}
                        </Text>
                    </Row>
                    <Row>
                        <Text style={styles.price}>
                            ${item.metadata.price}
                        </Text>
                    </Row>
                    <Row>
                        <Text style={styles.brand}>
                            {item.metadata.brand.title}
                        </Text>
                    </Row>
                </Grid>
            </Button>
            {badges()}
        </ProductItemMini>
    )
}

ProductMini.propTypes = {
    item: PropTypes.object,
    isSelected: PropTypes.bool,
    selectBadge: PropTypes.bool,
    onSelectChange: PropTypes.func,
    removeBadge: PropTypes.bool,
    onRemove: PropTypes.func
};

export default ProductMini