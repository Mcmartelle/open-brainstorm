import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import {storeInstance} from '@aofl/store';

const sdo = {
  namespace: sdoNamespaces.IDEAS,
  mutations: {
    init(payload = {}) {
      return Object.assign({
        ideas: []
      }, payload);
    },
    insert(subState, description) {
      return Object.assign({}, subState, {
        ideas: [
          ...subState.ideas,
          {
            index: subState.ideas.length,
            description,
            upVoted: false,
            downVoted: false
          }
        ]
      });
    }
  }
};

storeInstance.addState(sdo);
