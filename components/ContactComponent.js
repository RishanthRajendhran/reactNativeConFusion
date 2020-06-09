import React, {Component} from "react";
import {ScrollView, Text} from "react-native";
import {withNavigation} from "react-navigation";
import {Card} from "react-native-elements";
import * as Animatible from "react-native-animatable";

class Contact extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        title: "Contact Us"
    }

    render() {
        return(
            <ScrollView>
                <Animatible.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card
                    title="Contact Information"
                >
                    <Text style={{margin:10}}>
                        121, Clear Water Bay Road
                    </Text>
                    <Text style={{margin:10}}>
                        Clear Water Bay, Kowloon
                    </Text>
                    <Text style={{margin:10}}>
                        HONG KONG
                    </Text>
                    <Text style={{margin:10}}>
                        Tel: +852 1234 5678
                    </Text>
                    <Text style={{margin:10}}>
                        Fax: +852 8765 4321
                    </Text>
                    <Text style={{margin:10}}>
                        Email:confusion@food.net
                    </Text>
                </Card>
                </Animatible.View>
            </ScrollView>
        );
    }
}

export default withNavigation(Contact);