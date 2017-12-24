/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import LiveView from './src'

export default class App extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            showLive: false,
            err: undefined
        };
    }

    componentDidMount() {
        const oneArr = [
            {id:0, name: 'sam0'},
            {id:1, name: 'sam1'},
            {id:2, name: 'sam2'},
            {id:3, name: 'sam3'},
            {id:4, name: 'sam4'}
        ];
        const twoArr = [
            {id:0, name: 'sam0'},
            {id:5, name: 'Max5'},
            {id:6, name: 'Max6'},
            {id:7, name: 'Max7'},
            {id:2, name: 'sam2'}
        ];

        let mergeObj = {};
        [...oneArr, ...twoArr].map(v=>{
            mergeObj[v.id] = v
        });

        const mergeArr = Object.values(mergeObj);

        console.log(mergeArr);
    }

    handleJoin = () => {
        this.setState({
            showLive: true
        })
    };

    handleCancel = (err) => {
        this.setState({
            showLive: false,
            err
        })
    };

    render() {
        const {showLive, err} = this.state;
        if (showLive) {
            return (
                <LiveView
                    onCancel={this.handleCancel}
                />
            )
        } else {
            return (
                <View style={styles.container}>
                    {!!err &&
                    <Text>错误代码 {err}</Text>
                    }
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.handleJoin}
                    >
                        <Text style={{color:'#fff'}}>点击进入房间 开始视频</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    button: {
        height: 44,
        paddingHorizontal:20,
        backgroundColor:'#6A71DD',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 10
    }
});
