<template>
  <!-- Global Error Message -->
  <div v-if="hasError" class="error-message">
    <p>{{ errorMessage }}</p>
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="loading-spinner">Loading...</div>

  <!-- Events Section -->
  <div v-else class="section-category">
    <div class="container">
      <div class="category">
        <div class="header">
          <div class="text">أكتشف جميع الاحداث</div>
        </div>
        <v-sheet
          style="background-color: transparent; direction: rtl;"
          width="100%"
          class="category-cards"
        >
          <v-slide-group v-model="activeIndex" class="pa-2" style="width: 100%;">
            <v-slide-group-item
              v-for="(event, index) in eventsStore.events"
              :key="index"
              class="cards"
            >
              <nuxt-link :to="`details/${event.id}`">
              <v-card class="card ma-4">
                <div
                  class="card-img"
                  :style="{ backgroundImage: 'url(' + getEventImage(event) + ')' }"
                >
                  <div class="date">
                    <p class="number">{{ new Date(event.startDate).getDate() }}</p>
                    <p class="text">
                      {{ new Date(event.startDate).toLocaleString("default", { month: "short" }) }}
                    </p>
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
              </nuxt-link>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useEventsStore } from '~/stores/events'; 

const eventsStore = useEventsStore();
const activeIndex = ref(0);
const errorMessage = ref('');
const loading = ref(true);

// Function to fetch events on component mount
const fetchEvents = async () => {
  try {
    await eventsStore.fetchEvents(
      eventsStore.PageNumber,
      eventsStore.PageSize,
      eventsStore.categoryId,
      eventsStore.collectionId
    );
  } catch (err) {
    errorMessage.value = "Failed to fetch events.";
  } finally {
    loading.value = false;
  }
};

// Watch for changes in events and handle empty data
watch(
  () => eventsStore.events,
  (newEvents) => {
    if (newEvents.length === 0) {
      errorMessage.value = "No events available.";
    } else {
      errorMessage.value = ""; // Clear the empty data error if events are present
    }
  },
  { immediate: true }
);

// Function to get the correct image URL for an event
const getEventImage = (event) => {
  if (!event || !event.images) {
    return '/path/to/default-image.jpg'; // Replace with your default image path
  }
  const image = event.images.find(img => img.eventImageType === 1);
  return image ? `https://${image.imageUrl}` : '/path/to/default-image.jpg'; // Replace with your default image path
};

// Fetch events when component is mounted
onMounted(() => {
  fetchEvents();
});

// Computed property to check if there's an error
const hasError = computed(() => !!errorMessage.value);
</script>

<style scoped>
@import '../public/css/category1.css';
</style>
