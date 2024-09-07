<template>
  <div class="section-category">
    <div v-if="filteredCollections.length > 0" class="container" v-for="(collection, collectionIndex) in filteredCollections" :key="collectionIndex">
      <div class="category">
        <div class="header">
          <div class="text">{{ collection.name }}</div>
        </div>
        <v-sheet style="background-color: transparent; direction: rtl;" width="100%" class="category-cards">
          <v-slide-group class="pa-2" style="width: 100%;">
            <v-slide-group-item v-for="(event, index) in events[collection.id]" :key="index" class="cards">
              <nuxt-link :to="`details/${event.id}`">
              <v-card class="card ma-4">
                <div class="card-img" :style="{ backgroundImage: `url(${eventImage(event)})` }">
                  <div class="date">
                    <p class="number">{{ new Date(event.startDate).getDate() }}</p>
                    <p class="text">{{ new Date(event.startDate).toLocaleString('default', { month: 'short' }) }}</p>
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
                      <p>{{ event.ticketTypes.length ? event.ticketTypes[0].price : 'N/A' }} د.ع</p>
                      <i class="ri-calendar-2-line"></i>
                    </div>
                    <div class="date">
                      <p>{{ event.ticketTypes.length ? event.ticketTypes[0].title : 'No ticket types available' }}</p>
                      <i class="ri-calendar-2-line"></i>
                    </div>
                  </div>
                  <div class="card-price">
                    <button><span>حجز تذكرة</span></button>
                    <div class="price">
                      <p>يبدء سعر حجز التذاكر</p>
                      <div class="iq">{{ event.ticketTypes.length ? event.ticketTypes[0].price : 'N/A' }} د.ع</div>
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
    <div v-else class="no-events-message">No collections with events available.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useAllCollectionsStore } from '~/stores/collectionsAll';
import { useEventsStore } from '~/stores/events';

const store = useAllCollectionsStore();
const eventsStore = useEventsStore();

const collections = ref([]);
const events = ref({});

async function fetchData() {
  await store.fetchCollections();
  collections.value = store.collections;
  events.value = store.events;

  await nextTick();

  filteredCollections.value = collections.value.filter(collection => events.value[collection.id] && events.value[collection.id].length > 0);
}

function eventImage(event) {
  if (!event || !event.images) {
    return '/path/to/default-image.jpg'; // Replace with a default image path if needed
  }
  const image = event.images.find(image => image.eventImageType === 1);
  return image ? `https://${image.imageUrl}` : '/path/to/default-image.jpg'; // Replace with a default image path if needed
}

const filteredCollections = ref([]);

onMounted(() => {
  fetchData();
});

watch(() => events.value, (newEvents) => {
  filteredCollections.value = collections.value.filter(collection => newEvents[collection.id] && newEvents[collection.id].length > 0);
});
</script>





<style scoped>
@import '../public/css/collection1.css';
</style>
