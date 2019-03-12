import './modules/add-idea-form';
import './modules/create-brainstorm';
import './modules/join-brainstorm';
import './modules/thumbs-down';
import './modules/thumbs-up';

export const template = (ctx, html) => {
  const header = html`
    <h1>MIND MONSOON</h1>
  `;
  if (!ctx.createRoomAttempted && !ctx.joinRoomAttempted) {
    return html`
      ${header}
      <create-brainstorm></create-brainstorm>
      <join-brainstorm></join-brainstorm>
    `;
  } else {
    return html`
      ${header}
      <h2>Room ID: ${ctx.roomName}</h2>
      <ul>
        ${ctx.sortedIdeas.map(
  (idea) => html`
            <li>
            <span>
              <span class="upVotes">${idea.$upVotes}</span>
              <thumbs-up @click="${(e) => ctx.upVote(e, idea.ideaId)}" class="${idea.$upVoted ? 'upvoted' : ''}" ></thumbs-up>
              <span class="voteCount">${idea.$voteCount}</span>
              <thumbs-down @click="${(e) => ctx.downVote(e, idea.ideaId)}" class="${idea.$downVoted ? 'downvoted' : ''}"></thumbs-down>
              <span class="downVotes">${idea.$downVotes}</span>
            </span>

              <span>${idea.description}</span>
            </li>
          `
  )}
        <li><add-idea-form></add-idea-form></li>
      </ul>
    `;
  }
};
