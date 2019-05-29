/**
 * @route /
 * @title Mind Monsoon
 * @prerender false
 */
import {template} from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import styles from './template.css';
import {storeInstance} from '@aofl/store';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import './modules/ideas-sdo';
import {sdoNamespaces} from '../../modules/constants-enumerate';

/**
 *
 * @extends {AoflElement}
 */
class HomePage extends mapStatePropertiesMixin(AoflElement) {
  /**
   *
   * Creates an instance of HomePage.
   */
  constructor() {
    super();
    this.storeInstance = storeInstance;
  }

  /**
   * @readonly
   */
  static get properties() {
    return {
      sortedIdeas: {type: Array, attribute: false}
    };
  }

  /**
   *
   *
   */
  mapStateProperties() {
    const state = this.storeInstance.getState();
    this.sortedIdeas = state[sdoNamespaces.IDEAS].$sortedIdeas;
    this.roomCreated = state[sdoNamespaces.IDEAS].roomCreated;
    this.roomJoined = state[sdoNamespaces.IDEAS].roomJoined;
    this.createRoomAttempted = state[sdoNamespaces.IDEAS].createRoomAttempted;
    this.joinRoomAttempted = state[sdoNamespaces.IDEAS].joinRoomAttempted;
    this.roomName = state[sdoNamespaces.IDEAS].roomName;
  }

  /**
   *
   * @readonly
   */
  static get is() {
    return 'home-page';
  }

  /**
   *
   * @param {*} e
   */
  leaveRoom(e) {
    e.preventDefault();

    this.storeInstance.commit({
      namespace: sdoNamespaces.IDEAS,
      mutationId: 'leaveRoom',
      payload: ''
    });
  }

  /**
   *
   *
   * @param {*} e
   * @param {*} index
   */
  upVote(e, index) {
    e.preventDefault();

    this.storeInstance.commit({
      namespace: sdoNamespaces.IDEAS,
      mutationId: 'upVote',
      payload: index
    });
  }

  /**
   *
   *
   * @param {*} e
   * @param {*} index
   */
  downVote(e, index) {
    e.preventDefault();

    this.storeInstance.commit({
      namespace: sdoNamespaces.IDEAS,
      mutationId: 'downVote',
      payload: index
    });
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

customElements.define(HomePage.is, HomePage);

export default HomePage;
