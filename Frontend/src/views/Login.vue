<template>
  <div id="register" class="login">
    <img src="/img/logo.svg" alt="Logo" class="img-logo" />
    <div class="card">
      <h2 class="card-header cls-1">LOGIN</h2>
      <div class="card-body card-body-log">
        <div v-if="errorMessage" class="alert alert-warning">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="submit">
          <div class="from-group">
            <label for="">ชื่อผู้ใช้งาน</label>
            <input
              type="text"
              name="u_username"
              v-validate="{ required: true }"
              v-model.trim="form.u_username"
              :class="{ 'is-invalid': errors.has('u_username') }"
              class="form-control"
            />
            <span class="invalid-feedback">{{
              errors.first("u_username")
            }}</span>
          </div>
          <div class="from-group">
            <label for="">รหัสผ่าน</label>
            <input
              type="password"
              name="u_password"
              v-model.trim="form.u_password"
              v-validate="{ required: true }"
              :class="{ 'is-invalid': errors.has('u_password') }"
              class="form-control"
            />
            <span class="invalid-feedback">{{
              errors.first("u_password")
            }}</span>
          </div>

          <button type="submit" class="btn btn-info btn-block mt-4">
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            @click="onRedirectToRegister"
            class="btn btn-secondary btn-block mt-4"
          >
            ลงทะเบียน
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Register",
  data() {
    return {
      form: {
        u_username: "",
        u_password: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    // ส่งข้อมูล login
    submit() {
      this.$validator.validateAll().then((valid) => {
        if (!valid) return;

        axios
          .post("/api/account/login", this.form)
          .then((response) => {
            this.$router.push({ name: "Home" });
          })
          .catch((err) => {
            this.errorMessage = err.response.data.message;
          });
      });
    },
    onReset() {
      this.errorMessage = "";
      this.$validator.reset();
      this.form = {
        u_username: "",
        u_password: "",
      };
    },
    onRedirectToRegister() {
      this.$router.push({ name: "Register" });
      this.$route.params.pathMatch;
    },
  },
};
</script>

<style scope>
.login {
  max-width: 500px;
  margin: 5% auto;
}

.img-logo {
  width: 90%;
  display: block;
  margin: auto;
  margin-bottom: 20px;
}

.cls-1 {
  font-size: 18px;
  font-family: Kanit-SemiBold, Kanit;
  font-weight: 800;
  letter-spacing: 5px;
  text-align: center;
}

.card-body-log {
  padding-left: 10% !important;
  padding-right: 10% !important;
  padding-bottom: 55px !important;
}

.from-group {
  margin-bottom: 15px;
}

/*Extra small devices (portrait phones, less than 576px) */
@media (max-width: 575.98px) {
  .card-body-log {
    padding-left: 15px !important;
    padding-right: 15px !important;
    padding-bottom: 55px !important;
  }
  .login {
    padding-left: 10px;
    padding-right: 10px;
  }
  .img-logo {
    width: 90%;
  }
}
</style>
