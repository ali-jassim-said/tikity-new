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
              <input type="text" placeholder="مثلا : احمد محمد حسن" required v-model="fullName" />
            </div>
             <div class="data">
              <label>المنطقه</label>
              <input type="text" placeholder="area" required v-model="area" />
            </div>
             <div class="data">
              <label>pic</label>
              <input type="text" placeholder="pic" required v-model="imageUrl" />
            </div>
            <div class="data">
              <label>البريد الالكتروني</label>
              <input type="email" placeholder="email@test.com" required v-model="email" />
            </div>
             <div class="data">
              <label>الرمز</label>
              <input type="text" placeholder="password" required v-model="password" />
            </div>
            <label>رقم الهاتف</label>
            <div class="select-box">
              <div class="selected-option">
                <div>
                  <span class="iconify" data-icon="flag:gb-4x3"></span>
                  <strong>+44</strong>
                </div>
                <input type="tel" name="tel" placeholder="Phone Number" v-model="phone" />
              </div>
              <div class="options">
                <input
                  type="text"
                  class="search-box"
                  placeholder="Search Country Name"
                />
                <ol></ol>
              </div>
            </div>
            <input type="number" placeholder="Country Name" v-model="countryName" />
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
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

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

const authStore = useAuthStore();
const router = useRouter();

const fullName = ref('');
const email = ref('');
const phone = ref('');
const countryName = ref(Number);
const password = ref('');
const imageUrl = ref('');
const area = ref('');

onMounted(() => {
  initializeCountrySelector();
});

const initializeCountrySelector = () => {
  const countries = [
    { name: 'Aland Islands', code: 'ri-twitter-fill', phone: 358 },
    { name: 'Albania', code: 'ri-twitter-fill', phone: 355 },
    { name: 'Bahrain', code: 'ri-twitter-fill', phone: 973 },
  ];

  const selectBox = document.querySelector('.options');
  const searchBox = document.querySelector('.search-box');
  const inputBox = document.querySelector('input[type="tel"]');
  const selectedOption = document.querySelector('.selected-option div');
  let options = null;

  for (let country of countries) {
    const option = `
      <li class="option">
          <div>
              <i class=${country.code}></i>
              <span class="country-name">${country.name}</span>
          </div>
          <strong>+${country.phone}</strong>
      </li> `;

    selectBox.querySelector('ol').insertAdjacentHTML('beforeend', option);
    options = document.querySelectorAll('.option');
  }

  const selectOption = (event) => {
    const target = event.currentTarget;
    const icon = target.querySelector('i').cloneNode(true);
    const phoneCode = target.querySelector('strong').cloneNode(true);

    selectedOption.innerHTML = '';
    selectedOption.append(icon, phoneCode);

    inputBox.value = phoneCode.innerText;

    selectBox.classList.remove('active');
    selectedOption.classList.remove('active');

    searchBox.value = '';
    selectBox.querySelectorAll('.hide').forEach((el) => el.classList.remove('hide'));
  };

  const searchCountry = () => {
    let searchQuery = searchBox.value.toLowerCase();
    for (let option of options) {
      let isMatched = option.querySelector('.country-name').innerText.toLowerCase().includes(searchQuery);
      option.classList.toggle('hide', !isMatched);
    }
  };

  selectedOption.addEventListener('click', () => {
    selectBox.classList.toggle('active');
    selectedOption.classList.toggle('active');
  });

  options.forEach((option) => option.addEventListener('click', selectOption));
  searchBox.addEventListener('input', searchCountry);
};

const handleRegister = async () => {
  try {
    const payload = {
      name: fullName.value,
      phone: phone.value,
      email: email.value,
      password: password.value,
      governorateId: countryName.value,
      area: area.value,
      imageUrl: imageUrl.value,
    };
    await authStore.register(payload);
    router.push('/'); // Redirect to the appropriate page
  } catch (error) {
    alert('Registration failed. Please try again.');
  }
};

</script>

<style scoped>
@import '../public/css/register.css';

/*
{
  "imageUrl": "",
  "name": "string",
  "phone": "+9647728608890",
  "email": "emil@test.com",
  "password": "123@Qwe8989",
  "governorateId": 1,
  "area": ""
}

*/
</style>
