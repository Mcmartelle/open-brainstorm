import Cookies from 'js-cookie';
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
        joinRoomAttempted: false,
        roomName: Cookies.get('roomId') || ''
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
      console.log(Cookies.get('userId'));
      let socketId = Cookies.get('userId');
      if (!socketId) {
        socketId = roomData.socketId;
        Cookies.set('userId', socketId, {expires: 7});
      }
      Cookies.set('roomId', roomData.roomName, {expires: 1});
      return Object.assign({}, subState, {
        roomJoined: true,
        roomName: roomData.roomName,
        creatorId: roomData.creatorId,
        socketId: socketId
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

      if (index === -1) {
        return subState;
      }

      let newUpVoters;
      let newDownVoters;

      if (subState.ideas[index].upVoters.indexOf(subState.socketId) !== -1) {
        newUpVoters = subState.ideas[index].upVoters.reduce((accumulator, voter) => {
          if (voter !== subState.socketId) {
            accumulator.push(voter);
          }
          return accumulator;
        }, []);
        newDownVoters = [...subState.ideas[index].downVoters];
      } else {
        // got "Uncaught TypeError: Cannot add property 0, object is not extensible" if pushed within updatedIdea
        newUpVoters = [...subState.ideas[index].upVoters];
        newUpVoters.push(subState.socketId);
        newDownVoters = subState.ideas[index].downVoters.reduce((accumulator, voter) => {
          if (voter !== subState.socketId) {
            accumulator.push(voter);
          }
          return accumulator;
        }, []);
      }

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

      if (index === -1) {
        return subState;
      }

      let newDownVoters;
      let newUpVoters;

      if (subState.ideas[index].downVoters.indexOf(subState.socketId) !== -1) {
        newDownVoters = subState.ideas[index].downVoters.reduce((accumulator, voter) => {
          if (voter !== subState.socketId) {
            accumulator.push(voter);
          }
          return accumulator;
        }, []);
        newUpVoters = [...subState.ideas[index].upVoters];
      } else {
        // got "Uncaught TypeError: Cannot add property 0, object is not extensible" if pushed within updatedIdea
        newDownVoters = [...subState.ideas[index].downVoters];
        newDownVoters.push(subState.socketId);
        newUpVoters = subState.ideas[index].upVoters.reduce((accumulator, voter) => {
          if (voter !== subState.socketId) {
            accumulator.push(voter);
          }
          return accumulator;
        }, []);
      }

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
            $voteCount: idea.upVoters.length - idea.downVoters.length,
            $upVoted: idea.upVoters.indexOf(nextState[sdoNamespaces.IDEAS].socketId) !== -1,
            $downVoted: idea.downVoters.indexOf(nextState[sdoNamespaces.IDEAS].socketId) !== -1
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
