<template>
  <Layout>
    <search :types="search_types" @onSearch="onSearch" />
    <div class="form-group">
      <router-link :to="{ name: 'booking-room' }" class="btn router-link-head"
        >จองห้องประชุม</router-link
      >
      <router-link
        :to="{ name: 'booking-history' }"
        class="btn router-link-head"
        >ประวัติการจอง</router-link
      >
    </div>
    <div v-if="rooms.rows > 0">
      <div class="card mb-3" v-for="item in rooms.result" :key="item.r_id">
        <div class="row align-items-center">
          <div class="col-sm-4">
            <img
              :src="`/api/uploads/${item.r_image}`"
              :alt="item.r_image"
              class="img-booking"
            />
          </div>
          <div class="col-sm-8">
            <div class="card-body">
              <div>ชื่อห้อง : {{ item.r_name }}</div>
              <div>ขนาด : {{ item.r_capacity }}</div>
              <div>รายละเอียด : {{ item.r_detail || "ไม่มีข้อมูล!" }}</div>
              <div class="btn-booking">
                <div @click="onBooking(item)" class="btn btn-info">
                  <i class="fa fa-ticket"></i> จองห้องประชุม
                </div>
                <div @click="onBookingDetail(item)" class="btn btn-secondary">
                  <i class="fa fa-info"></i> รายละเอียด
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      Not data
    </div>
    <Pagination :data="rooms" :page="page" @onPage="onPage" />
    <BookingDialog :room="roomItem" @onClose="roomItem = null" />
    <BookingDetailDialog
      :room="roomDetailItem"
      @onClose="roomDetailItem = null"
      @onBooking="roomItem = $event"
    />
  </Layout>
</template>

<script>
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import BookingDialog from "./BookingDialog";
import BookingDetailDialog from "./BookingDetailDialog";
import { mapState } from "vuex";

export default {
  components: {
    Search,
    Pagination,
    BookingDialog,
    BookingDetailDialog,
  },
  computed: {
    ...mapState(["rooms"]),
  },
  data() {
    return {
      page: 1,
      search: "",
      roomItem: null,
      roomDetailItem: null,
      search_types: [
        { name: "ชื่อห้อง", value: "r_name" },
        { name: "ขนาด", value: "r_capacity" },
        { name: "รายละเอียด", value: "r_detail" },
      ],
    };
  },
  mounted() {
    this.$store.dispatch("get_booking");
  },
  methods: {
    onSearch(search) {
      this.page = 1;
      this.search = search;
      this.$store.dispatch("get_booking", { page: this.page, ...this.search });
    },
    onPage(page) {
      this.page = page;
      this.$store.dispatch("get_booking", { page: this.page, ...this.search });
    },
    //เมื่อคลิก ที่ จองห้องนี้ show modal dialog
    onBooking(item) {
      this.roomItem = item;
    },
    //click show booking dialog detail
    onBookingDetail(item) {
      this.roomDetailItem = item;
    },
  },
};
</script>

<style scoped>
.btn.router-link-head {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 5px;
  min-width: 130px;
}

.btn.router-link-exact-active.router-link-active {
  background-color: #17a2b8;
}

.btn-booking .btn {
  margin-right: 10px;
  margin-top: 15px;
  width: 150px;
}

h5 {
  vertical-align: middle;
}

.card {
  color: #525b62;
  border-right: solid 5px #17a2b8;
}
.card-body {
  padding-left: 5px;
}

.img-booking {
  max-width: 100%;
}

@media (max-width: 575.98px) {
  .btn-booking .btn {
    width: 100%;
  }

  .card-body {
    padding-left: 1.25rem;
  }

}
</style>
