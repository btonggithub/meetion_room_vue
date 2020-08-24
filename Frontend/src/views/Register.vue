<template>
  <div id="register" class="register">
    <img src="/img/logo.svg" alt="Logo" class="img-logo" />
    <div class="card">
      <h2 class="card-header cls-1">REGISTER</h2>
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
              v-validate="{ required: true, regex: /^[A-Za-z0-9]{6,15}$/ }"
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
              type="text"
              name="u_password"
              v-model.trim="form.u_password"
              v-validate="{ required: true, regex: /^[A-Za-z0-9]{6,15}$/ }"
              :class="{ 'is-invalid': errors.has('u_password') }"
              class="form-control"
            />
            <span class="invalid-feedback">{{
              errors.first("u_password")
            }}</span>
          </div>
          <div class="from-group">
            <label for="">ชื่อ</label>
            <input
              type="text"
              name="u_firstname"
              v-model.trim="form.u_firstname"
              v-validate="'required'"
              :class="{ 'is-invalid': errors.has('u_firstname') }"
              class="form-control"
            />
            <span class="invalid-feedback">{{
              errors.first("u_firstname")
            }}</span>
          </div>
          <div class="from-group">
            <label for="">นามสกุล</label>
            <input
              type="text"
              name="u_lastname"
              v-model.trim="form.u_lastname"
              v-validate="'required'"
              :class="{ 'is-invalid': errors.has('u_lastname') }"
              class="form-control"
            />
            <span class="invalid-feedback">{{
              errors.first("u_lastname")
            }}</span>
          </div>

          <button type="submit" class="btn btn-info btn-block mt-4">
            ลงทะเบียน
          </button>
          <button
            type="button"
            @click="onRedirectToLogin"
            class="btn btn-secondary btn-block mt-4"
          >
            เข้าสู่ระบบ
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
        u_firstname: "",
        u_lastname: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    // บันทึกข้อมูล
    submit() {
      this.$validator.validateAll().then((valid) => {
        if (!valid) return;

        axios
          .post("api/account/register", this.form)
          .then((response) => {
            this.onReset();
            this.onRedirectToLogin();
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
        u_firstname: "",
        u_lastname: "",
      };
    },
    onRedirectToLogin() {
      this.$router.push({ name: "Login" });
      this.$route.params.pathMatch;
    },
  },
};
</script>

<style scope>
.register {
  max-width: 500px;
  margin: 5% auto;
}

.img-logo {
  width: 85%;
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
  .register {
    padding-left: 10px;
    padding-right: 10px;
  }
  .img-logo {
    width: 90%;
  }
}
</style>
