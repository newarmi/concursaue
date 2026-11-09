<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import AddCouponForm from '@/components/AddCouponForm.vue';
</script>

<template>
  <AppLayout title="Заявка на вступление">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">Заявка на вступление</h2>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
          <AddCouponForm />
        </div>
      </div>
    </div>
  </AppLayout>
</template>
