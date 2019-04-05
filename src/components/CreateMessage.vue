<template>
  <div class="input__container">
    <form class="input__form" @submit.prevent="createMessage">
      <div class="input__box">
        <input
          type="text"
          name="message"
          class="input__field"
          placeholder="Enter message ..."
          v-model="newMessage"
        />
        <p class="text-danger" v-if="errorText">{{ errorText }}</p>
      </div>
      <button class="input__button" type="submit" name="action">
        Submit
      </button>
    </form>
  </div>
</template>

<script>
import fb from "@/firebase/init";

export default {
  name: "CreateMessage",
  props: ["name", "room"],
  data() {
    return {
      newMessage: null,
      errorText: null
    };
  },
  methods: {
    createMessage() {
      if (this.newMessage) {
        fb.collection("messages")
          .add({
            message: this.newMessage,
            name: this.name,
            room: this.room,
            timestamp: Date.now()
          })
          .catch(err => {
            console.log(err);
          });
        this.newMessage = null;
        this.errorText = null;
      } else {
        this.errorText = "A message must be entered first!";
      }
    }
  }
};
</script>

<style scoped>
.input__container {
  padding: 0rem;
  margin: 0;
}

.input__form {
  padding: 0rem;
  margin: 0;
  display: grid;
  grid-template-columns: 70vw 1fr;
  width: 100%;
  height: 100%;
  border: 0.3rem solid hsla(178, 100%, 37%, 1);
}

.input__box {
  padding: 0rem 0rem;
  margin: 0;
  display: grid;
  height: 100%;
}

.input__field {
  padding: 0.6rem;
  margin: 0;
  display: grid;
  height: 10vh;
  font-weight: 500;
  font-size: 1rem;
  color: hsla(21, 56%, 29%, 1);
}

.input__button {
  color: white;
  background-color: hsla(21, 70%, 44%, 1);
  padding: 1rem 1rem;
  margin: 0;
  width: 100%;
  height: 100%;
  font-weight: 700;
  font-size: 1rem;
  border: 0.3rem solid white;
  transition: all 300ms ease-in;
}

.input__button:hover {
  background-color: white;
  color: hsla(21, 70%, 44%, 1);
  border: 0.3rem solid hsla(21, 70%, 44%, 1);
}
</style>
