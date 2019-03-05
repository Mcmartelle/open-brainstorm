export default (context, html) => html`
  <form @submit="${(e) => context.joinBrainstorm(e)}">
    <input name="roomName" placeholder="Type room ID here..." @input="${(e) => context.onRoomNameUpdate(e)}" .value="${context.roomName}" maxlength="5" />
    <button type="submit" ?disabled="${!context.form.valid}">Join Brainstorm</button> ${context.form.roomName.isRequired.valid
      ? ''
      : html`
          <p>Brainstorm ID is required</p>
        `}
  </form>
`;
