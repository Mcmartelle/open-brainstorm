import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import {storeInstance} from '@aofl/store';
import '../ideas-sdo';

/**
 * @summary CreateBrainstorm
 * @extends {AoflElement}
 */
class CreateBrainstorm extends AoflElement {
  /**
   * Creates an instance of CreateBrainstorm.
   */
  constructor() {
    super();
  }

  /**
   * @readonly
   */
  static get is() {
    return 'create-brainstorm';
  }

  /**
   *
   * @param {*} e
   */
  async createBrainstorm(e) {
    e.preventDefault();

    storeInstance.commit({
      namespace: sdoNamespaces.IDEAS,
      mutationId: 'createRoom',
      payload: ''
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

window.customElements.define(CreateBrainstorm.is, CreateBrainstorm);

export default CreateBrainstorm;
