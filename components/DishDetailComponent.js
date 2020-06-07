import React, {Component} from "react";
import {View, Text,FlatList,ScrollView} from "react-native";
import { Card,Icon } from "react-native-elements";
import { withNavigation } from "react-navigation";
import {connect} from "react-redux";
import {baseUrl} from "../shared/baseUrl";
import {postFavourite} from "../redux/ActionCreators";

const mapStateToProps = state => {
    return{
        dishes: state.dishes,
        comments: state.comments,
        favourites: state.favourites
    }
}

const mapDispatchtoProps = dispatch => ({
    postFavourite: (dishId) => dispatch(postFavourite(dishId))
});

function RenderDish(props) {
    const dish = props.dish;
    if(dish!=null) {
        return(
            <Card
            featuredTitle={dish.name}
            image={{uri: baseUrl + dish.image}}>
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <Icon
                    raised={true}
                    reverse={true}
                    name={ props.favourite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favourite ? console.log('Already favourite') : props.onPress()}
                />
            </Card>
        );
    }
    else {
        return(<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;
    const renderCommentItem = ({item,index}) => {
        return(
            <View key={index} style={{margin:10}}>
                <Text style={{fontSize:14}}>
                    {item.comment}
                </Text>
                <Text style={{fontSize:12}}>
                    {item.rating} Stars
                </Text>
                <Text style={{fontSize:12}}>
                    {"--" + item.author + ", " + item.date}
                </Text>
            </View>
        );
    }

    return(
        <Card title="Comments">
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class DishDetail extends Component {

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavourite(dishId) {
        this.props.postFavourite(dishId);
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favourite={this.props.favourites.some(el => el === dishId)}
                    onPress={() => this.markFavourite(dishId)} 
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}

export default withNavigation(connect(mapStateToProps,mapDispatchtoProps)(DishDetail));