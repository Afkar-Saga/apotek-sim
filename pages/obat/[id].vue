<template>
  <div>
    <div class="title"><NuxtLink to="/obat">Obat</NuxtLink> > Tambah</div>
    <div class="container">
      <Loader v-if="loadData" />
      <div v-else class="detail">
        <div>Kode Obat: {{ form.kode_obat }}</div>
        <div>Nama Obat: {{ form.nama_obat }}</div>
        <div>Expired Date: {{ form.expired_date }}</div>
        <div>Jumlah: {{ form.jumlah }}</div>
        <div>Harga: {{ form.harga }}</div>
      </div>
    </div>
    <form @submit.prevent="updateObat">
      <div class="input-group">
        <div class="input">
          <input type="text" v-model="form.kode_obat" placeholder=" " required>
          <label>Kode Obat</label>
        </div>
        <div class="input">
          <input type="text" v-model="form.nama_obat" placeholder=" " required>
          <label>Nama Obat</label>
        </div>
        <div class="input">
          <input type="date" v-model="form.expired_date" placeholder=" " required>
          <label>Expired Date</label>
        </div>
        <div class="input">
          <input type="number" v-model="form.jumlah" placeholder=" " required>
          <label>Jumlah</label>
        </div>
        <div class="input">
          <input type="number" v-model="form.harga" placeholder=" " required>
          <label>Harga</label>
        </div>
      </div>
      <div class="container" v-if="status == 'error'">{{ error.statusMessage }}</div>
      <div class="container">
        <Loader v-if="status == 'pending'" />
        <input v-else type="submit" value="Edit" class="submit edit">
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'main',
  middleware: 'auth'
})

const { id } = useRoute().params
const supabase = useSupabaseClient()

const form = ref({
  kode_obat: '',
  nama_obat: '',
  expired_date: '',
  jumlah: 0,
  harga: 0,
})

const { pending: loadData } = useAsyncData('obats', async () => {
  const { data, error } = await supabase.from('obat').select().eq('id', id).maybeSingle()
  if (error) throw error
  form.value = data
  return data
})

const { execute: updateObat, error, status } = useAsyncData('obat', async () => {
  const { error } = await supabase.from('obat').update(form.value).eq('id', id)
  if (error) throw error
  else {
    navigateTo('/obat')
  }
}, { immediate: false })
</script>

<style scoped>
@import url('~/assets/css/main.css');
</style>