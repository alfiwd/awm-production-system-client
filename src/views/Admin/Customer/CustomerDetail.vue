<template>
  <div class="container">
    <CustomerForm />
  </div>
</template>

<script>
import CustomerForm from '../../../components/organisms/Form/CustomerForm.vue'

export default {
  components: {
    CustomerForm
  }
}
</script>
<style>
.container {
  padding: 16px;
}
</style>
