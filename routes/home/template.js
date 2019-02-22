import './modules/add-idea-form';
import './modules/open-brainstorm-icon';

export const template = (ctx, html) => html`
  <open-brainstorm-icon></open-brainstorm-icon>
  <h1>Open Brainstorm</h1>

  <ul>
    ${ctx.sortedIdeas.map(
  (idea) => html`
        <li>
          <span>${idea.voteCount}</span>
          <button @click="${(e) => ctx.upVote(e, idea.index)}">+</button>
          <button @click="${(e) => ctx.downVote(e, idea.index)}">-</button>
          <span>${idea.description}</span>
        </li>
      `
  )}
    <li><add-idea-form></add-idea-form></li>
  </ul>
`;
