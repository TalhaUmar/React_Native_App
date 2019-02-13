import React, { Component } from 'react';
import { NetInfo, Alert } from 'react-native';

class ErrorComponent extends Component {

    state = { showAlert: false };
    
    componentDidMount() {
        NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange() {
        NetInfo.getConnectionInfo.then((connectionInfo) => {
            switch (connectionInfo.type) {
                case 'none':
                    this.setState({ showAlert: true });
                break;
                case 'unknown':
                    this.setState({ showAlert: true });
                break;
                case 'bluetooth':
                    this.setState({ showAlert: true });
                break;
                case 'ethernet':
                    this.setState({ showAlert: true });
                break;
                case 'wimax':
                    this.setState({ showAlert: true });
                break;
                default:
                break;
            }
        });
    }

    render() {
        return (
            <View style={{ backgroundColor:  }}>

            </View>
        );
    }
}

export default ErrorComponent;
