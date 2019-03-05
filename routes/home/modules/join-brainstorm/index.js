import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import {validationMixin, isRequired} from '@aofl/form-validate';
import {storeInstance} from '@aofl/store';
import '../ideas-sdo';

/**
 * @summary JoinBrainstorm
 * @extends {AoflElement}
 */
class JoinBrainstorm extends mapStatePropertiesMixin(validationMixin(AoflElement)) {
  /**
   * Creates an instance of JoinBrainstorm.
   */
  constructor() {
    super();

    this.storeInstance = storeInstance;
    this.roomName = '';
    this.validators = {
      roomName: {
        isRequired
      }
    };
  }

  /**
   * @readonly
   */
  static get is() {
    return 'join-brainstorm';
  }

  /**
   *
   * @readonly
   */
  static get properties() {
    return {
      roomName: {type: String}
    };
  }

  /**
   *
   *
   */
  mapStateProperties() {
    const state = this.storeInstance.getState();
    this.roomName = state[sdoNamespaces.IDEAS].roomName;
  }

  /**
   *
   * @param {*} e
   */
  onRoomNameUpdate(e) {
    this.roomName = e.target.value.toUpperCase();
    this.form.roomName.validate();
  }

  /**
   *
   * @param {*} e
   */
  async joinBrainstorm(e) {
    e.preventDefault();

    this.form.validate();
    await this.form.validateComplete;

    if (this.form.valid) {
      const form = e.target;
      const formData = new FormData(form);
      const roomName = formData.get('roomName');
      console.log('roomName: ', roomName);

      storeInstance.commit({
        namespace: sdoNamespaces.IDEAS,
        mutationId: 'joinRoom',
        payload: roomName
      });

      this.roomName = '';
    }
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(JoinBrainstorm.is, JoinBrainstorm);

export default JoinBrainstorm;
