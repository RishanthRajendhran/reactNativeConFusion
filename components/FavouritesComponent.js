import React, { Component } from 'react';
import { FlatList, View, Text,Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import {withNavigation} from "react-navigation";
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import Swipeout from "react-native-swipeout";
import {deleteFavourite} from "../redux/ActionCreators";
import * as Animatible from "react-native-animatable";

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      favourites: state.favourites
    }
  }

const mapDispatchToProps = dispatch => ({
    deleteFavourite: (dishId) => dispatch(deleteFavourite(dishId))
});

class Favourites extends Component {

    static navigationOptions = {
        title: 'My Favourites'
    };

    render() {

        const { navigate } = this.props.navigation;
        
        const renderMenuItem = ({item, index}) => {

            const rightButton = [
                {
                    text: 'Delete', 
                    type: 'delete',
                    onPress: () => {
                        Alert.alert(
                            "Delete Favourite",
                            "Are you sure you wish to delete the dish "+item.name+" from your favourites?",
                            [
                                {
                                    text: "Cancel",
                                    style: "cancel",
                                    onPress: () => console.log("The Dish "+item.name+" was not deleted from 'My Favourites'")
                                },
                                {
                                    text: "OK",
                                    onPress: () => this.props.deleteFavourite(item.id)
                                }
                            ],
                            {cancelable:false}
                        );
                    }
                }
            ];

            return (
                <Swipeout right={rightButton} autoClose={true}>
                    <Animatible.View animation="fadeInRightBig" duration={2000} delay={1000}>
                        <ListItem
                            key={index}
                            title={item.name}
                            subtitle={item.description}
                            hideChevron={true}
                            onPress={() => navigate('Dishdetail', { dishId: item.id })}
                            leftAvatar={{ source: {uri: baseUrl + item.image}}}
                        />
                    </Animatible.View>
                </Swipeout>
            );
        };

        if (this.props.dishes.isLoading) {
            return(
                <Loading />
            );
        }
        else if (this.props.dishes.errMess) {
            return(
                <View>            
                    <Text>{this.props.dishes.errMess}</Text>
                </View>            
            );
        }
        else {
            return (
                <FlatList 
                    data={this.props.dishes.dishes.filter(dish => this.props.favourites.some(el => el === dish.id))}
                    renderItem={renderMenuItem}
                    keyExtractor={item => item.id.toString()}
                />
            );
        }
    }
}


export default withNavigation(connect(mapStateToProps,mapDispatchToProps)(Favourites));