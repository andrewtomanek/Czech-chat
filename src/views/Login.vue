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
        <p class="login__danger">{{ userList }}</p>
        <p class="login__danger">{{ roomList }}</p>
        <p class="login__danger">{{ chatArray }}</p>
        <p v-if="errorText" class="login__danger">{{ errorText }}</p>
        <button type="submit" class="login__button">Enter Chat</button>
      </form>
    </div>
    <button @click="createRandomLogin" class="login__button">
      Random name
    </button>
    <p>{{ rooms }}</p>
    <div
      class="user__list"
      v-for="chatUser in userList"
      :key="chatUser.toString()"
    >
      <span class="user__item">{{ chatUser }}: </span>
    </div>
    <div class="room__list" v-for="chatItem in chatArray" :key="chatItem.id">
      <span class="room__title">{{ chatItem.room }}: </span>
      <span class="room__users">{{ chatItem.users }}</span>
      <span class="room__id">{{ chatItem.id }}</span>
    </div>
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
      chatArray: [],
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
        if (!this.roomSet.has(this.room)) {
          this.roomSet.add(this.room);
          let newUsers = [this.name];
          fb.collection("rooms")
            .add({
              room: this.room,
              users: newUsers
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          let openRoom = this.chatArray.find(
            element => element.room == this.room
          );
          openRoom.users.push(this.name);
          console.log(openRoom);
          fb.collection("rooms")
            .doc(openRoom.id)
            .update({
              users: openRoom.users
            });
        }
      } else {
        this.errorText = "duplicate name";
        return;
      }
      this.userList = [...new Set(this.userSet)];
      //     this.rooms = [...new Set(this.roomSet)];
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
    let chatArray = this.chatArray;

    fb.collection("rooms")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          roomSet.add(doc.data().room);
          doc.data().users.forEach(function(user) {
            userSet.add(user);
          });
          chatArray.push({
            id: doc.id,
            users: doc.data().users,
            room: doc.data().room
          });
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

.user__list {
  display: grid;
  grid-auto-flow: row;
  width: 100vw;
}

.user__item {
  font-size: 1rem;
  font-weight: 600;
  background: skyblue;
  color: white;
  width: 100%;
}

.room__list {
  padding: 0.3rem 0.5rem;
  display: grid;
  grid-auto-flow: row;
  gap: 0rem 1rem;
  justify-items: center;
  align-items: start;
  align-content: space-between;
  background-color: hsla(178, 99%, 99%, 15);
}

.room__title {
  border: 0.3rem double hsla(178, 100%, 37%, 1);
  padding: 0.3rem;
  font-weight: 700;
  text-align: center;
  color: white;
  background-color: hsla(21, 70%, 44%, 1);
}
.room__users {
  width: 100%;
  padding: 0.3rem;
  color: hsla(21, 70%, 44%, 1);
  font-weight: 600;
  font-size: 1rem;
  text-align: left;
}
.room__id {
  padding: 0.2rem;
  color: hsla(178, 100%, 37%, 1);
  font-weight: 500;
  text-align: left;
}
</style>
