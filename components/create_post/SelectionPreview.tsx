import React, { useState } from 'react';
import { Desktop, Tablet, Mobile, Default, TabletOrDesktop } from '../../components/MediaQueries'
import { ScrollView} from 'react-native';
import { Button, Container, Content, Header, Left, Icon, Body, Title, Right } from 'native-base';
import {styles} from '../../styles/styles'
import PreviewItem from './PreviewItem'

// Selection preview

const SelectionPreview = ({ list, onConfirm, onReset }) => {
    const [removes, setRemoves] = useState([]);

    function buildPreview() {
        let p = [];
        for (let i = 0; i < list.length; i++) {
            const m = list[i];
            p.push(
                <PreviewItem
                    uri={m.uri}
                    index={i}
                    onSwitch={onSwitch}
                    message={m.desc && m.desc.message}
                    key={m.uri}
                />
            )
        }
        return p
    }

    function onSwitch(val, i) {
        let a = removes;
        if (val && a.indexOf(i) > -1) {
            if (a.length === 1) {
                setRemoves([])
            } else {
                setRemoves(a.splice(a.indexOf(i), 1))
            }
        } else if (a.indexOf(i) === -1) {
            a.push(i);
            setRemoves(a)
        }
    }

    function confirm() {
        let arr = list;
        let r = removes;
        let final = [];
        for (let i = 0; i < list.length; i++) {
            if (r.indexOf(i) === -1) {
                final.push(arr[i])
            }
        }
        onConfirm(final);
    }

    return (
        <Container style={styles.container}>
            <Header iosBarStyle={"light-content"} transparent>
                <Left>
                    <Button transparent onPress={onReset}>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body>
                    <Title>Confirm selection</Title>
                </Body>
                <Right>
                    <Button transparent onPress={confirm}>
                        <Icon name='checkmark' />
                    </Button>
                </Right>
            </Header>
            <Content contentContainerStyle={styles.content}>
                <ScrollView>
                    {buildPreview()}
                </ScrollView>
            </Content>
        </Container>
    )

}

export default SelectionPreview