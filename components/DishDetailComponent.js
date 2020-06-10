import React, {Component} from "react";
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Alert, PanResponder } from 'react-native';
import {Button,Rating,Input} from "react-native-elements";
import { Card,Icon } from "react-native-elements";
import { withNavigation } from "react-navigation";
import {connect} from "react-redux";
import {baseUrl} from "../shared/baseUrl";
import {postFavourite} from "../redux/ActionCreators";
import {postComment} from "../redux/ActionCreators";
import * as Animatable from "react-native-animatable";

const mapStateToProps = state => {
    return{
        dishes: state.dishes,
        comments: state.comments,
        favourites: state.favourites
    }
}

const mapDispatchtoProps = dispatch => ({
    postFavourite: (dishId) => dispatch(postFavourite(dishId)),
    postComment: (dishId,rating,author,comment) => dispatch(postComment(dishId,rating,author,comment))
});

function RenderDish(props) {
    const dish = props.dish;

    handleViewRef = ref => this.view=ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -20 )
            return true;
        else
            return false;
    }

    const recognizeComment = ({moveX, moveY, dx, dy}) => {
        if(dx>20)
            return true;
        else 
            return false;
    }

    const panResponder = React.useRef(
        PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished?"finished":"cancelled"));
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );
            else if(recognizeComment(gestureState))
            {
                console.log("Comment gesture recognized.");
                props.addComm();
            }

            return true;
        }
    })
    ).current;

    if(dish!=null) {
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers}
            >           
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={styles.flexBox}>
                        <Icon
                            style={styles.flexItem}
                            raised={true}
                            reverse={true}
                            name={ props.favourite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favourite ? console.log('Already favourite') : props.onPress()}
                        />
                        <Icon
                            style={styles.flexItem}
                            raised={true}
                            reverse={true}
                            name="pencil"
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.addComm()}
                        />
                    </View>
                </Card>
            </Animatable.View>
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
                <Text>
                <Rating
                    readonly
                    startingValue={item.rating}
                    imageSize={10}
                />
                </Text>
                <Text style={{fontSize:12}}>
                    {"--" + item.author + ", " + item.date}
                </Text>
            </View>
        );
    }

    return(
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList 
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

class DishDetail extends Component {

    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            rating: 5,
            author: "",
            comment: "",
        }   
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavourite(dishId) {
        this.props.postFavourite(dishId);
    }

    toggleModal() {
        this.setState({
            showModal: !this.state.showModal
        });
    }

    handleComment(dishId) {
        // console.log(dishId+this.state.rating+this.state.author+this.state.comment);
        this.toggleModal();
        this.props.postComment(dishId,this.state.rating,this.state.author,this.state.comment);    
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favourite={this.props.favourites.some(el => el === dishId)}
                    onPress={() => this.markFavourite(dishId)} 
                    addComm={() => this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal 
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                >
                    <View style={styles.modal}>
                        <Rating 
                            showRating
                            reviewColor="yellow"
                            reviews={["Rating:1/5","Rating:2/5","Rating:3/5","Rating:4/5","Rating:5/5"]}
                            startingValue={5}
                            defaultRating={5}
                            minValue={1}
                            ratingCount={5}
                            onFinishRating={(value) => this.setState({rating:value})}
                            onValueChange={(value) => this.setState({rating:value})}
                        />
                        <Input
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            onChangeText={(text) => this.setState({ author: text})}
                        />
                        <Input
                            placeholder='Comment'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={(text) => this.setState({ comment: text })}
                        />
                        <Button 
                            onPress = {() => {this.handleComment(dishId)}}
                            title="SUBMIT"
                            type="solid"
                            buttonStyle={{
                                backgroundColor:"#512DA8"
                            }}
                            titleStyle= {{
                                fontSize:14,
                            }}
                        />
                        <Button 
                            onPress = {() => {this.toggleModal()}}
                            title="CANCEL"
                            type="solid"
                            buttonStyle={{
                                backgroundColor:"grey",
                                marginTop:30,
                            }}
                            titleStyle= {{
                                fontSize:14,
                            }}
                        />
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    flexBox: {
        flexDirection: "row",
        justifyContent:"center",
        alignSelf:"center",
    },
    flexItem: {
        flex:1
    },
    modal: {
        justifyContent:"center",
        margin:20,
        marginTop:50
    },
    modalTitle: {
        fontSize: 24,
        fontWeight:"bold",
        backgroundColor:"#512DA8",
        textAlign:"center",
        color:"white",
        marginBottom:20
    },
    modalText: {
        fontSize: 18,
        margin:10
    }
});

export default withNavigation(connect(mapStateToProps,mapDispatchtoProps)(DishDetail));