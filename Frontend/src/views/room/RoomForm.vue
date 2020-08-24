<template>
  <Layout>
    <div slot="buttons" class="form-group">
      <router-link :to="{ name: 'room-list' }" class="btn router-link-head"
        >รายการข้อมูล</router-link
      >
      <router-link :to="{ name: 'room-form' }" class="btn router-link-head"
        >เพิ่มข้อมูลใหม่</router-link
      >
    </div>

    <div class="card mb-3">
      <div class="card-body">
        <header>
          <h5>
            <i class="fa fa fa-pencil-square-o" aria-hidden="true"></i
            >&nbsp;เพิ่ม/แก้ไข ข้อมูลห้องประชุม
          </h5>
        </header>
        <hr />
        <form @submit.prevent="onSubmit()">
          <div class="form-group">
            <label for="">ชื่อห้องประชุม</label>
            <input
              type="text"
              class="form-control"
              name="r_name"
              v-model.trim="form.r_name"
              v-validate="{ required: true }"
              :class="{ 'is-invalid': errors.has('r_name') }"
            />
            <p class="invalid-feedback">{{ errors.first("r_name") }}</p>
          </div>

          <div class="form-group">
            <label for="">ขนาดความจุ (คน)</label>
            <input
              type="text"
              class="form-control"
              name="r_capacity"
              v-model.trim="form.r_capacity"
              v-validate="{ required: true }"
              :class="{ 'is-invalid': errors.has('r_capacity') }"
            />
            <p class="invalid-feedback">{{ errors.first("r_capacity") }}</p>
          </div>

          <div class="form-group">
            <label for="">รายละเอียด</label>
            <textarea
              cols="30"
              rows="4"
              class="form-control"
              name="r_detail"
              v-model.trim="form.r_detail"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="btn btn-secondary btn-block">
              <i class="fa fa-upload"></i>
              <input
                type="file"
                class="d-none"
                @change="onChangeFile($event.target)"
              />
              อัพโหลดรูปภาพ</label
            >
            <div class="img-fluid-center">
              <img
                class="img-fluid"
                :src="form.r_image || '/img/no-image.png'"
                alt="image example"
              />
            </div>
          </div>

          <div class="form-group mb-5 mt-4">
            <div class="row">
              <div class="col-sm-6">
                <button type="submit" class="btn btn-info btn-block mb-2">
                  บันทึกข้อมูล
                </button>
              </div>
              <div class="col-sm-6">
                <router-link
                  :to="{ name: 'room-list' }"
                  type="button"
                  class="btn btn-danger btn-block mb-2"
                >
                  ยกเลิก
                </router-link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script>
import Axios from "axios";

export default {
  name: "EquiptmentList",
  data() {
    return {
      form: {
        r_name: "",
        r_capacity: 0,
        r_detail: "",
        r_image: "",
      },
    };
  },
  components: {
  },
  methods: {
    // send data to backend
    onSubmit() {
      this.$validator.validateAll().then((valid) => {
        if (!valid) return;
        if (this.jquery.trim(this.form.r_image) == "")
          return this.alertify.warning("กรุณาอัพโหลดรูปภาพ!");

        //ตรวจสอบว่า แก้ไข หรือ เพิ่มใหม่
        const updateId = this.$route.query.id;
        const request = isNaN(updateId)
          ? Axios.post("/api/room", this.form) //new
          : Axios.put(`/api/room/${updateId}`, this.form); //update

        request
          .then((res) => this.$router.push({ name: "room-list" }))
          .catch((error) => this.alertify.error(error.response.data.message));
      });
    },
    // แปลง file upload to base64
    onChangeFile(input) {
      this.form.r_image = "";
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.type.indexOf("image/") >= 0) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.addEventListener("load", () => {
            this.form.r_image = reader.result;
          });
          return;
        }
      }
      this.alertify.warning("กรุณาเลือกไฟล์ รูปภาพ ที่จะอัพโหลด!");
    },
    // นำข้อมูลจาก server ไปใส่ form เพื่อทำการ แก้ไข
    initialUpdateItem() {
      // const id = this.$router.currentRoute.query.id;
      const id = this.$route.query.id;
      if (isNaN(id)) return;
      Axios.get(`/api/room/${id}`)
        .then((res) => {
          this.form = res.data;
        })
        .catch(() => this.$router.push({ name: "room-list" }));
    },
  },
  watch: {
    "$route.query.id"() {
      this.form = {
        r_name: "",
        r_capacity: 0,
        r_detail: "",
        r_image: "",
      };
      this.$validator.reset();
    },
  },
  mounted() {
    this.initialUpdateItem();
  },
};
</script>

<style scoped>
form {
  max-width: 350px;
  margin: auto;
}

.btn.router-link-head {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 5px;
  min-width: 130px;
}

.btn.router-link-exact-active.router-link-active {
  background-color: #17a2b8;
}

img {
  border: solid 1px #6c757d;
}
</style>
