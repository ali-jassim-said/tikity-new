<template>
 <home1 v-show="!isMobile" />
 <home-mopile v-show="isMobile" />
 <slide-category v-show="!isMobile"/>
 <slide-category-mopile v-show="isMobile"/>
 <collection1/>
 <category1/>
 <footer-up/>
</template>

<script setup>

import { ref, onMounted } from "vue";

const isMobile = ref(false);

const handleResize = () => {
  if (typeof window !== "undefined") {
    isMobile.value = window.innerWidth <= 400;
  }
};

onMounted(() => {
  handleResize(); // Set initial value
  window.addEventListener('resize', handleResize);
});

</script>

<style>





</style>
