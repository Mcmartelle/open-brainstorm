import io from 'socket.io-client';
import Cookies from 'js-cookie';
import queryString from 'query-string';
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
      this.socket = io('https://mindmonsoon.com', {path: '/api/socket.io'});
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
    this.socket.on('disconnect', () => console.log('disconnected'));
    this.socket.on('reconnect', () => console.log('reconnecting'));
    this.socket.on('connect', this.connect);
    this.socket.on('roomJoined', this.roomJoined);
    this.socket.on('brainstorm state requested', this.sendBrainstormState);
    this.socket.on('brainstorm state sent', this.updateBrainstormState);
  }

  /**
   *
   *
   */
  connect() {
    console.log('Connection reestablished.');

    let roomName = null;
    const searchObject = queryString.parse(window.location.search);
    if (searchObject.room) {
      roomName = searchObject.room;
    } else if (Cookies.get('roomId')) {
      roomName = Cookies.get('roomId');
    }

    if (roomName) {
      if (roomName === Cookies.get('creatorOf')) {
        console.log(`Joining room number ${roomName} as creator after reestablishing connection to socket.io`);
        storeInstance.commit({
          namespace: sdoNamespaces.IDEAS,
          mutationId: 'creatorJoinRoom',
          payload: roomName
        });
      } else {
        console.log(`Joining room number ${roomName} after reestablishing connection to socket.io`);
        storeInstance.commit({
          namespace: sdoNamespaces.IDEAS,
          mutationId: 'joinRoom',
          payload: roomName
        });
      }
    }
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

    if (roomData.isCreator) {
      Cookies.set('creatorOf', roomData.roomName);
    }

    storeInstance.commit({
      namespace: sdoNamespaces.IDEAS,
      mutationId: 'roomJoined',
      payload: roomData
    });
  }
}

export default SocketSingleton;
