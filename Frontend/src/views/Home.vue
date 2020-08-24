<template>
  <div class="home">
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  components: {},
  mounted() {},
  created() {
    const userLogin = this.$store.state.user;
    // admin
    if (userLogin && userLogin.u_role === "admin")
      this.$router.push({ name: "booking-calendar" });
    // not admin
    else this.$router.push({ name: "booking-room" });
  },
};
</script>

<style scoped></style>
