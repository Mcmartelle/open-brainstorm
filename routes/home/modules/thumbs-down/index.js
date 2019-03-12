import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';

/**
 * @summary ThumbsDown
 * @extends {AoflElement}
 */
class ThumbsDown extends AoflElement {
  /**
   * Creates an instance of ThumbsDown.
   */
  constructor() {
    super();
  }

  /**
   * @readonly
   */
  static get is() {
    return 'thumbs-down';
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(ThumbsDown.is, ThumbsDown);

export default ThumbsDown;
