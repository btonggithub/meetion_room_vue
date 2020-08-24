<template>
  <div class="modal fade" tabindex="-1" role="dialog" id="BookingDialog">
    <div class="modal-dialog" role="document">
      <form class="modal-content" @submit.prevent="onSubmit()">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fa fa-ticket"></i> จองห้องประชุมนี้
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="">หัวข้อที่จะประชุม</label
            ><input
              type="text"
              name="bk_title"
              v-model.trim="form.bk_title"
              v-validate="{ required: true }"
              :class="{ 'is-invalid': errors.has('bk_title') }"
              class="form-control"
            />
            <p class="invalid-feedback">{{ errors.first("bk_title") }}</p>
          </div>
          <div class="form-group">
            <label for="">รายละเอียดอื่นๆ</label
            ><textarea
              v-model.trim="form.bk_detail"
              class="form-control"
              rows="4"
            />
          </div>

          <div class="row">
            <div class="col-sm-7">
              <div class="form-group">
                <label for="">เริ่มประชุมวันที่</label
                ><input
                  type="date"
                  name="bk_time_start_date"
                  v-model="form.bk_time_start.date"
                  v-validate="{ required: true }"
                  :class="{ 'is-invalid': errors.has('bk_time_start_date') }"
                  class="form-control"
                />
                <p class="invalid-feedback">* start date</p>
              </div>
            </div>
            <div class="col-sm-5">
              <div class="form-group">
                <label for="">เวลา</label
                ><input
                  type="time"
                  name="bk_time_start_time"
                  v-model="form.bk_time_start.time"
                  v-validate="{ required: true }"
                  :class="{ 'is-invalid': errors.has('bk_time_start_time') }"
                  class="form-control"
                />
                <p class="invalid-feedback">* start time</p>
              </div>
            </div>

            <div class="col-sm-7">
              <div class="form-group">
                <label for="">สิ้นสุดวันที่</label
                ><input
                  type="date"
                  name="bk_time_end_date"
                  v-model="form.bk_time_end.date"
                  v-validate="{ required: true }"
                  :class="{ 'is-invalid': errors.has('bk_time_end_date') }"
                  class="form-control"
                />
                <p class="invalid-feedback">* end date</p>
              </div>
            </div>
            <div class="col-sm-5">
              <div class="form-group">
                <label for="">เวลา</label
                ><input
                  type="time"
                  name="bk_time_end_time"
                  v-model="form.bk_time_end.time"
                  v-validate="{ required: true }"
                  :class="{ 'is-invalid': errors.has('bk_time_end_time') }"
                  class="form-control"
                />
                <p class="invalid-feedback">* end time</p>
              </div>
            </div>
          </div>

          <div class="form-group mt-2">
            <label for="">อุปกรณ์ห้องประชุม</label>
            <div class="form-row">
              <div
                class="col-sm-4"
                v-for="(item, index) in equipment"
                :key="item.eq_id"
              >
                <div class="form-check" :title="item.eq_name">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="form.equipments[index]"
                    :true-value="item"
                  />
                  <label class="form-check-label" for="defaultCheck1">
                    {{ item.eq_name }}
                  </label>
                </div>
              </div>
            </div>
            <div
              class="img-equipment"
              :style="{
                'background-image': `url(/api/uploads/${item.eq_image})`,
              }"
              v-for="item in equipmentItems"
              :key="item.eq_id"
            ></div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="bubmit" class="btn btn-info btn-block mt-2 mb-4">
            จองห้องประชุม
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  name: "BookingDialog",
  mounted() {
    // ตรวจจับ event การปิดหน้า modal dialog
    this.jquery("#BookingDialog").on("hidden.bs.modal", (event) => {
      this.$emit("onClose", event);
    });

    // ดึงข้อมูลอุปกรณ์ ห้องประชุม
    this.initalLoadEquipments();
  },
  computed: {
    equipmentItems() {
      const equipments = this.form.equipments;
      if (equipments && equipments.length > 0) {
        return equipments.filter((item) => item);
      }
      return [];
    },
  },
  data() {
    return {
      equipment: [],
      form: {
        tb_rooms_r_id: "",
        bk_title: "",
        bk_detail: "",
        bk_time_start: { date: "", time: "" },
        bk_time_end: { date: "", time: "" },
        equipments: [],
      },
    };
  },
  props: {
    room: {
      required: true,
    },
  },
  watch: {
    // จะทำงานต่อเมื่อ ค่ามีการเปลี่ยนแปลง
    room(value) {
      if (!value) return;
      this.jquery("#BookingDialog").modal();
      this.form.tb_rooms_r_id = value.r_id;
    },
  },
  methods: {
    //ดึงข้อมูล
    initalLoadEquipments() {
      Axios.get("/api/booking/equipments")
        .then((response) => (this.equipment = response.data))
        .catch((err) => {
          this.alertify.error(err.response.data.message);
        });
    },
    // บันทึกข้อมูล
    onSubmit() {
      this.$validator.validateAll().then((valid) => {
        if (!valid) return;
        const requestData = { ...this.form };
        requestData.bk_time_start = this.onMergeDatetime(
          requestData.bk_time_start
        );
        requestData.bk_time_end = this.onMergeDatetime(requestData.bk_time_end);
        requestData.equipments = this.equipmentItems.map((item) => item.eq_id);
        // send data to backend
        Axios.post("/api/booking", requestData)
          .then((response) => {
            this.onReset();
            this.jquery("#BookingDialog").modal("hide");
          })
          .catch((err) => this.alertify.error(err.response.data.message));
      });
    },
    // set string dateitem to Datetime
    onMergeDatetime({ date, time }) {
      const datetime = new Date(date);
      const [hours, minute] = time.split(":");
      datetime.setHours(hours, minute);
      return datetime;
    },
    // ล้างข้อมูล จาก Form
    onReset() {
      this.$validator.reset();
      this.form = {
        tb_rooms_r_id: "",
        bk_title: "",
        bk_detail: "",
        bk_time_start: { date: "", time: "" },
        bk_time_end: { date: "", time: "" },
        equipments: [],
      };
    },
  },
};
</script>

<style scoped>
.modal {
  color: #525b62;
}

.modal-body,
.modal-footer {
  padding-left: 10%;
  padding-right: 10%;
}

.form-check {
  margin-bottom: 15px;
  /* ตรงนี้ จะทำให้ ประโยค ที่ยาว เป็น ... ต่อท้าย */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.img-equipment {
  width: 90px;
  height: 70px;
  border: solid 1px #d0d0d0;
  display: inline-block;
  margin: 1px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
