import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    Dimensions,
    Animated,
    Image,
    Platform
} from 'react-native';
import axios from 'axios';

import { 
    slideUp,
    sendKey,
    slideDown
} from "../actions/slideActions"

import { connect } from "react-redux";

import { PerGarageInfo } from './PerGarageInfo';
import loadingImage from "../images/loading.gif";

import styles from "./Styling.style.js";


class GarList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            parkingsName: '',  //Null all gar info at first
            parkingsMax: 0,
            parkingsCurrent: 0,
            status: 0, //0 = not loaded, 1 = loading, 2 = loaded (for when gar info is loaded)
            bottom: new Animated.Value(-(styles.garList.containerStyle.height)),
        };
        this.slideUp = this.slideUp.bind(this);
        this.slideDown = this.slideDown.bind(this);
    }

    updateData(searchName) {
        console.log("Currently fetching data: " + searchName);
        this.setState({
            status: 1
        }, () => {
            axios.post('https://project-one-203604.appspot.com/garages/garage', {
                name: searchName //post request to which garage pin is selected
            }).then(res => {

                console.log('Found Garage Data: ' + searchName);


                this.setState({
                    parkingsName: res.data.name, //pull garage.name from API
                    parkingsMax: res.data.max, //pull max space from API
                    parkingsCurrent: res.data.current, //pull current spaces from API
                    status: 2
                }, function () {
                    console.log("State has changed");
                });

            });
        });

    }

    whenDoneLoading() {
        console.log("WhenDoneLoading");
        if (this.state.status == 2) { //if gar info is loaded
            console.log("PerGarageInfo Loaded, Status: " + this.state.status);
            return (
                <PerGarageInfo
                    spotsNum={this.state.parkingsCurrent} //set PerGarageInfo variables to api pulled data
                    garageName={this.state.parkingsName}
                    garageMax={this.state.parkingsMax}
                />
            );
        }
        else {
            return (
                <View style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: styles.garList.height
                }}>
                    <Image style={{
                        width: 50,
                        height: 50
                    }}
                        source={loadingImage} />
                </View>
            )
        }

    }

    slideUp() {
        if (Platform.OS == "android") {
            Animated.timing(this.state.bottom, {
                toValue: -(styles.garList.containerStyle.height - styles.garList.height),
                duration: 100
            }).start();
        }
        else {
            this.setState({
                bottom: -(styles.garList.containerStyle.height - styles.garList.height)
            });
        }

    }

    slideDown() {
        if (Platform.OS == "android") {
            Animated.timing(this.state.bottom, {
                toValue: -(styles.garList.containerStyle.height),
                duration: 100
            }).start();
            this.setState({
                status: 0
            });
        }
        else {
            this.setState({
                status: 0,
                bottom: -(styles.garList.containerStyle.height),
            });
        }
    }

    componentDidUpdate() {
        if (this.props.upClicked) {
            this.slideUp();
            this.updateData(this.props.keySearch);
            this.props.Up(false);
        }
        if (this.props.downClicked) {
            this.slideDown();
            this.props.Down(false);
        }
    }


    render() {
        return (
            <Animated.View style={[styles.garList.containerStyle, { bottom: this.state.bottom }]}>
                <View style={styles.garList.garageStyle}>
                    {this.whenDoneLoading()}


                </View>
            </Animated.View>
        )

    }
}

const mapStateToProps = (state) => {
    return {
        keySearch: state.mapPress.key,
        upClicked: state.mapPress.upClicked,
        downClicked: state.mapPress.downClicked
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        Down: (status) => {
            
            dispatch(slideDown(status))
        },
        Up: (status) =>{
            
            dispatch(slideUp(status))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(GarList);

