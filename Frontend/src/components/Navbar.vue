<template>
  <nav class="navbar navbar-light">
    <a class="navbar-brand" href="#">
      <img src="/img/logo.svg" alt="logo" />
    </a>

    <a class="btn-logout" @click="onLogout"
      ><i class="fa fa-sign-out" aria-hidden="true"></i
    ></a>
  </nav>
</template>

<script>
import axios from "axios";
export default {
  name: "Navbar",
  methods: {
    onLogout() {
      axios
        .post("/api/account/logout")
        .then((response) => {
          this.$store.commit("set_user", null);
          this.$router.push({ name: "Login" });
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
  },
};
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  height: 60px;
  border-bottom: solid 1px #17a2b8;
  padding: 0;
}
.navbar-brand img {
  width: 262px;
  height: 45px;
}
.btn-logout {
  width: 80px;
  height: 60px;
  background-color: #17a2b8;
  color: #ffffff;
  font-size: 30px;
  text-align: center;
  line-height: 60px;
  cursor: pointer;
}

@media (max-width: 575.98px) {
  .navbar-brand img {
    width: 180px;
  }
}
</style>
