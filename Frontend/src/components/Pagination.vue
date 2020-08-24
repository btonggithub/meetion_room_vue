<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-end">
      <li class="page-item" :class="{ disabled: page <= 1 }">
        <a @click.prevent="onPage(page - 1)" class="page-link" href="#">«</a>
      </li>
      <li
        class="page-item"
        v-for="item in getPageItems"
        :key="item"
        :class="{ active: page === item }"
      >
        <a @click.prevent="onPage(item)" class="page-link" href="#">{{
          item
        }}</a>
      </li>
      <li class="page-item" :class="{ disabled: page >= getPageItems.length }">
        <a @click.prevent="onPage(page + 1)" class="page-link" href="#">»</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    data: {
      required: true,
    },
    page: {
      default: 1,
      required: true,
      type: Number,
    },
  },
  computed: {
    getPageItems() {
      const pages = [];
      try {
        if (this.data && this.data.rows && this.data.result) {
          const rows = this.data.rows;
          const limit = this.data.limit;
          for (let index = 1; index <= Math.ceil(rows / limit); index++) {
            pages.push(index);
          }
        }
      } catch (error) {
        console.log(error);
      }
      return pages;
    },
  },
  methods: {
    onPage(page) {
      this.$emit("onPage", page);
    },
  },
};
</script>

<style scoped>
.pagination{
  flex-wrap: wrap;
}
</style>
