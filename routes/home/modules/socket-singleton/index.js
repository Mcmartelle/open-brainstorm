import io from 'socket.io-client';
import {storeInstance} from '@aofl/store';
import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import '../ideas-sdo';

let instance = null;
/**
 * @summary Socket
 */
class SocketSingleton {
  /**
   * Creates or returns the instance of SocketSingleton.
   */
  constructor() {
    if (!instance) {
      instance = this;
      this.socket = io('http://localhost:3000');
      this.addListeners();
    }

    return instance;
  }

  /**
   *
   *
   */
  addListeners() {
    this.socket.on('idea update', this.insertFromSocket);
    this.socket.on('disconnect', () => {
      console.log('disconnected');
    });
    this.socket.on('error', (error) => {
      console.log('error: ', error);
    });
    this.socket.on('roomCreated', this.roomCreated);
    this.socket.on('roomJoined', this.roomJoined);
  }

  /**
   *
   *
   * @param {*} newIdea
   */
  insertFromSocket(newIdea) {
    storeInstance.commit({
      namespace: sdoNamespaces.IDEAS,
      mutationId: 'insertFromSocket',
      payload: newIdea
    });
  }

  /**
   *
   *
   * @param {*} roomData
   */
  roomCreated(roomData) {
    console.log('roomName: ', roomData.roomName);
    console.log('socketId: ', roomData.socketId);
    storeInstance.commit({
      namespace: sdoNamespaces.IDEAS,
      mutationId: 'roomCreated',
      payload: roomData.roomName
    });
  }

  /**
   *
   *
   * @param {*} roomData
   */
  roomJoined(roomData) {
    console.log('roomName: ', roomData.roomName);
    console.log('socketId: ', roomData.socketId);
    storeInstance.commit({
      namespace: sdoNamespaces.IDEAS,
      mutationId: 'roomJoined',
      payload: roomData.roomName
    });
  }
}

export default SocketSingleton;
