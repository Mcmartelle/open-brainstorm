export default (context, html) => html`
  <form @submit="${(e) => context.insertIdea(e)}">
    <input name="description" @input="${(e) => context.onDescriptionUpdate(e)}" .value="${context.description}" />
    <button type="submit" ?disabled="${!context.form.valid}">Add</button> ${context.form.description.isRequired.valid
      ? ''
      : html`
          <p>Cannot add empty idea</p>
        `}
  </form>
`;
