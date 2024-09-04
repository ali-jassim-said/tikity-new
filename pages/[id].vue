<template v-slot:activator="{ props: activatorProps }">
  <div class="details" >
    <nav>
      <img src="../public/svg/Subtract.svg" alt="" />
      <div class="nav-text">
        <button class="login">
          <span>تسجيل الدخول</span>
        </button>
        <span>|</span>
        <button class="register">انشاء حساب</button>
      </div>
    </nav>
    <div class="details-flex">
      <div class="img1">
        <div
          v-if="event && event.event"
          class="details-img2"
          :style="{ backgroundImage: `url(${eventImage(event)})` }"
        ></div>
        <div class="map" id="map" style="width: 100%; height: 245px"></div>
        <div class="event-details">
          <div class="one">
            <div class="star">
              <div>5</div>
              <img src="../public/icons/star.svg" alt="">
            </div>
            <div class="logo-svg">
              <div class="logo-card">
                <p>ينضم بوساطة</p>
                <div>ABC Group</div>
              </div>
              <img src="../public/svg/logo-card.svg" alt="" />
            </div>
          </div>
          <div class="two">
            <p>حفلات غنائية</p>
            <img src="../public/icons/Music notes.svg" alt="">
          </div>
          <div class="two">
            <p>12 اكتوبر 2025</p>
            <img src="../public/icons/detaile.svg" alt="">
          </div>
          <div class="two">
            <p>05 : 00 PM</p>
            <img src="../public/icons/tabler-icon-clock-star.svg" alt="">
          </div>
        </div>
      </div>
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
              <img src="/img/Mobile app store badge.png" alt="" />
            </button>
            <button>
              <img src="/img/Mobile app store badge.png" alt="" />
            </button>
          </div>
        </div>
        <div class="detaile-card">
          <div class="one">
            <div class="detaile">
              <div class="number">
                <p>بطاقة</p>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max="5"
                />
              </div>
              <p class="price">20,000 د.ع</p>
            </div>
            <p>بطاقة دخول عادية بالمقصوره الاولى</p>
          </div>
          <div class="one">
            <div class="detaile">
              <div class="number">
                <p>بطاقة</p>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max="5"
                />
              </div>
              <p class="price">20,000 د.ع</p>
            </div>
            <p>بطاقة دخول عادية بالمقصوره الاولى</p>
          </div>
          <div class="one">
            <div class="detaile">
              <div class="number">
                <p>بطاقة</p>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max="100"
                />
              </div>
              <p class="price">20,000 د.ع</p>
            </div>
            <p>بطاقة دخول عادية بالمقصوره الاولى</p>
          </div>
            <button class="button" 
            v-bind="activatorProps"
            @click="showDialog = true"
            color="surface-variant"
            text="Open Dialog"
            variant="flat"><span>حجز التذاكر الان</span></button>
        </div>
      </div>
    </div>
      <category-1/>

    <div class="down">
      <div class="footer-down">
        <div class="one">
          <div class="logo">
            <img src="../public/svg/logo-footer.svg" alt="" />
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
  </div>
  <poop-up v-model="showDialog"/>
</template>


<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useEventsStore } from "~/stores/events";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const map = ref(null);
let leafletMap = null;

onMounted(() => {
  leafletMap = L.map("map").setView([33.3152, 44.3661], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}", {
    foo: "bar",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(leafletMap);

  L.marker([33.3152, 44.3661]).addTo(leafletMap).bindPopup("A sample popup.");

  map.value = leafletMap;
});

const route = useRoute();
const { id } = route.params;
const eventsStore = useEventsStore();

const loading = ref(false);
const error = ref(null);
const event = ref(null);

const fetchEvent = async (eventId) => {
  loading.value = true;
  error.value = null;
  event.value = null;
  try {
    await eventsStore.fetchEventById(eventId);
    event.value = eventsStore.event;
  } catch (err) {
    error.value = err.response ? err.response.data.message : err.message;
  } finally {
    loading.value = false;
  }
};

const showDialog = ref(false);

function confirmBooking() {
  showDialog.value = false; 
}

onMounted(() => {
  fetchEvent(id);
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
  return image ? `https:${image.imageUrl}` :"default-image-url";
};
</script>
<style scoped>
@import '../public/css/detailePage.css';
</style>
