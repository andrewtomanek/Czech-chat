<template>
  <div class="login__container">
    <div class="login__card">
      <h2 class="login__title">Login</h2>
      <form @submit.prevent="login" class="login__form">
        <div class="form-group">
          <input
            type="text"
            class="login__input"
            placeholder="Please enter your name ..."
            name="name"
            v-model="name"
          />
          <input
            type="text"
            class="login__input"
            placeholder="Please enter room name ..."
            name="room"
            v-model="room"
          />
          <p class="login__danger">{{ room }}</p>
          <p v-if="errorText" class="login__danger">{{ errorText }}</p>
        </div>
        <button type="submit" class="login__button">Enter Chat</button>
      </form>
    </div>
    <button @click="createRandomLogin" class="login__button">
      Random name
    </button>
  </div>
</template>

<script>
import { namesArray } from "@/names.js";
import { placesArray } from "@/places.js";

export default {
  name: "login",
  data() {
    return {
      name: "",
      room: "",
      errorText: null,
      namesArray: namesArray,
      placesArray: placesArray
    };
  },
  methods: {
    login() {
      if (this.name) {
        this.$router.push({
          name: "chat",
          params: { name: this.name, room: this.room }
        });
      } else {
        this.errorText = "Please enter a name first!";
      }
    },
    createRandomLogin() {
      let randomName = this.namesArray[
        Math.floor(Math.random() * this.namesArray.length)
      ];
      let randomRoom = this.placesArray[
        Math.floor(Math.random() * this.placesArray.length)
      ];
      this.$router.push({
        name: "chat",
        params: { name: randomName, room: randomRoom }
      });
    }
  }
};
</script>

<style scoped>
.login__container {
  margin: 0;
  padding: 0;
  width: 100%;
}
.login__card {
  display: grid;
}
.login__title {
  font-size: 1rem;
  font-weight: 600;
}
.login__form {
  display: grid;
  grid-auto-flow: row;
}
.login__input {
  font-size: 1rem;
  font-weight: 500;
  padding: 0.2rem;
}
.login__danger {
  background-color: red;
}
.login__button {
  font-size: 1rem;
  padding: 0.3rem;
}
</style>
