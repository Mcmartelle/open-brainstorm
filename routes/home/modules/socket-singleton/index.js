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
    this.socket.on('new idea', this.insertFromSocket);
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
}

export default SocketSingleton;
