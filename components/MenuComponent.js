import React, {Component} from "react";
import {FlatList} from "react-native";
import { Tile } from "react-native-elements";
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { withNavigation } from "react-navigation";

const mapStateToProps = state => {
    return {
      dishes: state.dishes
    }
  }

class Menu extends Component{

    constructor(props){
        super(props);
    }

    static navigationOptions = {
        title: 'Menu'
    };

    render() {

        const {navigate} = this.props.navigation;

        const renderMenuItem = ({item,index}) => {
            return(
                <Tile 
                    key={index}
                    title={item.name}
                    caption={item.description}
                    featured
                    imageSrc={{uri: baseUrl + item.image}}
                    onPress={() => navigate('Dishdetail', { dishId: item.id })}
                />
            );
        };

        return(
            <FlatList 
                data={this.props.dishes.dishes}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id.toString()}
            />
        );
    }
}

export default withNavigation(connect(mapStateToProps)(Menu));