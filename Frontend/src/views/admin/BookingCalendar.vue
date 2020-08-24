<template>
  <Layout>
    <div class="card mb-3">
      <div class="card-body">
        <header class="mb-4">
          <form @submit.prevent="onSearch()" class="search-form form-inline">
            <select class="form-control" v-model="roomId">
              <option value="">เลือกห้องประชุม</option>
              <option
                :value="item.r_id"
                v-for="item in roomItems"
                :key="item.r_id"
                >{{ item.r_name }}</option
              >
            </select>
            <button type="submit" class="btn btn-secondary">
              <i class="fa fa-search"></i>
            </button>
          </form>
          <h5>
            <i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;
            ปฏิทินรายการจองห้องประชุม
          </h5>
        </header>
        <div class="demo-app-main">
          <FullCalendar
            class="fullcalendar"
            :options="calendarOptions"
            ref="fullCalendar"
            id="fullCalendar"
          />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Axios from "axios";

export default {
  components: {},
  data() {
    return {
      roomId: "",
      roomItems: [],
      calendarOptions: {
        locale: "th",
        plugins: [
          this.dayGridPlugin,
          this.timeGridPlugin,
          this.interactionPlugin,
        ],
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        buttonText: {
          today: "วันนี้",
          month: "เดือน",
          week: "สัปดาห์",
          day: "วัน",
        },
        events: [
          {
            title: "ทดสอบจอง",
            start: "2020-08-12T10:30:00",
            end: "2020-08-15T11:30:00",
            extendedProps: {
              department: "BioChemistry",
            },
            description: "Lecture",
          },
        ],
      },
    };
  },
  mounted() {
    this.initialLoadRoomSelect();
  },
  methods: {
    // ส่งข้อมูลห้องไปหาข้อมูลการจอง
    onSearch() {
      this.calendarOptions.events = [];
      if (!this.roomId || isNaN(this.roomId))
        return this.alertify.warning("Please select item!");
      // ส่ง room.r_id  ไปค้นหา การจอง
      Axios.get(`/api/booking/calendar/room/${this.roomId}`)
        .then((response) => {
          if (!response.data) this.alertify.info("Not found item!");
          const events = response.data.map((item) => {
            return {
              id: item.bk_id,
              title: item.bk_title,
              start: item.bk_time_start,
              end: item.bk_time_end,
              className: item.bk_status,
            };
          });
          this.calendarOptions.events = events;
          //   calendarApi.next();
          //   calendarApi.addEvent(events[0]);
        })
        .catch((err) => this.alertify.warning(err.response.data.message));
    },
    // โหลดข้อมูล ห้องประชุมมาแสดงใน select
    initialLoadRoomSelect() {
      Axios.get("/api/booking/rooms/select")
        .then((response) => {
          this.roomItems = response.data;
        })
        .catch((err) => this.alertify.warning(err.response.data.message));
    },
    // โหลดข้อมูลมา แสดงใน calender ui
    initialLoadCalendar() {},
  },
};
</script>

<style scoped>
.search-form {
  float: right;
  margin-bottom: 15px;
}
.form-control {
  margin-right: 5px;
}

.form-control:first-child {
  width: 270px;
}

.demo-app-main {
  flex-grow: 0;
  padding: 1em;
}

@media (max-width: 575.98px) {
  .search-form {
    float: initial;
  }

  .form-control {
    margin-right: 2%;
  }

  .form-control:first-child {
    width: 80%;
  }

  .btn-secondary {
    width: 18%;
  }

  h5 {
    font-size: larger;
  }

  #fullCalendar {
    width: 100%;
    border: lawngreen;
  }

  .demo-app-main {
    padding: 0;
  }
}
</style>
