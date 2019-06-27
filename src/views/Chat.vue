<template>
  <div class="chat__wrap">
    <div class="chat__container">
      <div class="chat__sidebar">
        <h5 class="room__title">Chatrooms</h5>
        <div class="sidebar__rooms">
          <div
            class="sidebar__users"
            v-for="userItem in users"
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
      <div class="chat__messages">
        <div class="chat__card-box">
          <p class="chat__nomessages" v-if="messages.length == 0">
            [No messages yet!]
          </p>
          <transition-group
            name="list"
            tag="div"
            class="messages__box"
            v-chat-scroll="{ always: false, smooth: true }"
          >
            <div
              class="message__item list-complete-item"
              v-for="message in messages"
              :key="message.id"
            >
              <span class="message__title">{{ message.name }}: </span>
              <span class="message__text-content">{{ message.message }}</span>
              <span class="message__text-time">{{ message.timestamp }}</span>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
    <div class="message__input">
      <CreateMessage :name="name" :room="room" />
    </div>
  </div>
</template>

<script>
import CreateMessage from "@/components/CreateMessage";
import fb from "@/firebase/init";
import moment from "moment";

export default {
  name: "Chat",
  props: ["name", "room"],
  components: {
    CreateMessage
  },
  data() {
    return {
      messages: [],
      users: [],
      rooms: []
    };
  },
  created() {
    if (this.name) sessionStorage.setItem("username", this.name);
    console.log(sessionStorage.getItem("username"));
    if (this.room) sessionStorage.setItem("userroom", this.room);
    console.log(sessionStorage.getItem("userroom"));
    let ref = fb
      .collection("messages")
      .where("room", "==", this.room || sessionStorage.getItem("userroom"))
      .orderBy("timestamp");

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if ((change.type = "added")) {
          let doc = change.doc;
          this.messages.push({
            id: doc.id,
            name: doc.data().name,
            room: doc.data().room,
            message: doc.data().message,
            timestamp: moment(doc.data().timestamp).format("LTS")
          });
        }
      });
    });

    let usersRef = fb.collection("rooms");

    usersRef.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if ((change.type = "added")) {
          let doc = change.doc;
          this.users.push({
            id: doc.id,
            users: [...doc.data().users],
            room: doc.data().room
          });
          this.rooms.push({
            id: doc.id,
            room: doc.data().room
          });
        }
      });
    });
  }
};
</script>

<style scoped>
.chat__wrap {
  margin: 0rem;
  padding: 0rem;
  height: 85vh;
  display: grid;
  grid-auto-flow: row;
  overflow: hidden;
}

.chat__container {
  margin: 0rem;
  padding: 0rem;
  width: 100%;
  height: 70vh;
  display: grid;
  grid-template-columns: 1fr 4fr;
}

.chat__sidebar {
  grid-area: 1 / 1 / 1 / 1;
  height: 70vh;
  display: grid;
  grid-template-rows: 5vh 1fr;
  border-right: 0.3rem solid hsla(178, 100%, 37%, 1);
}

.chat__messages {
  grid-area: 1 / 2 / 1 / 2;
  width: 80vw;
  height: 70vh;
}

.chat__card-box {
  width: 80vw;
  display: grid;
  justify-items: center;
  justify-content: space-between;
  align-items: center;
  align-content: space-between;
}

.chat__nomessages {
  height: auto;
  width: 100%;
  color: hsla(3, 99%, 48%, 1);
  font-weight: 700;
  text-align: center;
  background-color: hsla(205, 100%, 80%, 0.9);
  border-radius: 15px;
}

.messages__box {
  height: 70vh;
  width: 80vw;
  overflow-y: auto;
  overflow-x: hidden;
}

.message__item {
  padding: 0.5rem 0rem;
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  gap: 0rem 1rem;
  justify-items: center;
  align-items: start;
  align-content: space-between;
  background-color: hsla(178, 99%, 99%, 15);
  border-bottom: 0.1rem dashed hsla(178, 100%, 37%, 1);
  width: 80vw;
}

.list-complete-item {
  transition: all 300ms ease-in;
  opacity: 1;
}

.list-enter {
  opacity: 0;
  transform: translateX(10rem);
  background-color: transparent;
}

.message__title {
  border-left: 0.5rem solid hsla(178, 100%, 37%, 1);
  margin-left: 0.5rem;
  padding: 0.3rem 0.1rem 0.3rem 0.2rem;
  font-weight: 700;
  text-align: center;
  color: white;
  background-color: hsla(21, 70%, 44%, 1);
}
.message__text-content {
  width: 100%;
  padding: 0.3rem;
  color: hsla(21, 70%, 44%, 1);
  font-weight: 600;
  font-size: 1rem;
  text-align: left;
}
.message__text-time {
  margin-right: 0.5rem;
  padding: 0.2rem 0.5rem;
  color: hsla(178, 100%, 37%, 1);
  font-weight: 500;
  text-align: left;
}
.message__input {
  padding: 0;
}

.sidebar__rooms {
  padding: 0.5rem 0.1rem;
  display: grid;
  gap: 0.3rem 0rem;
  justify-items: start;
  align-items: start;
  align-content: space-between;
  background-color: hsla(178, 99%, 99%, 15);
  overflow-x: hidden;
}

.sidebar__room {
  padding: 0.1rem 0.2rem;
  margin: 0rem;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  background-color: hsla(21, 70%, 44%, 1);
  color: hsla(178, 99%, 99%, 15);
}

.room__title {
  padding: 0.1rem 0.1rem;
  margin: 0rem;
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  color: white;
  background-color: hsla(178, 100%, 37%, 1);
}

.sidebar__users {
  padding: 0.2rem 0.1rem;
  display: grid;
  gap: 0rem 0.3rem;
  justify-items: center;
  align-items: start;
  align-content: space-between;
  background-color: hsla(178, 100%, 37%, 1);
}

.sidebar__user {
  padding: 0rem 0.1rem;
  margin: 0rem;
  font-size: 1rem;
  font-weight: 700;
  text-align: left;
  color: white;
  background-color: hsla(178, 100%, 37%, 1);
  width: 100%;
}
</style>
