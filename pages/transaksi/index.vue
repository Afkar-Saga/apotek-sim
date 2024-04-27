<template>
  <div>
    <div class="title">Transaksi</div>
    <div class="container">
      <NuxtLink to="/transaksi/resep" class="card-link resep">Resep</NuxtLink>
      <NuxtLink to="/transaksi/nonresep" class="card-link non">Non Resep</NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'main',
  middleware: 'auth'
})
</script>

<style scoped>
@import url('~/assets/css/main.css');
.card-link {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 1.5em;
  font-weight: bold;
  width: 480px;
  height: 120px;
  margin: 30px;
  background: linear-gradient(to right bottom, #fff, #fafafa);
  color: black;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(37, 41, 34, 0.5);
  cursor: pointer;
  transition: .5s;

  &:hover {
    scale: 1.1;
  }
}
</style>