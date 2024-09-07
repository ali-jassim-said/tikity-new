<template>
  <!-- Global Error Message -->
   <div v-if="hasError" class="error-message">
    <p>{{ error || emptyDataError }}</p>
  </div>

  <div
    v-else
    class="home"
    :style="{ backgroundImage: `url(${activeSlideImage}) !important` }"
  >
    <!-- Navbar -->
    <nav class="nav-home">
      <div class="svg-nav">
        <img src="/svg/Logo.svg" alt="svg-home" />
      </div>
      <nuxt-link to="/Login" class="nav-login">
        <div class="login-home">Login</div>
        <i class="ri-logout-box-r-line"></i>
      </nuxt-link>
       <div v-if="userName" class="user-greeting">
         {{ userName }}
      </div>
    </nav>

    <!-- Collections Section -->
    <div v-if="!hasError && !emptyDataError" class="collections">
      <div class="collections-head">
        <div class="collections-icon">
          <i class="ri-arrow-left-s-line" @click="prevSlide"></i>
          <i class="ri-arrow-right-s-line" @click="nextSlide"></i>
        </div>
        <div class="collections-text">
          <p>{{ selectedCollection.name }}</p>
        </div>
      </div>

      <!-- Event Cards Section -->
      <div class="collections-cards">
        <div class="card-text">
          <h2>{{ activeEvent.title || "No title available" }}</h2>
          <p class="description">
            {{ activeEvent.description || "No description available" }}
          </p>
        </div>

        <v-sheet style="background-color: transparent" max-width="50%">
          <v-slide-group
            next-icon=""
            prev-icon=""
            v-model="activeIndex"
            class="pa-2"
          >
            <v-slide-group-item
              v-for="event in events[selectedCollection.id]"
              :key="event.id"
            >
              <v-card
                style="
                  border-radius: 12px;
                  background-color: #fff;
                  text-align: end;
                "
                class="ma-4 card"
                height="216"
                width="177"
                @click="() => updateActiveSlide(event)"
              >
                <v-img
                  height="70%"
                  style="margin: 10px; border-radius: 12px"
                  cover
                  :src="eventImage(event)"
                ></v-img>
                <v-card-subtitle
                  class="card-subtitle"
                  height="100%"
                  style="color: #000 !important"
                >
                  {{ event.title || "No title available" }}
                </v-card-subtitle>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </div>
    </div>

    <div class="scroll" @click="scrollToSecondPage">

      <div class="scroll-text">عرض المزيد</div>
      <div class="scroll-icon">
        <i class="ri-arrow-down-double-fill"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCollectionStore } from '@/stores/collections';

const collectionStore = useCollectionStore();

const collections = ref([]);
const events = ref({});
const error = ref(null);
const eventError = ref(null);
const selectedCollection = ref({});
const activeEvent = ref({});
const activeSlideImage = ref("");
const activeIndex = ref(0);
const emptyDataError = ref("");

// Retrieve userName from localStorage
const userName = computed(() => localStorage.getItem('userName') || 'Guest');

// General error state (true if any error exists or data is empty)
const hasError = computed(
  () => error.value || eventError.value || emptyDataError.value
);

// Fetch collections from store
const fetchCollections = async () => {
  try {
    await collectionStore.fetchCollections();
    collections.value = collectionStore.collections;
    events.value = collectionStore.events;
    error.value = collectionStore.error;
    eventError.value = collectionStore.eventError;

    // Filter collections where collectionType === 2
    const filteredCollections = collections.value.filter(
      (collection) => collection.collectionType === 2
    );
    selectedCollection.value =
      filteredCollections.length > 0 ? filteredCollections[0] : {};

    // Check if collections or events are empty
    if (filteredCollections.length === 0) {
      emptyDataError.value = "No collections available.";
    } else if (
      !events.value[selectedCollection.value.id] ||
      events.value[selectedCollection.value.id].length === 0
    ) {
      emptyDataError.value = "No events available for the selected collection.";
    } else {
      // Reset the error if data is available
      emptyDataError.value = "";
      activeEvent.value = events.value[selectedCollection.value.id][0];
      activeSlideImage.value = eventImage(activeEvent.value);
    }
  } catch (err) {
    console.error("Error fetching collections:", err);
    error.value = "Failed to fetch collections.";
  }
};

// Get event image URL
const eventImage = (event) => {
  if (!event || !event.images) {
    return "/path/to/default-image.jpg"; // Replace with a default image path if needed
  }
  const image = event.images.find((image) => image.eventImageType === 1);
  return image ? `https://${image.imageUrl}` : "/path/to/default-image.jpg"; // Replace with a default image path if needed
};

// Update active slide and event
const updateActiveSlide = (event) => {
  activeEvent.value = event;
  activeSlideImage.value = eventImage(event);
};

// Navigate to previous slide
const prevSlide = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--;
    updateActiveSlide(
      events.value[selectedCollection.value.id][activeIndex.value]
    );
  }
};

// Navigate to next slide
const nextSlide = () => {
  if (
    activeIndex.value <
    events.value[selectedCollection.value.id].length - 1
  ) {
    activeIndex.value++;
    updateActiveSlide(
      events.value[selectedCollection.value.id][activeIndex.value]
    );
  }
};

// Scroll to the second page
const scrollToSecondPage = () => {
  window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
};

onMounted(async () => {
  await fetchCollections();
});
</script>

<style scoped>
@import "../public/css/home.css";
</style>