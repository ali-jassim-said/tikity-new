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
          <div class="text">مرحبا بعودتك !</div>
          <p>قم بتسجيل الدخول عن طريق البريد الالكتروني وكلمة المرور</p>
          <form @submit.prevent="handleLogin">
            <div class="data">
              <label>البريد الالكتروني او رقم الهاتف</label>
              <input v-model="emailOrPhone" type="text" required />
            </div>
            <div class="data">
              <label>كلمة المرور</label>
              <input v-model="password" type="password" required />
            </div>
            <div class="forgot-pass">
              <a href="#">نسيت كلمة المرور؟</a>
              <div class="check-box">
                <label for="checkbox">تذكرني</label>
                <label class="switch">
                  <input type="checkbox" v-model="rememberMe" />
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
            <div class="btn">
              <div class="inner"></div>
              <button class="log" type="submit">تسجيل الدخول</button>
              <button class="register">
                ليس لديك حساب؟<nuxt-link to="/Register">قم بإنشاء حساب جديد</nuxt-link>
              </button>
            </div>
          </form>
        </div>
        <div class="more">
          <p>تعرف المزيد عنا من خلال</p>
          <div class="icons">
            <i class="ri-facebook-fill"></i>
            <i class="ri-instagram-line"></i>
            <i class="ri-twitter-fill"></i>
            <i class="ri-youtube-fill"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore'; // Import your Pinia auth store

// State for the carousel
const colors = ref([
  'indigo',
  'warning',
  'pink darken-2',
  'red lighten-1',
  'deep-purple accent-4',
]);

const slides = ref([
  'هو ببساطة نص شكلي (بمعنى أنه ليس بالضرورة نصًا) يُستخدم في صناعة الطباعة والتنضيد.',
  'هو ببساطة نص شكلي (بمعنى أنه ليس بالضرورة نصًا) يُستخدم في صناعة الطباعة والتنضيد.',
  'هو ببساطة نص شكلي (بمعنى أنه ليس بالضرورة نصًا) يُستخدم في صناعة الطباعة والتنضيد.',
  'هو ببساطة نص شكلي (بمعنى أنه ليس بالضرورة نصًا) يُستخدم في صناعة الطباعة والتنضيد.',
  'هو ببساطة نص شكلي (بمعنى أنه ليس بالضرورة نصًا) يُستخدم في صناعة الطباعة والتنضيد.',
]);

// Auth-related state
const emailOrPhone = ref('');
const password = ref('');
const rememberMe = ref(false);

// Use Pinia store
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    const payload = {
      emailOrPhone: emailOrPhone.value,
      password: password.value,
    };

    // Call login action from the store
    await authStore.login(payload);

    // Redirect to another page or show success message after login
    console.log('Login successful');
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
</script>


<style scoped>
@import "../public/css/login.css";
</style>
