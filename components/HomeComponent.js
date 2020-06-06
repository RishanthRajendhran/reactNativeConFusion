import React, {Component} from "react";
import {View, Text} from "react-native";
import {DISHES} from "../shared/dishes";

class Home extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            dishes: DISHES
        }
    }

    static navigationOptions = {
        title: "Home"
    }

    render() {
        return(
            <View>
                <Text>
                    Home Component
                </Text>
            </View>
        );
    }
}
export default Home;