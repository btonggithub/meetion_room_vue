import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import VeeValidate from "vee-validate";
import Layout from "@/components/Layout";
import FullCalendar from "@fullcalendar/vue";

// style sheet
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "alertifyjs/build/css/alertify.css";
import "alertifyjs/build/css/themes/default.css";
import "./assets/styles.css";
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'

// javascript
import * as jquery from "jquery";
import * as alertify from "alertifyjs";
import "bootstrap";

// Validate
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

Vue.use(VueMoment, {
  moment,
})
// Filters : formate ส่งมาจาก หน้า .vue ได้ เช่น {{ item.bk_time_start | date("dddd, MMMM Do YYYY, h:mm:ss a") }}
Vue.filter("date", (value, formate = 'YYYY-MM-DD hh:mm a') => {
  return moment(value).format(formate);
});

Vue.config.productionTip = true;
Vue.prototype.jquery = jquery;
Vue.prototype.alertify = alertify;
Vue.prototype.dayGridPlugin = dayGridPlugin;
Vue.prototype.interactionPlugin = interactionPlugin;
Vue.prototype.timeGridPlugin = timeGridPlugin;
Vue.use(VeeValidate);
Vue.component("Layout", Layout);
Vue.component("FullCalendar", FullCalendar);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
