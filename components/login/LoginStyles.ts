import { StyleSheet, Dimensions } from 'react-native';
import styled from 'styled-components';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
      backgroundColor: "rgba(0,0,0,0)",
      width
    },
    content: {
      display: "flex",
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width,
      flex: 1
    },
    headline: {
      fontSize: 32,
    },
    text: {
      fontSize: 16,
    },
    bcontainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    button: {
      margin: 2,
    },
    f1: {
      flex: 1
    },
    item: { marginTop: 10 },
    grid: {
      width,
      height: "100%",
      maxWidth: 315,
      maxHeight: 876,
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    center2: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      flex: 2
    },
    bottom: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }
  });

  export const FormBox = styled.div({
    marginTop: 78,
    width: '100%',
    flex: 1
  });