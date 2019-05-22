export default (context, html) => html`
  <form @submit="${(e) => context.joinBrainstorm(e)}">
    <input name="roomName" placeholder="input room number" @input="${(e) => context.onRoomNameUpdate(e)}" .value="${context.roomName}" maxlength="6" />
    <button type="submit" ?disabled="${!context.form.valid}">Join Brainstorm</button> ${context.form.roomName.isRequired.valid
      ? ''
      : html`
          <p>6 digit room number is required</p>
        `}
  </form>
`;
