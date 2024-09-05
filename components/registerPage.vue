<template>
  <div class="container">
    <div class="cover">
      <v-carousel
        height="100%"
        show-arrows="hover"
        cycle
        hide-delimiter-background
        class="radius"
      >
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-sheet :color="colors[i]" height="100%">
            <div class="flex fill-height">
              <h3>لورم اوبسم</h3>
              <div class="text-pic">{{ slide }}</div>
            </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </div>
    <div class="center">
      <div class="container-center">
        <div class="logo">
          <img src="../public/svg/Subtract.svg" alt="" />
        </div>
        <div>
          <div class="text">إنشاء حساب جديد</div>
          <p>أنشئ حساب جديد لكي تستطيع التذاكر ومواكبة جميع الاحداث الجديدة</p>
          <form @submit.prevent="handleRegister">
            <div class="data">
              <label>الاسم الكامل</label>
              <input
                type="text"
                placeholder="مثلا : احمد محمد حسن"
                required
                v-model="fullName"
              />
            </div>
            <div class="data">
              <label>الرمز</label>
              <input
                type="text"
                placeholder="password"
                required
                v-model="password"
              />
            </div>
            <div class="data">
              <label>البريد الالكتروني</label>
              <input
                type="email"
                placeholder="email@test.com"
                required
                v-model="email"
              />
            </div>
            <label>رقم الهاتف</label>
            <div class="select-box">
              <div class="selected-option" @click="toggleDropdown">
                <div>
                  <span class="iconify" :data-icon="selectedCountryIcon"></span>
                  <strong>{{ selectedCountryName }} </strong>
                  <!-- Show selected country name-->
                </div>
                <input
                  type="tel"
                  name="tel"
                  placeholder="Phone Number"
                  v-model="phone"
                />
              </div>
              <div class="options" :class="{ active: showDropdown }">
                <input
                  type="text"
                  class="search-box"
                  placeholder="Search Country Name"
                  v-model="searchQuery"
                  @input="searchCountry"
                />
                <ol>
                  <li
                    v-for="country in filteredCountries"
                    :key="country.code"
                    class="option"
                    @click="selectCountry(country)"
                  >
                    <div>
                      <i :class="country.code"></i>
                      <span class="country-name">{{ country.name }}</span>
                    </div>
                    <strong>+{{ country.phone }}</strong>
                  </li>
                </ol>
              </div>
            </div>
            <div class="area">
              <div class="data">
                <label>الدولة</label>
                <div class="select-box">
                  <select
                    v-model="selectedGovernorate"
                    class="input-style"
                    required
                  >
                      <option value="" disabled selected>اختر الدولة</option>
                    <option
                      v-for="governorate in governorates"
                      :key="governorate.id"
                      :value="governorate.id"
                    >
                      {{ governorate.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="data">
                <label>المحافظة</label>
                <input
                  type="text"
                  placeholder="المحافظة"
                  required
                  v-model="area"
                />
              </div>
            </div>

            <div class="btn">
              <div class="inner"></div>
              <button class="log" type="submit">تسجيل الدخول</button>
              <button class="register">
                ليس لديك حساب؟
                <nuxt-link to="/Register">قم بإنشاء حساب جديد</nuxt-link>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useGovernorateStore } from "../stores/governorateStore"; // Import the Governorate store
import { useRouter } from "vue-router";

const colors = ref([
  "indigo",
  "warning",
  "pink darken-2",
  "red lighten-1",
  "deep-purple accent-4",
]);
const slides = ref([
  "هو ببساطة نص شكلي (بمعنى أنه ليس بالضرورة نصًا) يُستخدم في صناعة الطباعة والتنضيد.",
  "هو ببساطة نص شكلي (بمعنى أنه ليس بالضرورة نصًا) يُستخدم في صناعة الطباعة والتنضيد.",
]);

const countries = ref([
  { name: "Iraq", code: "ri-twitter-fill", phone: 964 },
  { name: "Bahrain", code: "ri-twitter-fill", phone: 973 },
]);

const selectedCountryIcon = ref("ri-twitter-fill");
const selectedCountryCode = ref("");
const selectedCountryName = ref("choose");
const searchQuery = ref("");
const showDropdown = ref(false);

const fullName = ref("");
const email = ref("");
const phone = ref("");
const password = ref("");
const imageUrl = ref("");
const area = ref("");
const selectedGovernorate = ref(); // Selected governorate
const governorates = ref([]); // Governorate data from API

const authStore = useAuthStore();
const governorateStore = useGovernorateStore();
const router = useRouter();

const filteredCountries = computed(() => {
  if (!searchQuery.value) {
    return countries.value;
  }
  return countries.value.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const selectCountry = (country) => {
  selectedCountryIcon.value = country.code;
  selectedCountryCode.value = `+${country.phone}`;
  selectedCountryName.value = country.name;
  phone.value = selectedCountryCode.value;
  showDropdown.value = false;
};

const handleRegister = async () => {
  try {
    const payload = {
      name: fullName.value,
      phone: phone.value,
      email: email.value,
      password: password.value,
      governorateId: selectedGovernorate.value,
      area: area.value,
      imageUrl: '',
    };
    await authStore.register(payload);
    router.push("/");
  } catch (error) {
    alert("Registration failed. Please try again.");
  }
};

onMounted(async () => {
  try {
    await governorateStore.fetchGovernorate();
    governorates.value = governorateStore.getGovernorateData;
  } catch (error) {
    console.error("Failed to load governorates:", error);
  }
});
</script>

<style scoped>
@import "../public/css/register.css";

.input-style{
  height: 100%;
    width: 100%;
    padding: 10px 12px 10px 12px;
    font-size: 17px;
    border-radius: 12px;
    background: #f7f7f7;
    border: none;
    outline: none;
    cursor: pointer;
}

select option[value=""] {
  color: #000000; /* Grey color for placeholder text */
}

</style>
