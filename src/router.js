import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Chat from "@/views/Chat.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
      /*       beforeEnter: (to, from, next) => {
        if (to.params.name || sessionStorage.clear()) {
          next();
        } else {
          next({ name: "login" });
        }
      } */
    },
    {
      path: "/chat",
      name: "chat",
      component: Chat,
      props: true,
      beforeEnter: (to, from, next) => {
        if (to.params.name || sessionStorage.getItem("username")) {
          next();
        } else {
          next({ name: "login" });
        }
      }
    }
  ]
});
