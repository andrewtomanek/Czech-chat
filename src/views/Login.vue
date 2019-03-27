<template>
  <div class="login__container">
    <div class="login__card">
      <h2 class="login__title">Login</h2>
      <form @submit.prevent="login" class="login__form">
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
        <p class="login__danger">{{ roomList }}</p>
        <p class="login__danger">{{ userList }}</p>
        <p v-if="errorText" class="login__danger">{{ errorText }}</p>
        <button type="submit" class="login__button">Enter Chat</button>
      </form>
    </div>
    <button @click="createRandomLogin" class="login__button">
      Random name
    </button>
    <p>{{ rooms }}</p>
  </div>
</template>

<script>
import fb from "@/firebase/init";
import { namesArray } from "@/names.js";
import { placesArray } from "@/places.js";

export default {
  name: "login",
  data() {
    return {
      name: "",
      room: "",
      rooms: [],
      roomList: [],
      userList: [],
      roomSet: new Set(),
      userArray: [],
      userSet: new Set(),
      errorText: null,
      namesArray: namesArray,
      placesArray: placesArray
    };
  },
  methods: {
    login() {
      if (!this.userSet.has(this.name)) {
        this.userSet.add(this.name);
      } else {
        this.errorText = "duplicate name";
        return;
      }
      this.userArray = [...new Set(this.userSet)];
      if (!this.roomSet.has(this.room)) {
        this.roomSet.add(this.room);
      } else {
        this.errorText = "duplicate room";
        return;
      }
      this.rooms = [...new Set(this.roomSet)];
      fb.collection("rooms")
        .add({
          room: this.room,
          users: this.name
        })
        .catch(err => {
          console.log(err);
        });
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
  },
  created() {
    let roomSet = this.roomSet;
    let userSet = this.userSet;

    fb.collection("rooms")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          roomSet.add(doc.data().room);
          userSet.add(doc.data().users);
        });
      })
      .then(() => {
        this.roomList = [...roomSet];
        this.userList = [...userSet];
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
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
