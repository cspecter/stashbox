import { StyleSheet, Dimensions } from 'react-native';
import styled from 'styled-components';

const { width, height } = Dimensions.get('window');

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
  },
  top: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column'
  },
  previewItem: {
    maxWidth: 350,
    maxHeight: 350,
    flex: 1
  },
  formViewer: {
    width: width < height ? width : height,
    height: width < height ? width : height,
    flex: 1
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  },
});

export const FormBox = styled.div({
  marginTop: 78,
  width: '100%',
  flex: 1
});

export const ContentHolder = styled.div({
  marginTop: 20,
  flex: 1,
  width: "80%",
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center'
});

export const PreviewItemHolder = styled.div({
  width: 350,
  height: 350,
  padding: 10,
  display: "flex",
  flex: 1,
  flexDirection: 'column',
  backgroundColor: 'rgba(200,200,200,0.25)'
});

export const PreviewControlsHolder = styled.div({
  paddingTop: 10
});

export const CropControls = styled.div({
  width: 376,
  height: 80,
  position: 'absolute',
  margin: 'auto',
  left: 0,
  right: 0,
  top: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: 'center',
  zIndex: 10
});

export const ScaleControls = styled.div({
  width: 350,
  height: 80,
  position: 'absolute',
  bottom: 40,
  display: "flex",
  margin: 'auto',
  left: 0,
  right: 0,
  alignItems: "center",
  justifyContent: 'center',
  zIndex: 10
});

export const FormItem = styled.div({
  marginTop: 10,
  paddingLeft: 10,
  paddingRight: 10
});

export const ProductItemMini = styled.div({
  width: 150,
  height: 250,
  margin: 10,
  position: 'relative'
});

export const Seperator = styled.div({
  width: '100%',
  height: 1,
  borderTop: "1px solid rgba(0,0,0,0.25)",
  marginTop: 5,
  marginBottom: 5
});