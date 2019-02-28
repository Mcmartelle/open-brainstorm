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
        createRoomAttempted: false,
        joinRoomAttempted: false
      },
      payload
      );
    },
    createRoom(subState) {
      socket.emit('createRoom');
      return Object.assign({}, subState, {
        createRoomAttempted: true
      });
    },
    joinRoom(subState, roomName) {
      const re = /^[A-Z]{5}/;
      if (re.test(roomName)) {
        socket.emit('join room', roomName);
        return Object.assign({}, subState, {
          joinRoomAttempted: true
        });
      } else {
        console.log('Incorrect brainstorm ID format.');
        return subState;
      }
    },
    roomJoined(subState, roomData) {
      if (!roomData.isCreator) {
        socket.emit('brainstorm state request', roomData.creatorId);
      }
      return Object.assign({}, subState, {
        roomJoined: true,
        roomName: roomData.roomName,
        creatorId: roomData.creatorId,
        socketId: roomData.socketId
      });
    },
    sendBrainstormState(subState, requesterId) {
      if (requesterId) {
        socket.emit('brainstorm state send', requesterId, subState.ideas);
      }
      return subState;
    },
    insert(subState, description) {
      const newIdea =
      {
        author: subState.socketId,
        ideaId: subState.socketId + new Date().getTime(),
        description,
        upVoters: [],
        downVoters: []
      };
      socket.emit('idea update', newIdea, true);
      return Object.assign({}, subState, {
        ideas: [
          ...subState.ideas,
          newIdea
        ]
      });
    },
    insertFromSocket(subState, payload) {
      if (payload.isNewIdea) {
        return Object.assign({}, subState, {
          ideas: [
            ...subState.ideas,
            payload.updatedIdea
          ]
        });
      }
      const index = subState.ideas.findIndex((idea) => {
        return idea.ideaId === payload.updatedIdea.ideaId;
      });
      if (index === -1) {
        return subState;
      }
      return Object.assign({}, subState, {
        ideas: [
          ...subState.ideas.slice(0, index),
          payload.updatedIdea,
          ...subState.ideas.slice(index + 1)
        ]
      });
    },
    insertAllFromSocket(subState, newIdeas) {
      return Object.assign({}, subState, {
        ideas: newIdeas
      });
    },
    upVote(subState, ideaId) {
      const index = subState.ideas.findIndex((idea) => {
        return idea.ideaId === ideaId;
      });

      if (index !== -1 && subState.ideas[index].upVoters.indexOf(subState.socketId) !== -1) {
        return subState;
      }
      console.log('subState: ', subState);
      console.log('subState.ideas[index]: ', subState.ideas[index]);

      // got "Uncaught TypeError: Cannot add property 0, object is not extensible" if pushed within updatedIdea
      const newUpVoters = [...subState.ideas[index].upVoters];
      newUpVoters.push(subState.socketId);
      const newDownVoters = subState.ideas[index].downVoters.reduce((accumulator, voter) => {
        if (voter !== subState.socketId) {
          accumulator.push(voter);
        }
        return accumulator;
      }, []);

      const updatedIdea = {
        ...subState.ideas[index],
        upVoters: newUpVoters,
        downVoters: newDownVoters
      };

      socket.emit('idea update', updatedIdea);
      return Object.assign({}, subState, {
        ideas: [
          ...subState.ideas.slice(0, index),
          updatedIdea,
          ...subState.ideas.slice(index + 1)
        ]
      });
    },
    downVote(subState, ideaId) {
      const index = subState.ideas.findIndex((idea) => {
        return idea.ideaId === ideaId;
      });

      if (index !== -1 && subState.ideas[index].downVoters.indexOf(subState.socketId) !== -1) {
        return subState;
      }
      console.log('subState: ', subState);
      console.log('subState.ideas[index]: ', subState.ideas[index]);

      // got "Uncaught TypeError: Cannot add property 0, object is not extensible" if pushed within updatedIdea
      const newDownVoters = [...subState.ideas[index].downVoters];
      newDownVoters.push(subState.socketId);
      const newUpVoters = subState.ideas[index].upVoters.reduce((accumulator, voter) => {
        if (voter !== subState.socketId) {
          accumulator.push(voter);
        }
        return accumulator;
      }, []);
      console.log('newUpVoters: ', newUpVoters);

      const updatedIdea = {
        ...subState.ideas[index],
        upVoters: newUpVoters,
        downVoters: newDownVoters
      };

      socket.emit('idea update', updatedIdea);
      return Object.assign({}, subState, {
        ideas: [
          ...subState.ideas.slice(0, index),
          updatedIdea,
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
        const enhancedIdeas = nextState[sdoNamespaces.IDEAS].ideas.map((idea) => {
          return {
            ...idea,
            $upVotes: idea.upVoters.length,
            $downVotes: idea.downVoters.length,
            $voteCount: idea.upVoters.length - idea.downVoters.length
          };
        });

        const $sortedIdeas = enhancedIdeas.sort((ideaA, ideaB) => ideaB.$voteCount - ideaA.$voteCount);

        nextState = deepAssign(nextState, sdoNamespaces.IDEAS, {
          $sortedIdeas
        });
      }

      return nextState;
    }
  ]
};

storeInstance.addState(sdo);
