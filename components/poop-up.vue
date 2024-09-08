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
                value="1"
                v-model="selectedPaymentType"
              />
            </div>
          </div>
        </div>

        <div class="content-send">
          <h4>الملاحظات</h4>
          <textarea v-model="note"></textarea>
        </div>
      </div>
      
      <!-- Ticket Details Section -->
      <div class="detaile-pop">
        <div class="detailes">
          <div class="one">
            <div class="text">
              <p>{{ event.event.organizer.description }}</p>
              <div class="date">
                <p>{{ formattedStartDate }}</p>
                <img src="../public/icons/Group 2.svg" alt="" />
              </div>
              <div class="price">
                <p>90,000 - 40,000 د.ع</p>
                <img src="../public/icons/Ticket.svg" alt="" />
              </div>
            </div>
            <img :src="`https:${event.event.organizer.imageUrl}`" alt="" class="img" />
          </div>
          <div class="detaile-card">
            <div v-for="ticketType in validTicketTypes" :key="ticketType.id" class="one">
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

          <div class="send">
            <div class="text">
              <div>المجموع الكلي</div>
              <p>{{ totalPrice }} د.ع</p>
            </div>
            <button @click="confirmBooking"><span>اكمال الطلب</span></button>
          </div>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useOrdersStore } from '../stores/ordersStore'; // Adjust path as necessary

// Define props and emits
const props = defineProps({
  modelValue: Boolean,
  event: Object,
  locations: Array,
});

const emit = defineEmits(['update:modelValue']);

// Initialize Pinia store
const ordersStore = useOrdersStore();

// Dialog open/close state
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// State variables
const note = ref('');
const selectedPaymentType = ref(1); // Payment type, assuming "1" is "Cash on delivery"

// Format the event's start date
const formattedStartDate = computed(() =>
  new Date(props.event.event.startDate).toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
);

// Filter ticket types to include only those with non-zero quantities
const validTicketTypes = computed(() =>
  props.event.event.ticketTypes.filter(ticketType => (ticketType.selectedQuantity || 0) > 0)
);

// Calculate the total price for all selected ticket types
const totalPrice = computed(() =>
  validTicketTypes.value.reduce((total, ticketType) => 
    total + (ticketType.selectedQuantity || 0) * ticketType.price, 0
  )
);

// Validate ticket quantity and ensure it doesn't exceed available tickets
function validateQuantity(ticketType) {
  if (ticketType.selectedQuantity > ticketType.ticketsCount) {
    ticketType.selectedQuantity = ticketType.ticketsCount; // Correct to max value
  }
}

// Confirm the booking and post the order
async function confirmBooking() {
  const tickets = props.event.event.ticketTypes
    .filter(ticketType => ticketType.selectedQuantity > 0)
    .map(ticketType => ({
      ticketTypeId: ticketType.id,
      count: ticketType.selectedQuantity,
    }));

  const locationId = props.locations?.data[0]?.id || null; // Access the ID of the first location or null

  const orderPayload = {
    note: note.value,
    tickets: tickets,
    paymentType: selectedPaymentType.value,
    eventId: props.event.event.id,
    locationId: locationId,
  };

  try {
    await ordersStore.createOrder(orderPayload);
    console.log('Order created successfully');

    // Close the dialog after confirming
    emit('update:modelValue', false); 
  } catch (error) {
    console.error('Error submitting order:', error);
  }
}
</script>

<style>
@import '../public/css/poopUp.css';
</style>
