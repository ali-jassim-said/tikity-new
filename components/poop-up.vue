<template>
  <v-dialog class="poopup" v-model="isOpen">
    <div class="container-pop">
      <div class="pay-pop">
        <div class="head-two">
          <div class="head">
            <h2>عنوان الطلب</h2>
          </div>
          <div class="address">
            <img class="icon" src="../public/icons/Vector.svg" alt="" />
            <div class="address-flex">
                <div class="name-address">
              <h3>بغداد _ المنصور</h3>
              <p>885W+MWC, شارع, بغداد</p>
            </div>
            <img src="../public/svg/logo-card.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="head-one">
          <h2>طريقة الدفع</h2>
          <div class="radio-input">
            <div class="form-check">
              <div class="label-check">
                <label class="form-check-label" for="inlineRadio1s"
                  >ماستر كارد</label
                >
                <img src="../public/icons/fast-delivery 1.svg" alt="">
              </div>

              <input
                class="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio1s"
                value="option1"
              />
            </div>
          </div>
        </div>

        <div class="content-send">
          <h4>الملاحظات</h4>
          <textarea name=""></textarea>
        </div>
      </div>
      <div class="detaile-pop">
        <div class="detailes">
          <div class="one">
            <div class="text">
              <p>
                Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit
                amet consectetur
              </p>
              <div class="date">
                <p>الاحد , 27 اغسطس 2023</p>
                <img src="../public/icons/Group 2.svg" alt="">
              </div>
              <div class="price">
                <p>90,000 - 40,000 د.ع</p>
                <img src="../public/icons/Ticket.svg" alt="">
              </div>
            </div>
            <div class="img"></div>
          </div>
          <div class="detaile-card">
            <div class="one">
              <div class="detaile">
                <div class="number">
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max="5"
                  />
                </div>
              </div>
              <div class="more-detaile">
                <img src="../public/icons/Red.svg" alt="">
                <div class="more">
                  <p>قسم B , صف 1</p>
                  <div class="prices">
                    <div>90,000 د.ع</div>
                    /
                    <span>6 مقعد متوفر</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="one">
              <div class="detaile">
                <div class="number">
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max="5"
                  />
                </div>
              </div>
              <div class="more-detaile">
                <img src="../public/icons/blue.svg" alt="">
                <div class="more">
                  <p>قسم B , صف 1</p>
                  <div class="prices">
                    <div>90,000 د.ع</div>
                    /
                    <span>6 مقعد متوفر</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="two">
            <div class="normal">
              <div class="many">
                <p>عادية</p>
                <p>x 2</p>
              </div>
              <p>60,000 د.ع</p>
            </div>
            <div class="normal">
              <div class="many">
                <p>vip</p>
                <p>x 3</p>
              </div>
              <p>60,000 د.ع</p>
            </div>
          </div>

          <div class="send">
            <div class="text">
              <div>المجموع الكلي</div>
              <p>40,000 د.ع</p>
            </div>
            <button><span>اكمال الطلب</span></button>
          </div>
        </div>
      </div>
    </div>
  </v-dialog>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function closeDialog() {
  isOpen.value = false;
}

function confirmBooking() {
  emit("update:modelValue", false); // Close the dialog after confirming
}
</script>

<style>
@import '../public/css/poopUp.css';
</style>
