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
              <img src="/img/Mobile app store badge.png" alt="App Store" />
            </button>
            <button>
              <img src="/img/Mobile app store badge.png" alt="Play Store" />
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
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useEventsStore } from "~/stores/events";
import { useLocationsStore } from "~/stores/locationsStore";

const map = ref(null);
let leafletMap = null;
let marker = null;

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

const fetchEvent = async (eventId) => {
  loading.value = true;
  error.value = null;
  event.value = null;
  try {
    await eventsStore.fetchEventById(eventId);
    event.value = eventsStore.event;

    if (event.value && event.value.event) {
      const coordinates = event.value.event.coordinate;

      if (coordinates) {
        const [latitudeStr, longitudeStr] = coordinates.split(",");
        const latitude = parseFloat(latitudeStr.trim());
        const longitude = parseFloat(longitudeStr.trim());

        if (!isNaN(latitude) && !isNaN(longitude)) {
          if (leafletMap) {
            leafletMap.setView([latitude, longitude], 13);

            if (marker) {
              leafletMap.removeLayer(marker);
            }

            marker = L.marker([latitude, longitude])
              .addTo(leafletMap)
              .bindPopup("Event Location")
              .openPopup();
          }
        } else {
          console.error("Invalid coordinates format");
        }
      } else {
        console.error("Coordinates not found in event data");
      }
    } else {
      console.error("Event data is not correctly formatted or missing");
    }
  } catch (err) {
    error.value = err.response ? err.response.data.message : err.message;
  } finally {
    loading.value = false;
  }
};

const fetchLocationsAndOpenDialog = async () => {
  try {
    await locationsStore.fetchCustomerLocations();
    locations.value = locationsStore.getAllLocations;
    showDialog.value = true;
  } catch (err) {
    console.error("Failed to fetch locations:", err);
  }
};

const validateQuantity = (ticketType) => {
  if (ticketType.selectedQuantity > ticketType.ticketsCount) {
    ticketType.selectedQuantity = ticketType.ticketsCount;
  }
  ticketQuantities.value[ticketType.id] = ticketType.selectedQuantity;
};

onMounted(async () => {
  if (id) {
    await fetchEvent(id);
  }

  if (process.client) {
    const L = (await import("leaflet")).default;
    leafletMap = L.map("map").setView([33.3152, 44.3661], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap);
  }
});

watch(
  () => route.params.id,
  (newId) => {
    fetchEvent(newId);
  }
);

const eventImage = (event) => {
  const image = event?.event?.images?.find(
    (image) => image.eventImageType === 1
  );
  return image ? `https:${image.imageUrl}` : "default-image-url";
};
</script>

<style scoped>
@import "../../public/css/detailePage.css";

.much {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
