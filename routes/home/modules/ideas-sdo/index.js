import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import {storeInstance} from '@aofl/store';

const sdo = {
  namespace: sdoNamespaces.IDEAS,
  mutations: {
    init(payload = {}) {
      return Object.assign({
        todos: [],
        filter: ''
      }, payload);
    }
  }
};

storeInstance.addState(sdo);
