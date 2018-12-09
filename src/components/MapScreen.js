import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Image,
    Platform,
    SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import {
    locationChanged,
    getCurrentLocation,
    getInputData,
    getAddressPredictions,
    getSelectedAddress,
    fetchSanJoseAPI
} from '../actions';

import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import MapContainer from "./MapContainer";
import DataTable from "./DataTable";
import GarList from "./GarList";
import SearchBar from "./SearchBar";

import styles from "./Styling.style.js";


class MapScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            garageList: null,
            garageListLoaded: false,
            mapRef: null
        }
    }

    onSwipeRight = (state) => {
        if(state.x0 < 40){
            this.props.navigation.openDrawer();
        }
    }


    render() {

          <View style={styles.container}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              //props error on region, expected number but got object
              //error doesnt have big effect/matter but gives a warning
              region={this.state.screenCoord}
             //  customMapStyle={MidnightCommander}
              onLayout={this.onMapLayout}
              ref={(instance) => {
                this.mapRef = instance;
              }}
            >
            {console.log(this.state.description)}
              { this.state.isMapReady && 
                <View >
                  <Marker.Animated 
                    coordinate={this.state.coordinate}
                    //Description is not being displayed
                    //description={this.state.description}
                    description={'Your Destination'}
                    image={banana}
                    style={styles.markerStyle}
                  />
                  <Marker 
                    coordinate={{ latitude, longitude }}
                    description={'Current Location'}
                    image={carMarker}
                    style={styles.locationStyle}
                  />
                  <Marker
                    coordinate={{ latitude: 37.339222, longitude: -121.880724, }}
                    //Can later pull coord, title, descrip from API when implemented
                    title={'SJSU North Parking Garage'}
                    description={'Spots Filled: 977/1490'}
                    image={spotMarker}
                    style={styles.markerStyle}
                  />
                  <Marker
                    coordinate={{ latitude: 37.332303, longitude: -121.882986, }}
                    title={'SJSU West Parking Garage'}
                    description={'Spots Filled: 827/1135'}
                    image={spotMarker}
                    style={styles.markerStyle}
                  />
                  <Marker
                    coordinate={{ latitude: 37.333088, longitude: -121.880797, }}
                    title={'SJSU South Parking Garage'}
                    description={'Spots Filled: 1377/1500'}
                    image={spotMarker}
                    style={styles.markerStyle}
                  />
                </View> 
              }
            </MapView>
            
            <GooglePlacesAutocomplete 
              placeholder='Search a location or garage!' 
              minLength={2} //Minimum length of text entered for autocomplete results
              autoFocus={false}
              listViewDisplayed='false'
              returnKeyType={'default'}
              fetchDetails
              renderDescription={row => row.description}
              onPress={(data, details = null) => {
                this.changeLoc(details.geometry.location.lat, details.geometry.location.lng);
                return details;
              }}
              getDefaultValue={() => ''}
              query={{ key: 'AIzaSyAknyin7pzbkZ89IRg6QeQ0gC2sVjSKRpY' }}
              styles={{
                textInputContainer: {
                  width: '100%',
                  backgroundColor: '#42b8ba',
                  //backgroundColor: 'transparent'
                  zIndex: 99
                },
                listView: {
                  position: 'absolute',
                  backgroundColor: 'white',
                  //backgroundColor: 'transparent',
                  // height: Dimensions.get('window').height,
                  zIndex: 99,
                  top: 40
                },
                description: {
                  fontWeight: 'bold',
                  fontSize: 18,
                  height: 40
                  //color: 'white'
                },
              }}
            /> 
          </View>
        </View>
      );
    }
}


export default MapScreen;
