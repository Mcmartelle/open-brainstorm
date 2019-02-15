/**
 * @route /
 * @title AofL::Home
 * @prerender false
 */
import {template} from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import styles from './template.css';
import {storeInstance} from '@aofl/store';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import './modules/todos-sdo';
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
      ideas: {type: Array, attribute: false}
    };
  }

  /**
   *
   *
   */
  mapStateProperties() {
    const state = this.storeInstance.getState();
    this.ideas = state[sdoNamespaces.IDEAS].$ideas;
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
   * @return {Object}
   */
  render() {
    return super.render(template, [styles]);
  }
}

customElements.define(HomePage.is, HomePage);

export default HomePage;
