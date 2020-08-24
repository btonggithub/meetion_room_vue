<template>
  <section class="card">
    <header class="card-header text-center">
      <h5 class="m-0" v-html="items.header"></h5>
    </header>
    <div class="card-body">
      <router-link
        v-for="(item, index) in items.navs"
        :key="index"
        class="sidebar-link"
        :to="item.link || '#'"
        ><i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
        {{ item.name }}
      </router-link>
    </div>
  </section>
</template>

<script>
export default {
  name: "sidebarNav",
  props: ["items"],
};
</script>

<style scoped>
h5 {
  font-size: 1rem;
}

.card {
  background: none;
  border: none;
}

.card > .card-header {
  padding-bottom: 10px;
  padding-top: 10px;
}

.card-body {
  padding: 1rem 0;
  padding-left: 0% !important;
  padding-right: 0% !important;
  padding-bottom: 10px !important;
}

.sidebar-link {
  display: block;
  padding: 0.5rem 1rem;
  margin-bottom: 2px;
  color: #525862;
  font-weight: 500;
  text-decoration: none;
}

.sidebar-link:hover,
.router-link-active {
  background: #dee2e6;
  color: #212529;
}

.sidebar-link.router-link-active, 
.sidebar-link.router-link-active .fa-chevron-circle-right,
.sidebar-link:hover,
.sidebar-link:hover .fa-chevron-circle-right {
  color: #212529;
}

.fa-chevron-circle-right {
  color: #17a2b8;
  margin-right: 5px;
}
</style>
