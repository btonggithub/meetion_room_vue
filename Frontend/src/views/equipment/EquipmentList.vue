<template>
  <Layout>
    <div slot="buttons" class="form-group">
      <router-link :to="{ name: 'equipment-list' }" class="btn router-link-head"
        >รายการข้อมูล</router-link
      >
      <router-link :to="{ name: 'equipment-form' }" class="btn router-link-head"
        >เพิ่มข้อมูลใหม่</router-link
      >
    </div>

    <div class="card mb-3">
      <div class="card-body">
        <header class="mb-4">
          <Search
            :types="search_types"
            @onSearch="onSearch2($event)"
            :page="page"
          />

          <h5>
            <i class="fa fa-list" aria-hidden="true"></i
            >&nbsp;รายการข้อมูลอุปกรณ์ห้องประชุม
          </h5>
        </header>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th class="d-none d-sm-table-cell">#</th>
                <th>ชื่ออุปกรณ์ห้องประชุม</th>
                <th>รายละเอียด</th>
                <th>วันที่แก้ไขล่าสุด</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in equipments.result" :key="item.eq_id">
                <td class="d-none d-sm-table-cell">
                  <div class="img-contianer">
                    <img
                      :src="`/api/uploads/${item.eq_image}`"
                      :alt="item.eq_image"
                    />
                  </div>
                </td>
                <td>{{ item.eq_name }}</td>
                <td>{{ item.eq_detail || "-" }}</td>
                <td>{{ item.eq_updated | date }}</td>
                <td class="text-right no-wrap">
                  <i
                    @click="onUpdate(item)"
                    class="pointer fa fa-edit text-info mr-3"
                  ></i>
                  <i
                    @click="onDelete(item)"
                    class="pointer fa fa-trash text-danger"
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :data="equipments" :page="page" @onPage="onPage2($event)" />
      </div>
    </div>
  </Layout>
</template>

<script>
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { mapState } from "vuex";
import Axios from "axios";
export default {
  name: "EquiptmentList",
  data() {
    return {
      search_types: [
        { name: "ชื่ออุปกรณ์ห้องประชุม", value: "eq_name" },
        { name: "รายละเอียด", value: "eq_detail" },
      ],
      page: 1,
      limit: 5,
      search: {},
    };
  },
  computed: {
    ...mapState(["equipments"]),
  },
  components: {
    Pagination,
    Search,
  },
  created() {
    this.$store.dispatch("get_equipments");
  },
  methods: {
    // pagination
    onPage2(page) {
      this.page = page;
      this.$store.dispatch("get_equipments", {
        page: this.page,
        limit: this.limit,
        ...this.search,
      });
    },
    // filter search
    onSearch2(search) {
      this.search = search;
      this.page = 1;
      this.$store.dispatch("get_equipments", {
        page: this.page,
        limit: this.limit,
        ...this.search,
      });
    },
    // delete
    onDelete(item) {
      this.alertify.confirm("คุณต้องการจะลบข้อมูลนี้ใช่หรือไม่!", () => {
        Axios.delete(`/api/equipment/${item.eq_id}`)
          .then(() => {
            this.alertify.message("ลบรายการสำเร็จ!");
            this.$store.dispatch("get_equipments");
          })
          .catch((error) => this.alertify.error(error.response.data.message));
      });
    },
    // update ทำการส่ง id to update from
    onUpdate(item) {
      // with query, resulting in /register?plan=private
      this.$router.push({ name: "equipment-form", query: { id: item.eq_id } });
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

h5 {
  vertical-align: middle;
}
</style>
