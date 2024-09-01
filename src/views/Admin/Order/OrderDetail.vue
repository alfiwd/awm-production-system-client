<template>
  <div class="container">
    <OrderForm />
  </div>
</template>

<script>
import OrderForm from '../../../components/organisms/Form/OrderForm.vue'

export default {
  components: { OrderForm }
}
</script>

<style>
.container {
  padding: 16px;
}
.editableActionWrapper {
  display: flex;
  gap: 10px;
}
</style>
