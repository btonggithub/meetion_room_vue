<template>
  <Layout>
    <search :types="search_types" @onSearch="onSearch" />
    <div class="form-group">
      <router-link :to="{ name: 'booking-room' }" class="btn router-link-head"
        >จองห้องประชุม</router-link
      >
      <router-link :to="{ name: 'booking-history' }" class="btn router-link-head"
        >ประวัติการจอง</router-link
      >
    </div>
    <div class="card mb-3">
      <div class="card-body">
        <header class="mb-4">
          <h5>
            <i class="fa fa-list" aria-hidden="true"></i
            >&nbsp;รายการข้อมูลประวัติการจองห้อง
          </h5>
        </header>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>หัวข้อประชุม</th>
                <th>วัน-เวลาที่เริ่ม</th>
                <th>วัน-เวลาที่สิ้นสุด</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in histories.result"
                :key="item.bk_id"
                :class="getStatusClass(item)"
              >
                <td>{{ item.bk_id }}</td>
                <td>{{ item.bk_title }}</td>
                <td>{{ item.bk_time_start | date }}</td>
                <td>{{ item.bk_time_end | date }}</td>
                <td class="text-light">
                  <label
                    class="badge badge-warning"
                    v-if="item.bk_status == 'pending'"
                    ><i class="fa fa-hourglass-end"></i> รอดำเนินการ</label
                  >
                  <label
                    class="badge badge-success"
                    v-if="item.bk_status == 'allowed'"
                    ><i class="fa fa-check-square-o"></i> อนุมัติแล้ว</label
                  >
                  <label
                    class="badge badge-danger"
                    v-if="item.bk_status == 'not allowed'"
                    ><i class="fa fa-window-close"></i> ไม่อนุมัติ</label
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pagination :data="histories" :page="page" @onPage="onPage($event)" />
      </div>
    </div>
  </Layout>
</template>

<script>
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { mapState } from "vuex";

export default {
  name: "BookingHistoryList",
  components: {
    Search,
    Pagination,
  },
  computed: {
    ...mapState({
      histories: (state) => state.booking_history,
    }),
  },
  data() {
    return {
      search_types: [
        { name: "หัวข้อประชุม", value: "bk_title" },
        { name: "วันที่เริ่ม", value: "bk_time_start", type: "date" },
        { name: "วันที่สิ้นสุด", value: "bk_tiem_end", type: "date" },
      ],
      page: 1,
      search: {},
    };
  },
  mounted() {
    this.$store.dispatch("get_booking_history");
  },
  methods: {
    // pagination
    onPage(page) {
      this.page = page;
      this.$store.dispatch("get_booking_history", {
        page: this.page,
        ...this.search,
      });
    },
    // search filter
    onSearch(search) {
      this.search = search;
      this.$store.dispatch("get_booking_history", {
        page: 1,
        ...this.search,
      });
    },
    // apply class ให้กับ row table
    getStatusClass(item) {
      const statusClass = {};
      statusClass[item.bk_status] = true;
      return statusClass;
    },
  },
};
</script>

<style scoped>
.btn {
  color: #ffffff;
  background-color: #ced4da;
  margin-right: 5px;
  min-width: 130px;
}

.btn.router-link-exact-active.router-link-active {
  background-color: #17a2b8;
}

.badge {
  width: 100px;
  border-radius: 0;
  font-weight: 400;
}

.allowed td {
  color: #28a745;
}

.not.allowed td {
  color: #dc3545;
}

@media (max-width: 575.98px) {

}
</style>
