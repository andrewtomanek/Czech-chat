<template>
  <div class="chat__container">
    <div class="chat__card-box">
      <p class="chat__nomessages" v-if="messages.length == 0">
        [No messages yet!]
        <span class="message__text-content">{{ room }}</span>
      </p>
      <div
        class="messages__box"
        v-chat-scroll="{ always: false, smooth: true }"
      >
        <div
          class="message__item"
          v-for="message in messages"
          :key="message.id"
        >
          <span class="message__title">[{{ message.name }}]: </span>
          <span class="message__text-content">{{ message.message }}</span>
          <span class="message__text-time">{{ message.timestamp }}</span>
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
      messages: []
    };
  },
  created() {
    let ref = fb.collection("messages").orderBy("timestamp");

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
  }
};
</script>

<style>
.chat__container {
  width: 100%;
  height: 85vh;
  display: grid;
}
.chat__card-box {
  width: 100%;
  height: 100%;
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
  overflow-y: auto;
  overflow-x: hidden;
}

.message__item {
  margin: 0.5rem 0rem;
  padding: 1.3rem 0.5rem;
  width: 97vw;
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  gap: 0rem 1rem;
  justify-items: center;
  align-items: start;
  align-content: space-between;
  background-color: hsla(178, 99%, 99%, 15);
}

.message__title {
  border: 0.3rem double hsla(178, 100%, 37%, 1);
  padding: 0.3rem;
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
  padding: 0.2rem;
  color: hsla(178, 100%, 37%, 1);
  font-weight: 500;
  text-align: left;
}
.message__input {
  padding: 0;
}
</style>
