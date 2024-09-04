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
      <div class="container-center otp">
        <div class="logo otp">
          <div class="reg-otp">
            <i class="ri-arrow-right-s-line"></i>
            <span>تسجيل الحساب </span>
          </div>
          <img src="../public/svg/Subtract.svg" alt="" />
        </div>
        <div class="div-otp">
          <div class="text-otp">
            <div class="text">ادخل رمز التأكيد</div>
            <p>
              قمنا بارسال رمز التأكيد برسالة نصية الى رقم الهاتف +964 780 1234
              567 يمكنك طلب اعادة ارسال الرسالة النصية بعد 00:20 دقيقة
            </p>
          </div>
          <form action="#">
            <v-otp-input :length="5"></v-otp-input>
          </form>
        </div>
        <div class="btns">
          <div class="btn">
            <button class="log" type="submit">التأكيد والمواصلة</button>
          </div>
          <div class="more otp">
            <p>طلب اعادة ارسال رمز التأكيد</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

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
  "هو ببساطة نص شكلي (بمعنى أنه ليس بالضرورة نصًا) يُستخدم في صناعة الطباعة والتنضيد.",
  "هو ببساطة نص شكلي (بمعنى أنه ليس بالضرورة نصًا) يُستخدم في صناعة الطباعة والتنضيد.",
  "هو ببساطة نص شكلي (بمعنى أنه ليس بالضرورة نصًا) يُستخدم في صناعة الطباعة والتنضيد.",
]);
</script>

<style scoped>
@import "../public/css/login.css";
</style>
