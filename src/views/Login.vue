<template>
  <div class="login__container">
    <div class="login__card">
      <form @submit.prevent="login" class="login__form">
        <div
          class="input__wrap"
          :class="{ 'form-group--error': $v.name.$error }"
        >
          <label for="name">Username</label>
          <input
            type="text"
            class="login__input"
            :class="{ invalid: $v.name.$error }"
            placeholder="Enter your name ..."
            name="name"
            @blur="$v.name.$touch()"
            v-model="name"
          />
          <div class="error" v-if="!$v.name.required">Field is required</div>
          <div class="error" v-if="!$v.name.minLength">
            Name must have at least {{ $v.name.$params.minLength.min }} letters.
          </div>
        </div>
        <div
          class="input__wrap"
          :class="{ 'form-group--error': $v.password.$error }"
        >
          <label for="password">Password</label>
          <input
            type="password"
            class="login__input"
            :class="{ invalid: $v.password.$error }"
            placeholder="Enter your password ..."
            name="password"
            @blur="$v.password.$touch()"
            v-model="password"
          />
          <div class="error" v-if="!$v.password.required">
            Field is required
          </div>
          <div class="error" v-if="!$v.password.minLength">
            Must be characters {{ $v.password.$params.minLength.min }} long
          </div>
        </div>
        <div class="input__wrap">
          <label for="room">Room</label>
          <input
            type="text"
            class="login__input"
            placeholder="Enter room name ..."
            name="room"
            v-model.trim="$v.room.$model"
          />
          <div class="error" v-if="!$v.room.required">
            Field is required
          </div>
          <div class="error" v-if="!$v.room.minLength">
            Must be minLength {{ $v.room.$params.minLength }}
          </div>
        </div>
        <p v-if="errorText" class="login__danger">{{ errorText }}</p>
        <button type="submit" class="login__button" :disabled="$v.$invalid">
          Enter Chat
        </button>
      </form>
      <button @click="createRandomLogin" class="login__button">
        Generate login
      </button>
    </div>
    <div class="chat__board">
      <div class="chat__sidebar">
        <h5 class="room__title">Chatrooms</h5>
        <div class="sidebar__rooms">
          <div
            class="sidebar__users"
            v-for="userItem in chatArray"
            @click="pickRoom(userItem.room)"
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
  </div>
</template>

<script>
import fb from "@/firebase/init";
import { namesArray } from "@/names.js";
import { placesArray } from "@/places.js";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "login",
  data() {
    return {
      name: "",
      password: "",
      room: "",
      rooms: [],
      roomList: [],
      userList: [],
      checkPassword: [],
      roomSet: new Set(),
      userArray: [],
      chatArray: [],
      userSet: new Set(),
      errorText: null,
      namesArray: namesArray,
      placesArray: placesArray
    };
  },
  validations: {
    name: {
      required,
      minLength: minLength(3)
    },
    password: {
      required,
      minLength: minLength(4)
    },
    room: {
      required,
      minLength: minLength(4)
    }
  },
  methods: {
    login() {
      if (this.name === "") {
        this.errorText = "Please pick a nickname!";
        return;
      }
      if (this.password === "") {
        this.errorText = "Please enter password!";
        return;
      }
      if (this.room === "") {
        this.errorText = "Please pick a Chatroom name!";
        return;
      }
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
          fb.collection("users")
            .add({
              user: this.name,
              password: this.password
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          let openRoom = this.chatArray.find(
            element => element.room == this.room
          );
          openRoom.users.push(this.name);
          fb.collection("rooms")
            .doc(openRoom.id)
            .update({
              users: openRoom.users
            });
          fb.collection("users")
            .add({
              user: this.name,
              password: this.password
            })
            .catch(err => {
              console.log(err);
            });
        }
      } else {
        this.errorText = "duplicate name";
        this.checkPassword = this.userArray.filter(
          element => element.user == this.name
        );
        if (this.checkPassword[0].password == this.password) {
          this.$router.push({
            name: "chat",
            params: { name: this.name, room: this.room }
          });
        } else {
          this.errorText = "Please enter a correct password!";
          return;
        }
      }
      this.userList = [...new Set(this.userSet)];
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
      this.name = this.namesArray[
        Math.floor(Math.random() * this.namesArray.length)
      ];
      this.room = this.placesArray[
        Math.floor(Math.random() * this.placesArray.length)
      ];
    },
    pickRoom(user) {
      this.room = user;
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

    let userArray = this.userArray;
    fb.collection("users")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          userArray.push({
            id: doc.id,
            user: doc.data().user,
            password: doc.data().password
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
  height: 85vh;
}
.login__card {
  padding: 1rem 0.2rem;
  display: grid;
  grid-auto-flow: row;
  justify-content: center;
  align-items: center;
  grid-gap: 1rem;
  height: 40vh;
}
.login__title {
  font-size: 1rem;
  font-weight: 600;
}
.login__form {
  display: grid;
  grid-auto-flow: row;
  justify-content: center;
  align-items: center;
  grid-gap: 1rem;
}
.login__input {
  font-size: 1rem;
  font-weight: 600;
  padding: 0.2rem;
  color: hsla(178, 50%, 30%, 1);
  border: 0.2rem solid hsla(21, 70%, 44%, 1);
}

.invalid {
  border: 0.2rem solid red;
  background-color: #ffc9aa;
}

.error {
  color: red;
  font-size: 0.9rem;
  font-weight: 400;
  margin: 0;
}

.input__wrap {
  display: grid;
  grid-auto-flow: column;
  justify-content: space-minLength;
  align-items: center;
  grid-gap: 1rem;
}

@media all and (max-width: 736px) {
  .login__card {
    height: 100%;
  }

  .message__input {
    width: 90%;
  }

  .input__wrap {
    grid-auto-flow: row;
  }
}

label {
  font-size: 1rem;
  font-weight: 600;
  padding: 0.2rem;
  width: 100%;
  color: hsla(21, 80%, 60%, 1);
}

.login__danger {
  background-color: red;
}
.login__button {
  font-size: 1rem;
  padding: 0.3rem;
  font-weight: 700;
  font-size: 1rem;
  background-color: hsla(178, 100%, 37%, 1);
  border: 0.2rem solid white;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login__button:hover {
  color: hsla(178, 100%, 37%, 1);
  border: 0.2rem solid hsla(178, 100%, 37%, 1);
  background-color: white;
}

.login__button[disabled],
.login__button[disabled]:hover,
.login__button[disabled]:active {
  border: 0.2rem solid grey;
  background-color: white;
  color: grey;
  cursor: not-allowed;
}

.user__box {
  display: grid;
  grid-auto-flow: column;
  width: 100vw;
}

.user__item {
  display: grid;
  width: 100%;
}

.user__name {
  font-size: 1rem;
  font-weight: 600;
  background: skyblue;
  color: white;
  width: 100%;
}

.room__box {
  display: grid;
  grid-auto-flow: row;
  width: 100vw;
}

.room__list {
  padding: 0.3rem 0.5rem;
  display: grid;
  grid-auto-flow: column;
  gap: 0rem 1rem;
  justify-items: center;
  align-items: start;
  align-content: space-minLength;
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
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  color: white;
  background-color: hsla(178, 100%, 37%, 1);
  border-right: 0.2rem dotted hsla(21, 70%, 44%, 1);
}
</style>
