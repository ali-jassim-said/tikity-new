<template>
  <div class="section-category">
    <div class="container">
      <div class="category">
        <div class="header">
          <div class="text">أكتشف جميع الاحداث</div>
        </div>
        <v-sheet style="background-color: transparent; direction: rtl;" width="100%" class="category-cards">
          <v-slide-group v-model="eventsStore.events" class="pa-2" style="width: 100%;">
            <v-slide-group-item v-for="(event, index) in eventsStore.events" :key="index" class="cards">
              <v-card class="card ma-4">
                <div class="card-img" :style="{ backgroundImage: 'url(' + eventImage(event) + ')' }">
                  <div class="date">
                    <p class="number">{{ new Date(event.startDate).getDate() }}</p>
                    <p class="text">{{ new Date(event.startDate).toLocaleString("default", { month: "short" }) }}</p>
                  </div>
                  <i class="ri-calendar-2-line"></i>
                </div>
                <div class="card-text">
                  <div class="card-date">
                    <p>{{ event.title }}</p>
                    <div class="date">
                      <p>{{ new Date(event.startDate).toLocaleDateString() }}</p>
                      <i class="ri-calendar-2-line"></i>
                    </div>
                    <div class="date">
                      <p>{{ event.ticketTypes.length ? event.ticketTypes[0].price : "N/A" }} د.ع</p>
                      <i class="ri-calendar-2-line"></i>
                    </div>
                    <div class="date">
                      <p>{{ event.ticketTypes.length ? event.ticketTypes[0].title : "No ticket types available" }}</p>
                      <i class="ri-calendar-2-line"></i>
                    </div>
                  </div>
                  <div class="card-price">
                    <button><span>حجز تذكرة</span></button>
                    <div class="price">
                      <p>يبدء سعر حجز التذاكر</p>
                      <div class="iq">{{ event.ticketTypes.length ? event.ticketTypes[0].price : "N/A" }} د.ع</div>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useEventsStore } from "~/stores/events"; 

const eventsStore = useEventsStore();
const activeIndex = ref(0);

// Function to fetch events
onMounted(() => {
  eventsStore.fetchEvents(
    eventsStore.PageNumber,
    eventsStore.PageSize,
    eventsStore.categoryId,
    eventsStore.collectionId
  );
});

// Function to get the correct image URL for an event
const eventImage = (event) => {
  if (!event || !event.images) {
    return '/path/to/default-image.jpg'; // Replace with your default image path
  }
  const image = event.images.find(image => image.eventImageType === 1);
  return image ? `https://${image.imageUrl}` : '/path/to/default-image.jpg'; // Replace with your default image path
};


</script>


<style scoped>
@import '../public/css/category1.css';
</style>
