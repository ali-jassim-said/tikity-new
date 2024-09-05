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
            <div class="data">
              <label>رقم الهاتف</label>
              <div class="select-box">
                <select
                  v-model="selectedCountryCode"
                  @change="updatePhoneWithCountryCode"
                  class="input-style phone"
                  required
                >
                  <option value="" disabled>اختر البلد</option>
                  <option
                    v-for="country in countries"
                    :key="country.code"
                    :value="country.phone"
                  >
                    <i :class="country.code"></i> {{ country.name }} +{{
                      country.phone
                    }}
                  </option>
                </select>
                <input
                  type="tel"
                  name="tel"
                  placeholder="Phone Number"
                  v-model="phone"
                />
              </div>
              <div v-if="phoneError" class="error-message">
                {{ phoneError }}
              </div>
            </div>
            <div class="area">
              <div class="data">
                <label>الدولة</label>
                <select
                  v-model="selectedGovernorate"
                  class="input-style"
                  required
                >
                  <option value="" disabled>اختر الدولة</option>
                  <option
                    v-for="governorate in governorates"
                    :key="governorate.id"
                    :value="governorate.id"
                  >
                    {{ governorate.name }}
                  </option>
                </select>
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
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useGovernorateStore } from "../stores/governorateStore";
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

const selectedCountryCode = ref("");
const phone = ref("");
const fullName = ref("");
const email = ref("");
const password = ref("");
const area = ref("");
const selectedGovernorate = ref();
const governorates = ref([]);

const phoneError = ref(""); // New ref for phone error message

const authStore = useAuthStore();
const governorateStore = useGovernorateStore();
const router = useRouter();

const updatePhoneWithCountryCode = () => {
  const selectedCountry = countries.value.find(
    (country) => country.phone === parseInt(selectedCountryCode.value)
  );
  if (selectedCountry) {
    phone.value = `+${selectedCountry.phone}`;
  }
};

const handleRegister = async () => {
  try {
    phoneError.value = ""; // Clear previous error message
    const payload = {
      name: fullName.value,
      phone: phone.value,
      email: email.value,
      password: password.value,
      governorateId: selectedGovernorate.value,
      area: area.value,
      imageUrl: "",
    };
    await authStore.register(payload);
    router.push("/Otp");
  } catch (error) {
      phoneError.value = error.message?.replace(`/^Error:\s*/`, '')
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
</style>
