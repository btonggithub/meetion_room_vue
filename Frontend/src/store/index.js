import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    equipments: [],
    rooms: [],
    booking_history: [],
    bookings: [],
  },
  mutations: {
    set_user: (state, user) => (state.user = user),
    set_equipments: (state, equipments) => (state.equipments = equipments),
    set_rooms: (state, rooms) => (state.rooms = rooms),
    set_booking_history: (state, booking_history) =>
      (state.booking_history = booking_history),
    set_bookings: (state, bookings) => (state.bookings = bookings),
  },
  actions: {
    get_user_login: ({ commit }) =>
      Axios.get("/api/account/login").then((res) =>
        commit("set_user", res.data)
      ),
    get_equipments: ({ commit }, params = { page: 1 }) => {
      Axios.get(`/api/equipment`, { params }).then((res) =>
        commit("set_equipments", res.data)
      );
    },
    get_rooms: ({ commit }, params = { page: 1 }) => {
      Axios.get(`/api/room`, { params }).then((res) =>
        commit("set_rooms", res.data)
      );
    },
    get_booking: ({ commit }, params = { page: 1 }) => {
      Axios.get(`/api/booking`, { params }).then((res) =>
        commit("set_rooms", res.data)
      );
    },
    get_booking_history: ({ commit }, params = { page: 1 }) => {
      Axios.get(`/api/booking/history`, { params }).then((res) =>
        commit("set_booking_history", res.data)
      );
    },
    get_bookings_manage: ({ commit }, params = { page: 1 }) => {
      Axios.get(`/api/booking/manage`, { params }).then((res) =>
        commit("set_bookings", res.data)
      );
    },
  },
  modules: {},
});
