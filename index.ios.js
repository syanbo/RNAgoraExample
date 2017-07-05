/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';

const {width, height} = Dimensions.get('window');

import {RtcEngine, AgoraView} from 'react-native-agora'

export default class RNAgoraExample extends Component {

    constructor(props) {
        super(props);
        this.state = {
            remotes: [],
            isJoinSuccess: false,
            isSpeaker: false,
            isMute: false
        };
    }

    componentWillMount() {

        //初始化Agora
        const options = {
            appid: '324cbe8505a649bb9f157e6946fa832b',
            channelProfile: 1,
            videoProfile: 40,
            clientRole: 1,
        };
        RtcEngine.init(options);
    }

    componentDidMount() {

        //加入房间
        RtcEngine.joinChannel();

        //所以的原生通知统一管理
        RtcEngine.eventEmitter({
            onFirstRemoteVideoDecoded: (data) => {
                console.log(data);
                //有远程视频加入 返回重要的  uid  AgoraView 根据uid 来设置remoteUid值
                const {remotes} = this.state;

                let arr = [...remotes];
                let sign = false;
                arr.forEach(v => {
                    sign = v === data.uid
                });

                if (!sign) {
                    arr.push(data.uid)
                }

                this.setState({
                    remotes: arr
                })
            },
            onUserOffline: (data) => {
                console.log(data);
                //有人离开了！
                const {remotes} = this.state;

                let arr = [...remotes];

                let newArr = [];
                newArr = arr.filter(v => {
                    return v !== data.uid
                });

                this.setState({
                    remotes: newArr
                });
            },
            onJoinChannelSuccess: (data) => {
                console.log(data);
                //加入房间成功!
                this.setState({
                    isJoinSuccess: true
                });
            },
            onUserJoined: (data) => {
                console.log(data);
                //有人来了!
            },
            onError: (data) => {
                console.log(data);
                //错误!
                RtcEngine.leaveChannel();
            }
        })
    }

    componentWillUnmount() {
        RtcEngine.removeEmitter()
    }

    handlerCancel = () => {

        RtcEngine.leaveChannel();

    };

    handlerSwitchCamera = () => {
        RtcEngine.switchCamera();
    };

    handlerMuteAllRemoteAudioStreams = () => {
        this.setState({
            isMute: !this.state.isMute
        }, () => {
            RtcEngine.muteAllRemoteAudioStreams(this.state.isMute)
        })
    };

    handlerSetEnableSpeakerphone = () => {

        this.setState({
            isSpeaker: !this.state.isSpeaker
        }, () => {
            RtcEngine.setEnableSpeakerphone(this.state.isSpeaker)
        });

    };

    render() {

        const {isMute, isSpeaker, remotes, isJoinSuccess} = this.state;

        if (!isJoinSuccess) {
            return(
                <View style={{flex:1, backgroundColor:'#fff', justifyContent:'center', alignItems:'center'}}>
                    <Text>正在创建视频会议...</Text>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <AgoraView style={styles.localView} showLocalVideo={true} />
                <View style={styles.absView}>
                    <View style={styles.videoView}>
                        {remotes.map((v, k) => {
                            return (
                                <AgoraView
                                    style={styles.remoteView}
                                    key={k}
                                    remoteUid={v}
                                />
                            )
                        })}
                    </View>
                    <View>
                        <TouchableOpacity
                            style={{alignSelf: 'center'}}
                            onPress={this.handlerCancel}>
                            <Image
                                style={{width: 60, height: 60}}
                                source={require('./images/btn_endcall.png')}/>
                        </TouchableOpacity>
                        <View style={styles.bottomView}>
                            <TouchableOpacity onPress={this.handlerMuteAllRemoteAudioStreams} activeOpacity={.7}>
                                <Image
                                    style={{width: 50, height: 50}}
                                    source={ isMute ? require('./images/icon_muted.png') : require('./images/btn_mute.png')}/>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.handlerSwitchCamera} activeOpacity={.7}>
                                <Image
                                    style={{width: 50, height: 50}}
                                    source={ require('./images/btn_switch_camera.png')}/>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.handlerSetEnableSpeakerphone} activeOpacity={.7}>
                                <Image
                                    style={{width: 50, height: 50}}
                                    source={isSpeaker ? require('./images/icon_speaker.png') : require('./images/btn_speaker.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4'
    },
    absView: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between'
    },
    videoView: {
        padding: 5,
        flexWrap: 'wrap',
        flexDirection: 'row',
        zIndex: 100
    },
    localView: {
        flex: 1
    },
    remoteView: {
        width: (width - 40) / 3,
        height: (width - 40) / 3,
        margin: 5
    },
    bottomView: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});



AppRegistry.registerComponent('RNAgoraExample', () => RNAgoraExample);
