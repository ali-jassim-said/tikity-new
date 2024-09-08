<template>
  <div class="details">
    <!-- Navigation Bar -->
    <nav>
      <img src="../../public/svg/Subtract.svg" alt="Subtract" />
      <div class="nav-text">
        <nuxt-link to="/Login" class="login"><span>تسجيل الدخول</span></nuxt-link>
        <span>|</span>
        <nuxt-link to="/Register" class="register">انشاء حساب</nuxt-link>
      </div>
    </nav>

    <!-- Event Details and Map -->
    <div class="details-flex">
      <div class="img1">
        <div
          v-if="event && event.event"
          class="details-img2"
:style="{ backgroundImage: `url(${eventImage(event)})` }"
        ></div>
        <div class="map" id="map" style="width: 100%; height: 245px"></div>
        <div class="event-details" v-if="event && event.event">
          <div class="one">
            <div class="star">
              <div>5</div>
              <img src="../../public/icons/star.svg" alt="Star" />
            </div>
            <div class="logo-svg">
              <div class="logo-card">
                <p>ينضم بوساطة</p>
                <div>{{ event.event.organizer.name }}</div>
              </div>
              <img
                :src="`https:${event.event.organizer.imageUrl}`"
                alt="Organizer Logo"
              />
            </div>
          </div>
          <div class="two">
            <p>{{ event.event.category.name }}</p>
            <img src="../../public/icons/Music notes.svg" alt="Category Icon" />
          </div>
          <div class="two">
            <p>
              {{
                new Date(event.event.startDate).toLocaleDateString("ar-EG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              }}
            </p>
            <img src="../../public/icons/detaile.svg" alt="Date Icon" />
          </div>
          <div class="two">
            <p>
              {{
                new Date(event.event.startDate).toLocaleTimeString("ar-EG", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </p>
            <img
              src="../../public/icons/tabler-icon-clock-star.svg"
              alt="Time Icon"
            />
          </div>
        </div>
      </div>

      <!-- Additional Event Details and Ticket Booking -->
      <div class="img2">
        <div class="category-cards">
          <div v-if="loading">Loading...</div>
          <div v-else-if="error">{{ error }}</div>
          <div v-else>
            <div v-if="event && event.event" class="card">
              <div
                class="card-img"
                :style="{ backgroundImage: `url(${eventImage(event)})` }"
              >
                <div class="date">
                  <p class="number">
                    {{ new Date(event.event.startDate).getDate() }}
                  </p>
                  <p class="text">
                    {{
                      new Date(event.event.startDate).toLocaleString(
                        "default",
                        { month: "short" }
                      )
                    }}
                  </p>
                </div>
                <i class="ri-calendar-2-line"></i>
              </div>
            </div>
          </div>
        </div>
        <div v-if="event && event.event" class="card-text">
          <h1>{{ event.event.title }}</h1>
          <p>{{ event.event.description }}</p>
        </div>
        <div class="text">
          <div class="pay">
            <button>
              <img src="../../public/img/Mobile app store badge.png" alt="App Store" />
            </button>
            <button>
              <img src="../../public/img/Mobile app store badge.png" alt="Play Store" />
            </button>
          </div>
        </div>
        <div
          v-if="event && event.event && event.event.ticketTypes"
          class="detaile-card"
        >
          <div
            v-for="ticketType in event.event.ticketTypes"
            :key="ticketType.id"
            class="one"
          >
            <div class="detaile">
              <div class="number">
                <p>بطاقة</p>
                <input
                  type="number"
                  v-model.number="ticketType.selectedQuantity"
                  min="1"
                  :max="ticketType.ticketsCount"
                  @input="validateQuantity(ticketType)"
                />
              </div>
              <div class="much">
                <p class="price">{{ ticketType.price }} د.ع</p>
                <div>{{ ticketType.ticketsCount }}</div>
              </div>
            </div>
            <p>{{ ticketType.title }}</p>
          </div>
          <button
            class="button"
            v-bind="activatorProps"
            @click="fetchLocationsAndOpenDialog"
            color="surface-variant"
            text="Open Dialog"
            variant="flat"
          >
            <span>حجز التذاكر الان</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Category Section -->
    <category-1 />

    <!-- Footer Section -->
    <div class="down">
      <div class="footer-down">
        <div class="one">
          <div class="logo">
            <img src="../../public/svg/logo-footer.svg" alt="Footer Logo" />
          </div>
          <div class="text">
            <div>Site map <span>|</span></div>
            <div>Terms & Conditions <span>|</span></div>
            <div>Accessibility <span>|</span></div>
            <div>Legal <span>|</span></div>
            <div>Privacy Policy</div>
          </div>
        </div>
        <div class="two">
          <div class="text">
            <p>Copyright © 2024 Alphabet Co.</p>
            <p>All rights reserved</p>
          </div>
          <div class="icons">
            <i class="ri-instagram-line"></i>
            <i class="ri-linkedin-fill"></i>
            <i class="ri-twitter-fill"></i>
            <i class="ri-youtube-fill"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Popup Component -->
    <poop-up 
      v-model="showDialog" 
      :locations="locations" 
      :event="event"  
      :ticketQuantities="ticketQuantities" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useEventsStore } from "~/stores/events";
import { useLocationsStore } from "~/stores/locationsStore";
import "leaflet/dist/leaflet.css";

const map = ref(null);
let leafletMap = null;
let marker = null;

// State and stores
const route = useRoute();
const { id } = route.params;
const eventsStore = useEventsStore();
const locationsStore = useLocationsStore();

const loading = ref(false);
const error = ref(null);
const event = ref(null);
const showDialog = ref(false);
const locations = ref([]);
const ticketQuantities = ref({});


// Fetch event details
const fetchEvent = async (eventId) => {
  loading.value = true;
  error.value = null;
  try {
    await eventsStore.fetchEventById(eventId);
    event.value = eventsStore.event;
    setupMap(); // Call function to set up the map after fetching event data
  } catch (err) {
    error.value = err.response ? err.response.data.message : err.message;
  } finally {
    loading.value = false;
  }
};

// Set up Leaflet map and markers
const setupMap = async () => {
  await nextTick(); // Ensure DOM is fully rendered
  if (process.client && event.value && event.value.event) {
    const coordinates = event.value.event.coordinate?.split(",");
    if (coordinates && coordinates.length === 2) {
      const latitude = parseFloat(coordinates[0].trim());
      const longitude = parseFloat(coordinates[1].trim());

      if (!leafletMap) {
        const L = (await import("leaflet")).default;
        leafletMap = L.map("map").setView([latitude, longitude], 13);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(leafletMap);
      }

      if (marker) marker.remove();
      marker = L.marker([latitude, longitude])
        .addTo(leafletMap)
        .bindPopup("Event Location")
        .openPopup();
    }
  }
};

// Fetch locations and open dialog
const fetchLocationsAndOpenDialog = async () => {
  try {
    await locationsStore.fetchCustomerLocations();
    locations.value = locationsStore.getAllLocations;
    showDialog.value = true;
  } catch (err) {
    console.error("Failed to fetch locations:", err);
  }
};

// Validate ticket quantity
const validateQuantity = (ticketType) => {
  if (ticketType.selectedQuantity > ticketType.ticketsCount) {
    ticketType.selectedQuantity = ticketType.ticketsCount;
  }
  ticketQuantities.value[ticketType.id] = ticketType.selectedQuantity;
};

// Format event date and time
const formatEventDate = (date) => {
  return new Date(date).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
const formatEventTime = (date) => {
  return new Date(date).toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Watch for route changes
watch(
  () => route.params.id,
  (newId) => {
    fetchEvent(newId);
  }
);

// Initialize component
onMounted(async () => {
  if (id) {
    await fetchEvent(id);
  }
});

// image
const eventImage = (event) => {
  const image = event?.event?.images?.find(
    (image) => image.eventImageType === 1
  );
  return image ? `https:${image.imageUrl}` : "default-image-url";
};
</script>

<style scoped>
@import "../../public/css/detailePage.css"; 
@import "leaflet/dist/leaflet.css";

.much {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
