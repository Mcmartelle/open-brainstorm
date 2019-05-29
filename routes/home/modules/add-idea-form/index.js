import styles from './template.css';
import template from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import {validationMixin, isRequired} from '@aofl/form-validate';
import {storeInstance} from '@aofl/store';
import '../ideas-sdo';

/**
 * @summary AddIdeaForm
 * @extends {AoflElement}
 */
class AddIdeaForm extends validationMixin(AoflElement) {
  /**
   * Creates an instance of AddIdeaForm.
   */
  constructor() {
    super();

    this.description = '';
    this.validators = {
      description: {
        isRequired
      }
    };
  }

  /**
   * @readonly
   */
  static get is() {
    return 'add-idea-form';
  }

  /**
   *
   * @readonly
   */
  static get properties() {
    return {
      description: {type: String}
    };
  }

  /**
   *
   * @param {*} e
   */
  onDescriptionUpdate(e) {
    this.description = e.target.value;
    this.form.description.validate();
  }

  /**
   *
   * @param {*} e
   */
  async insertIdea(e) {
    e.preventDefault();

    this.form.validate();
    await this.form.validateComplete;

    if (this.form.valid) {
      const form = e.target;
      const formData = new FormData(form);
      const description = formData.get('description');

      storeInstance.commit({
        namespace: sdoNamespaces.IDEAS,
        mutationId: 'insert',
        payload: description
      });

      this.description = '';
      form.getElementsByTagName('input')[0].focus();
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

window.customElements.define(AddIdeaForm.is, AddIdeaForm);

export default AddIdeaForm;
