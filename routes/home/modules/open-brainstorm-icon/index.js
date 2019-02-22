import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';

/**
 * @summary OpenBrainstormIcon
 * @extends {AoflElement}
 */
class OpenBrainstormIcon extends AoflElement {
  /**
   * Creates an instance of OpenBrainstormIcon.
   */
  constructor() {
    super();
  }

  /**
   * @readonly
   */
  static get is() {
    return 'open-brainstorm-icon';
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(OpenBrainstormIcon.is, OpenBrainstormIcon);

export default OpenBrainstormIcon;
