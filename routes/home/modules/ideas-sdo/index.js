import {sdoNamespaces} from '../../../../modules/constants-enumerate';
import {storeInstance} from '@aofl/store';
import {deepAssign} from '@aofl/object-utils';
import SocketSingleton from '../socket-singleton';

const socket = new SocketSingleton().socket;

const sdo = {
  namespace: sdoNamespaces.IDEAS,
  mutations: {
    init(payload = {}) {
      return Object.assign(
      {
        ideas: [],
        $userId: Math.round(Math.random()*10**10)
      },
      payload
      );
    },
    insert(subState, description) {
      const newIdea =
      {
        author: subState.$userId,
        ideaId: subState.$userId + new Date().getTime(),
        index: subState.ideas.length,
        description,
        voteCount: 0,
        upVoted: false,
        downVoted: false
      };
      socket.emit('new idea', newIdea);
      return Object.assign({}, subState, {
        ideas: [
          ...subState.ideas,
          newIdea
        ]
      });
    },
    insertFromSocket(subState, newIdea) {
      if (newIdea.author === subState.$userId) {
        return subState;
      }
      return Object.assign({}, subState, {
        ideas: [
          ...subState.ideas,
          newIdea
        ]
      });
    },
    upVote(subState, index) {
      if (index >= subState.ideas.length || index < 0 || subState.ideas[index].upVoted) {
        return subState;
      }

      return Object.assign({}, subState, {
        ideas: [
          ...subState.ideas.slice(0, index),
          {
            ...subState.ideas[index],
            voteCount: subState.ideas[index].voteCount + 1
          },
          ...subState.ideas.slice(index + 1)
        ]
      });
    },
    downVote(subState, index) {
      if (index >= subState.ideas.length || index < 0 || subState.ideas[index].downVoted) {
        return subState;
      }

      return Object.assign({}, subState, {
        ideas: [
          ...subState.ideas.slice(0, index),
          {
            ...subState.ideas[index],
            voteCount: subState.ideas[index].voteCount - 1
          },
          ...subState.ideas.slice(index + 1)
        ]
      });
    }
  },
  decorators: [
    (_nextState) => {
      const state = storeInstance.getState();
      let nextState = _nextState;

      if (nextState[sdoNamespaces.IDEAS] !== state[sdoNamespaces.IDEAS]) {
        nextState = deepAssign(nextState, sdoNamespaces.IDEAS);
      }

      return nextState;
    },
    (_nextState) => {
      const state = storeInstance.getState();
      let nextState = _nextState;

      if (
        typeof nextState[sdoNamespaces.IDEAS].$sortedIdeas === 'undefined' || // first run?
        nextState[sdoNamespaces.IDEAS] !== state[sdoNamespaces.IDEAS]
      ) {
        let $sortedIdeas = [...nextState[sdoNamespaces.IDEAS].ideas];

        $sortedIdeas = $sortedIdeas.sort((ideaA, ideaB) => ideaB.voteCount - ideaA.voteCount);

        nextState = deepAssign(nextState, sdoNamespaces.IDEAS, {
          $sortedIdeas
        });
      }

      return nextState;
    }
  ]
};

storeInstance.addState(sdo);
