<template>
  <v-dialog class="poopup" v-model="isOpen">
    <div class="container-pop">
      <div class="pay-pop">
        <div class="head-two">
          <div class="head">
            <h2>{{ event.event.organizer.name }}</h2>
          </div>
          <div class="address">
            <img class="icon" src="../public/icons/Vector.svg" alt="" />
            <div class="address-flex">
              <div class="name-address">
                <h3>
                  {{ locations?.data[0].governorate.name }} _
                  {{ locations?.data[0]?.city || "City Not Available" }}
                </h3>
                <p>{{ locations?.data[0].street }}</p>
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
                <label class="form-check-label" for="inlineRadio1s">
                  الدفع عند الاستلام
                </label>
                <img src="../public/icons/fast-delivery 1.svg" alt="" />
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
              <p>{{ event.event.organizer.description }}</p>
              <div class="date">
                <p>{{ new Date(event.event.startDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
                <img src="../public/icons/Group 2.svg" alt="" />
              </div>
              <div class="price">
                <p>90,000 - 40,000 د.ع</p>
                <img src="../public/icons/Ticket.svg" alt="" />
              </div>
            </div>
            <img
              :src="`https:${event.event.organizer.imageUrl}`"
              alt=""
              class="img"
            />
          </div>
          <div class="detaile-card">
            <div v-for="ticketType in event.event.ticketTypes" :key="ticketType.id" class="one">
              <div class="detaile">
                <div class="number">
                  <p>بطاقة</p>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    :max="ticketType.ticketsCount"
                    v-model.number="ticketType.selectedQuantity"
                    @input="validateQuantity(ticketType)"
                  />
                </div>
                <div class="more-detaile">
                  <img src="../public/icons/Red.svg" alt="" />
                  <div class="more">
                    <p>{{ ticketType.title }}</p>
                    <div class="prices">
                      <div>{{ ticketType.price }} د.ع</div>
                      /
                      <span>{{ ticketType.ticketsCount }} مقعد متوفر</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="two">
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
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  modelValue: Boolean,
  event: Object,
  locations: Array,
  ticketQuantities: Number,
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

function validateQuantity(ticketType) {
  if (ticketType.selectedQuantity > ticketType.ticketsCount) {
    ticketType.selectedQuantity = ticketType.ticketsCount; // Correct to max value
  }
}
</script>

<style>
@import "../public/css/poopUp.css";
</style>
