import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';

/**
 * @summary ThumbsUp
 * @extends {AoflElement}
 */
class ThumbsUp extends AoflElement {
  /**
   * Creates an instance of ThumbsUp.
   */
  constructor() {
    super();
  }

  /**
   * @readonly
   */
  static get is() {
    return 'thumbs-up';
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(ThumbsUp.is, ThumbsUp);

export default ThumbsUp;
