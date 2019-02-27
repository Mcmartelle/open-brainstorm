export default (context, html) => html`
  <form @submit="${(e) => context.joinBrainstorm(e)}">
    <input name="roomName" @input="${(e) => context.onRoomNameUpdate(e)}" .value="${context.roomName}" />
    <button type="submit" ?disabled="${!context.form.valid}">Join Brainstorm</button> ${context.form.roomName.isRequired.valid
      ? ''
      : html`
          <p>Brainstorm ID is required</p>
        `}
  </form>
`;
