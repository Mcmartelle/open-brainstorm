import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';

/**
 * @summary AddIdeaForm
 * @extends {AoflElement}
 */
class AddIdeaForm extends AoflElement {
  /**
   * Creates an instance of AddIdeaForm.
   */
  constructor() {
    super();
  }

  /**
   * @readonly
   */
  static get is() {
    return 'add-idea-form';
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(AddIdeaForm.is, AddIdeaForm);

export default AddIdeaForm;
