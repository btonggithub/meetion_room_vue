<template>
  <div class="modal fade" tabindex="-1" role="dialog" id="BookingDetailDialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fa fa-info"></i> รายละเอียดของห้องประชุม
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
        <div class="modal-body" v-if="roomItem">
          <div class="form-group">
            <img
              class="img-fluid"
              :src="`/api/uploads/${roomItem.r_image}`"
              :alt="roomItem.r_image"
            />
          </div>

          <div class="row black mt-4">
            <div class="col-sm-4 form-group">ชื่อห้อง</div>
            <div class="col-sm-8 form-group">: {{ roomItem.r_name }}</div>
          </div>

          <div class="row">
            <div class="col-sm-4 form-group">ขนาดความจุ</div>
            <div class="col-sm-8 form-group">
              : {{ roomItem.r_capacity }} คน
            </div>
          </div>

          <div class="row">
            <div class="col-sm-4 form-group">การจอง</div>
            <div class="col-sm-8 form-group">
              : {{ roomItem.r_booking }} จอง
            </div>
          </div>

          <div class="row">
            <div class="col-sm-4 form-group">รายละเอียด</div>
            <div class="col-sm-8 form-group">
              : {{ roomItem.r_detail || "ไม่มีข้อมูล" }}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="onBooking()" class="btn btn-info btn-block mt-2 mb-4">
            จองห้องประชุม
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
const modalID = "#BookingDetailDialog";

export default {
  name: "BookingDetailDialog",
  mounted() {
    // ตรวจจับ event การปิดหน้า modal dialog
    this.jquery(modalID).on("hidden.bs.modal", (event) => {
      this.$emit("onClose", event);
    });
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
      // request data detail booking by id from backend
      Axios.get(`/api/booking/room/${value.r_id}`)
        .then((res) => {
          this.jquery(modalID).modal();
          this.roomItem = res.data;
        })
        .catch((err) => {
          this.alertify.error(err.response.data.message);
        });
    },
  },
  data() {
    return {
      roomItem: null,
    };
  },
  methods: {
    onBooking() {
      this.jquery(modalID).modal("hide");
      const room = { ...this.room };
      setTimeout(() => {
        this.$emit("onBooking", room);
      }, 500);
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

.img-fluid {
  border: solid 1px #707070;
}

.black {
  color: #212529;
}
</style>
