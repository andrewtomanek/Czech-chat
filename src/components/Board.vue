<template>
  <div class="chat__board">
    <div class="chat__sidebar">
      <h5 class="room__title">Chatrooms</h5>
      <div class="sidebar__rooms">
        <div
          class="sidebar__users"
          v-for="userItem in roomsArray"
          @click="chooseRoom(userItem.room)"
          :key="userItem.room"
        >
          <span class="sidebar__room">{{ userItem.room }}:</span>
          <span
            class="sidebar__user"
            v-for="chatUser in userItem.users"
            :key="chatUser.toString()"
            >{{ chatUser.toString() }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    roomsArray: {
      type: Array,
      required: true
    }
  },
  methods: {
    chooseRoom(room) {
      this.$emit("update-room", room);
    }
  }
};
</script>

<style scoped>
.chat__sidebar {
  grid-area: 1 / 1 / 1 / 1;
  display: grid;
  grid-template-rows: 5vh 1fr;
  border: 0.3rem solid hsla(178, 100%, 37%, 1);
  height: 40vh;
}

.sidebar__rooms {
  padding: 0.5rem 0.1rem;
  gap: 2rem 0.3rem;
  display: grid;
  grid-auto-flow: row;
  justify-items: start;
  align-items: start;
  align-content: space-minLength;
  justify-content: space-minLength;
  background-color: hsla(178, 99%, 99%, 15);
  overflow: auto;
}

.sidebar__room {
  padding: 0.1rem 0.2rem;
  margin: 0rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  background-color: hsla(21, 70%, 44%, 1);
  color: hsla(178, 99%, 99%, 15);
}

.room__title {
  padding: 0.1rem 0.1rem;
  margin: 0rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: white;
  background-color: hsla(178, 100%, 37%, 1);
}

.sidebar__users {
  padding: 0.2rem 0.1rem;
  display: flex;
  flex-flow: row wrap;
  justify-items: center;
  align-content: space-minLength;
  background-color: hsla(178, 100%, 37%, 1);
  border-right: 1rem solid hsla(21, 70%, 44%, 1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar__users:hover {
  background-color: hsla(21, 70%, 44%, 1);
  border-right: 1rem solid transparent;
}

.sidebar__user {
  padding: 0rem 0.4rem;
  margin: 0rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: white;
  background-color: hsla(178, 100%, 37%, 1);
  border-right: 0.2rem dotted hsla(21, 70%, 44%, 1);
}

@media all and (max-width: 736px) {
  .room__title {
    font-size: 1rem;
  }

  .sidebar__room {
    font-size: 1rem;
  }

  .sidebar__user {
    font-size: 1rem;
  }
}
</style>
