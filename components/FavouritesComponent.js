import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import {withNavigation} from "react-navigation";
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import Swipeout from "react-native-swipeout";
import {deleteFavourite} from "../redux/ActionCreators";

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
                    onPress: () => this.props.deleteFavourite(item.id)
                }
            ];

            return (
                <Swipeout right={rightButton} autoClose={true}>
                    <ListItem
                        key={index}
                        title={item.name}
                        subtitle={item.description}
                        hideChevron={true}
                        onPress={() => navigate('Dishdetail', { dishId: item.id })}
                        leftAvatar={{ source: {uri: baseUrl + item.image}}}
                        />
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