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
      this.addSocketListeners();
    }

    return instance;
  }

  /**
   *
   *
   */
  addSocketListeners() {
    this.socket.on('idea update', this.insertFromSocket);
    this.socket.on('disconnect', this.disconnected);
    this.socket.on('roomJoined', this.roomJoined);
    this.socket.on('brainstorm state requested', this.sendBrainstormState);
    this.socket.on('brainstorm state sent', this.updateBrainstormState);
  }


  /**
   * @param {*} requesterId
   */
  sendBrainstormState(requesterId) {
    console.log('requesterId: ', requesterId);
    console.log('sendBrainstormState');
    // this.socket.emit('brainstorm state send', requesterId, storeInstance.sdoNamespaces.IDEAS);
    // this.socket is undefined in this function for some reason. running mutator just to access socket.emit :(
    storeInstance.commit({
      namespace: sdoNamespaces.IDEAS,
      mutationId: 'sendBrainstormState',
      payload: requesterId
    });
  }

  /**
   * @param {*} brainstormState
   */
  updateBrainstormState(brainstormState) {
    console.log('updateBrainstormState');
    storeInstance.commit({
      namespace: sdoNamespaces.IDEAS,
      mutationId: 'insertAllFromSocket',
      payload: brainstormState
    });
  }

  /**
   *
   *
   * @param {*} updatedIdea
   * @param {boolean} isNewIdea
   */
  insertFromSocket(updatedIdea, isNewIdea) {
    storeInstance.commit({
      namespace: sdoNamespaces.IDEAS,
      mutationId: 'insertFromSocket',
      payload: {updatedIdea, isNewIdea}
    });
  }

  /**
   *
   *
   * @param {*} roomData
   */
  roomJoined(roomData) {
    console.log('roomName: ', roomData.roomName);
    console.log('isCreator: ', roomData.isCreator);
    console.log('creatorId: ', roomData.creatorId);
    storeInstance.commit({
      namespace: sdoNamespaces.IDEAS,
      mutationId: 'roomJoined',
      payload: roomData
    });
  }

  /**
   *
   *
   */
  disconnected() {
    console.log('disconnected');
  }
}

export default SocketSingleton;
