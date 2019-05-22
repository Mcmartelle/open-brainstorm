import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';

/**
 * @summary CloudLogo
 * @extends {AoflElement}
 */
class CloudLogo extends AoflElement {
  /**
   * Creates an instance of CloudLogo.
   */
  constructor() {
    super();
  }

  /**
   * @readonly
   */
  static get is() {
    return 'cloud-logo';
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(CloudLogo.is, CloudLogo);

export default CloudLogo;
