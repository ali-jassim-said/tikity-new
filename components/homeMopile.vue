<template>
  <div
    class="home"
    :style="{ backgroundImage: `url(${activeSlideImage}) !important` }"
  >
    <nav class="nav-home">
      <div class="svg-nav">
        <img src="../public/svg/Logo.svg" alt="svg-home" />
      </div>
      <div class="nav-login">
        <button>Login</button>
        <i class="ri-logout-box-r-line"></i>
      </div>
    </nav>
    <div class="collections">
      <div class="collections-cards">
        <div class="card-text">
          <h2>{{ activeEvent.title || "No title available" }}</h2>
          <p class="description">
            {{ activeEvent.description || "No description available" }}
          </p>
        </div>
        <v-sheet style="background-color: transparent" max-width="50%">
          <v-slide-group v-model="activeIndex" class="pa-2">
            <v-slide-group-item
              v-for="(event, index) in events[selectedCollection.id]"
              :key="event.id"
            >
              <v-card
                style="
                  border-radius: 50%;
                  background-color: transparent;
                  width: 70px;
                  height: 70px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-sizing: border-box;
                  transition: all .2s ease;
                "
                class="ma-1 card"
                :class="{ active: isActiveSlide(index) }"
                @click="() => updateActiveSlide(event)"
              >
                <v-img
                  height="70"
                  width="70"
                  style="border-radius: 50%"
                  cover
                  :src="eventImage(event)"
                ></v-img>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </div>
    </div>
    <div class="scroll">
      <div class="scroll-text">عرض المزيد</div>
      <div class="scroll-icon"><i class="ri-arrow-down-double-fill"></i></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useCollectionStore } from "@/stores/collections";

const collectionStore = useCollectionStore();

const collections = ref([]);
const events = ref({});
const error = ref(null);
const eventError = ref(null);
const selectedCollection = ref({});
const activeEvent = ref({});
const activeSlideImage = ref("");
const activeIndex = ref(0);

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

    if (
      events.value[selectedCollection.value.id] &&
      events.value[selectedCollection.value.id].length > 0
    ) {
      activeEvent.value = events.value[selectedCollection.value.id][0];
      activeSlideImage.value = eventImage(activeEvent.value);
      activeIndex.value = 0;
    }
  } catch (err) {
    console.error("Error fetching collections:", err);
    error.value = "Failed to fetch collections.";
  }
};

const eventImage = (event) => {
  if (!event || !event.images) {
    return "/path/to/default-image.jpg"; // Replace with a default image path if needed
  }
  const image = event.images.find((image) => image.eventImageType === 1);
  return image ? `https://${image.imageUrl}` : "/path/to/default-image.jpg"; // Replace with a default image path if needed
};

const updateActiveSlide = (event) => {
  activeEvent.value = event;
  activeSlideImage.value = eventImage(event);
  activeIndex.value = events.value[selectedCollection.value.id].findIndex(
    (e) => e.id === event.id
  );
};

const isActiveSlide = (index) => {
  return index === activeIndex.value;
};

watch(
  () => collectionStore.collections,
  (newCollections) => {
    collections.value = newCollections;
  }
);

watch(
  () => collectionStore.events,
  (newEvents) => {
    events.value = newEvents;
  }
);

watch(
  () => collectionStore.error,
  (newError) => {
    error.value = newError;
  }
);

watch(
  () => collectionStore.eventError,
  (newEventError) => {
    eventError.value = newEventError;
  }
);

onMounted(async () => {
  await fetchCollections();
});
</script>

<style scoped>
@import '../public/css/homeMopile.css';
</style>
