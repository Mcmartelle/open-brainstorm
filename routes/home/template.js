import './modules/add-idea-form';
import './modules/create-brainstorm';
import './modules/join-brainstorm';
import './modules/open-brainstorm-icon';

export const template = (ctx, html) => {
  const header = html`
    <open-brainstorm-icon></open-brainstorm-icon>
    <h1>Open Brainstorm</h1>
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
              <span>${idea.$voteCount}</span>
              <button @click="${(e) => ctx.upVote(e, idea.ideaId)}">+</button>
              <button @click="${(e) => ctx.downVote(e, idea.ideaId)}">-</button>
              <span>${idea.description}</span>
            </li>
          `
  )}
        <li><add-idea-form></add-idea-form></li>
      </ul>
    `;
  }
};
