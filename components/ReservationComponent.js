import React, {Component} from "react";
import {Text,View,ScrollView,StyleSheet,Picker,Switch,Button,Modal, Alert,Platform} from "react-native";
import {Card} from "react-native-elements";
import DatePicker from "react-native-datepicker";
import * as Animatable from "react-native-animatable";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';

class Reservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date: "",
            showModal: false
        }
    }
    static navigationOptions = {
        title: "Reserve Table"
    }

    // toggleModal() {
    //     this.setState({
    //         showModal: !this.state.showModal
    //     });
    // }

    handleReservation() {
        Alert.alert(
            "Your Reservation OK?",
            "Number of Guests: " + this.state.guests + "\nSmoking? " + this.state.smoking + "\nDate and Time: "+this.state.date,
            [
                {
                    text:"Cancel",
                    style:"cancel",
                    onPress: () => this.resetForm()
                },
                {
                    text:"OK",
                    onPress: () => {
                        this.presentLocalNotification(this.state.date);
                        if(this.obtainCalendarPermission())
                        {
                            this.addReservationToCalendar(this.state.date);
                        }
                        this.resetForm();
                    }
                }
            ],
            {cancelable:false}
        );
    }

    obtainCalendarPermission = async() => 
    {
        const calendarPermisson = await Permissions.askAsync(Permissions.CALENDAR);
        return (calendarPermisson.status==="granted");
    }

    addReservationToCalendar = async(date) => {

        let result = await Calendar.getCalendarsAsync();   
        Calendar.createEventAsync(result[0].id,{
            title: "Con Fusion Table Reservation",
            timeZone: 'Asia/Hong_Kong',
            location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong',
            startDate: new Date(Date.parse(date)),
            endDate: new Date(Date.parse(date) + 2*60*60*1000)
        });
    }

    resetForm() {
        this.setState({
            guests:1,
            smoking: false,
            date:""
        });
    }

    async ObtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if(permission.status !== "granted")
        {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if(permission.status !== "granted")
            {
                Alert.alert("Permission not granted to show notifications");
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.ObtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: "Your Reservation",
            body: "Reservation for " + date + " requested",
            ios: {
                sound: true,
              _displayInForeground: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: "#512DA8"
            }
        });
    }

    render() {
        return(
            <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
                <ScrollView>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>
                            Number of Guests
                        </Text>
                        <Picker 
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange = {(itemValue, itemIndex) => this.setState({guests: itemValue})}
                        >
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>
                            Smoking/Non-Smoking?
                        </Text>
                        <Switch 
                            style={styles.formItem}
                            value={this.state.smoking}
                            onTintColor="#512DA8"
                            onValueChange = {(value) => this.setState({smoking: value})}
                        >
                        </Switch>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>
                            Date and Time
                        </Text>
                        <DatePicker 
                            style={{flex:2,marginRight:20}}
                            date={this.state.date}
                            format=""
                            mode="datetime"
                            placeholder="select date and time"
                            minDate="2020-06-07"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: "absolute",
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange = {(date) => {this.setState({date:date})}}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button 
                            title="Reserve"
                            color="#512DA8"
                            // onPress={() => this.handleReservation()}
                            onPress = {() => this.handleReservation() }
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    {/* <Modal 
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.showModal}
                        //onDismiss={() => {this.toggleModal();this.resetForm()}}
                        //onRequestClose={() => {this.toggleModal();this.resetForm()}}
                    >
                        <View style={styles.modal}>
                            <Text style={styles.modalTitle}>
                                Your Reservation
                            </Text>
                            <Text style={styles.modalText}>
                                Number of Guests: {this.state.guests}
                            </Text>
                            <Text style={styles.modalText}>
                                Smoking? : {this.state.smoking? "Yes":"No"}
                            </Text>
                            <Text style={styles.modalText}>
                                Date and Time: {this.state.date}
                            </Text>
                            <Button 
                                onPress = {() => {this.toggleModal();this.resetForm()}}
                                color="#512DAB"
                                title="Close"
                            />
                        </View>
                    </Modal> */}
                </ScrollView>
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: "center",
        justifyContent: "center",
        flex:1,
        flexDirection:"row",
        margin:20
    },
    formLabel: {
        fontSize: 18, 
        flex:2
    },
    formItem: {
        flex:1
    },
    modal: {
        justifyContent:"center",
        margin:20,
        marginTop:40
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

export default Reservation;