<template>
  <div class="category-picture">
    <img class="pic2" src="../public/img/text1.png" alt="" />
    <div class="middle">
      <div class="icons-category">
        <i class="ri-arrow-right-s-line" @click="nextSlide"></i>
        <i class="ri-arrow-left-s-line" @click="prevSlide"></i>
      </div>
      <v-sheet
        style="background-color: transparent; direction: rtl"
        width="100%"
        class="slide-middle"
      >
        <v-slide-group  next-icon="mdi-plus"
        prev-icon="mdi-minus" v-model="activeIndex" class="pa-2" style="width: 100%">
          <v-slide-group-item
         
            v-for="(item, index) in categories"
            :key="index"
            :class="{ 'active-slide': index === activeIndex }"
          >
            <v-card class="card-middle ma-4">
              <i>{{ item.order }}</i>
              <p>{{ item.name }}</p>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>
    <img src="../public/img/text2.png" alt="" />
  </div>
</template>

<script setup>
import { useCategoriesStore } from "@/stores/categories";
import { onMounted, ref } from "vue";

const categoriesStore = useCategoriesStore();
const categories = ref([]);
const error = ref(null);
const activeIndex = ref(0);

const fetchCategories = async () => {
  await categoriesStore.fetchCategories();
  categories.value = categoriesStore.categories;
  error.value = categoriesStore.error;
};

const nextSlide = () => {
  if (activeIndex.value < categories.value.length - 1) {
    activeIndex.value++;
  }
};

const prevSlide = () => {
  if (activeIndex.value > 0) {
    activeIndex.value -= 1;
  }
  console.log(activeIndex.value);
};

onMounted(async () => {
  await fetchCategories();
});
</script>

<style scoped>
.category-picture {
  direction: rtl;
  background-image: url("../public/img/categoryPic.png");
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 302px;
  margin: 100px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-picture img:nth-child(1) {
  width: 231px;
  height: 130px;
}

.category-picture .pic2 {
  width: 137px !important;
  height: 98px !important;
}

.icons-category {
  position: absolute;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icons-category i {
  width: 32px;
  height: 32px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 100px;
  border: 1px;
  background: rgba(34, 129, 217, 0.5);
  color: #fff;
  cursor: pointer;
  z-index: 100;
}

.card-middle {
  width: 177px;
  height: 216px;
  border-radius: 24px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  position: relative;
  cursor: pointer;
  user-select: none;
}

.card-middle i {
  font-size: 50px;
  color: #fff;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.card-middle p {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: 700;
  line-height: 19.5px;
  color: #fff;
}

.active-slide {
  background: rgba(255, 255, 255, 1);
}

.middle {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
}

.slide-middle {
  overflow: hidden;
}
</style>
