import './modules/add-idea-form';
import './modules/create-brainstorm';
import './modules/join-brainstorm';

export const template = (ctx, html) => {
  const header = html`<div class="header"><h1>MIND MONSOON</h1></div>`;
  if (!ctx.createRoomAttempted && !ctx.joinRoomAttempted) {
    return html`
      ${header}
      <create-brainstorm></create-brainstorm>
      <join-brainstorm></join-brainstorm>
    `;
  } else {
    return html`
      ${header}
      <h2>ROOM: <span class='roomId'>${ctx.roomName}</span></h2>
      <ul>
        ${ctx.sortedIdeas.map(
  (idea) => html`
            <li class="idea">
            <div class="voteContainer">
              <span class="upVotes">${idea.$upVotes}</span>
              <div @click="${(e) => ctx.upVote(e, idea.ideaId)}" class="thumb-button thumbs-up${idea.$upVoted ? ' up-voted' : ''}" ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -256 1792 1792"><path d="M385.085 1154.17q0-26-19-45t-45-19q-26 0-45 19t-19 45q0 26 19 45t45 19q26 0 45-19t19-45zm1152-576q0-51-39-89.5t-89-38.5h-352q0-58 48-159.5t48-160.5q0-98-32-145t-128-47q-26 26-38 85t-30.5 125.5q-18.5 66.5-59.5 109.5-22 23-77 91-4 5-23 30t-31.5 41q-12.5 16-34.5 42.5t-40 44q-18 17.5-38.5 35.5t-40 27q-19.5 9-35.5 9h-32v640h32q13 0 31.5 3t33 6.5q14.5 3.5 38 11t35 11.5q11.5 4 35.5 12.5t29 10.5q211 73 342 73h121q192 0 192-167 0-26-5-56 30-16 47.5-52.5t17.5-73.5q0-37-18-69 53-50 53-119 0-25-10-55.5t-25-47.5q32-1 53.5-47t21.5-81zm128-1q0 89-49 163 9 33 9 69 0 77-38 144 3 21 3 43 0 101-60 178 1 139-85 219.5t-227 80.5h-129q-96 0-189.5-22.5t-216.5-65.5q-116-40-138-40h-288q-53 0-90.5-37.5t-37.5-90.5v-640q0-53 37.5-90.5t90.5-37.5h274q36-24 137-155 58-75 107-128 24-25 35.5-85.5t30.5-126.5q19-66 62-108 39-37 90-37 84 0 151 32.5t102 101.5q35 69 35 186 0 93-48 192h176q104 0 180 76t76 179z" fill="currentColor"/></svg></div>
              <span class="voteCount">${idea.$voteCount}</span>
              <div @click="${(e) => ctx.downVote(e, idea.ideaId)}" class="thumb-button thumbs-down${idea.$downVoted ? ' down-voted' : ''}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -256 1792 1792"><path d="M385.085 1154.17q0-26-19-45t-45-19q-26 0-45 19t-19 45q0 26 19 45t45 19q26 0 45-19t19-45zm1152-576q0-51-39-89.5t-89-38.5h-352q0-58 48-159.5t48-160.5q0-98-32-145t-128-47q-26 26-38 85t-30.5 125.5q-18.5 66.5-59.5 109.5-22 23-77 91-4 5-23 30t-31.5 41q-12.5 16-34.5 42.5t-40 44q-18 17.5-38.5 35.5t-40 27q-19.5 9-35.5 9h-32v640h32q13 0 31.5 3t33 6.5q14.5 3.5 38 11t35 11.5q11.5 4 35.5 12.5t29 10.5q211 73 342 73h121q192 0 192-167 0-26-5-56 30-16 47.5-52.5t17.5-73.5q0-37-18-69 53-50 53-119 0-25-10-55.5t-25-47.5q32-1 53.5-47t21.5-81zm128-1q0 89-49 163 9 33 9 69 0 77-38 144 3 21 3 43 0 101-60 178 1 139-85 219.5t-227 80.5h-129q-96 0-189.5-22.5t-216.5-65.5q-116-40-138-40h-288q-53 0-90.5-37.5t-37.5-90.5v-640q0-53 37.5-90.5t90.5-37.5h274q36-24 137-155 58-75 107-128 24-25 35.5-85.5t30.5-126.5q19-66 62-108 39-37 90-37 84 0 151 32.5t102 101.5q35 69 35 186 0 93-48 192h176q104 0 180 76t76 179z" fill="currentColor"/></svg></div>
              <span class="downVotes">${idea.$downVotes}</span>
            </div>

              <span class="idea-description">${idea.description}</span>
            </li>
          `
  )}
        <li class="add-idea"><add-idea-form></add-idea-form></li>
      </ul>
    `;
  }
};
