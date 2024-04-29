<template>
  <div>
    <div class="title"><NuxtLink to="/resep">Resep</NuxtLink> > Tambah</div>
    <form @submit.prevent="tambahResep">
      <div class="input-group">
        <div class="input">
          <input type="text" v-model="form.no_resep" placeholder=" " required>
          <label>No Resep</label>
        </div>
        <div class="input">
          <input type="text" v-model="form.nama_dokter" placeholder=" " required>
          <label>Nama Dokter</label>
        </div>
        <div class="input">
          <input type="text" v-model="form.nama_pasien" placeholder=" " required>
          <label>Nama Pasien</label>
        </div>
      </div>
      <div class="input-group" v-for="(form, index) in formObat" :key="index">
        <div class="input">
          <select v-model="form.id_obat" :class="{ selected: form.id_obat }" required>
            <option disabled value="0">Pilih Obat</option>
            <option v-for="obat in obats" :key="obat.id" :value="obat.id">{{ obat.nama_obat }}</option>
          </select>
        </div>
        <div class="input">
          <input type="number" v-model="form.jumlah_obat" placeholder=" " required>
          <label>Jumlah</label>
        </div>
      </div>
      <button type="button" class="submit add" @click="tambahObat">+ Tambah Obat</button>
      <div class="container" v-if="status == 'error'">{{ error.message }}</div>
      <div class="container">
        <Loader v-if="status == 'pending'" />
        <input v-else type="submit" value="Tambah" class="submit">
      </div>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'main',
  middleware: 'auth'
})

const supabase = useSupabaseClient()

const form = ref({
  no_resep: '',
  nama_dokter: '',
  nama_pasien: ''
})
const formObat = ref([{
  id_obat: 0,
  jumlah_obat: 0
}])

const tambahObat = () => {
  formObat.value.push({
    id_obat: 0,
    jumlah_obat: 0
  })
}

const { execute: tambahResep, error, status } = useAsyncData('resep', async () => {
  const { data, error } = await supabase.from('resep').insert(form.value).select().maybeSingle()
  if (error) throw error
  if (data) {
    const resep = []
    formObat.value.forEach(obat => {
      resep.push({
        id_resep: data.id,
        ...obat
      })
    })
    const { error } = await supabase.from('resep_obat').upsert(resep, { onConflict: 'id_resep, id_obat' })
    if (error) throw error
    else navigateTo('/resep')
  }
}, { immediate: false })

const { data: obats } = useAsyncData('obat', async () => {
  const { data, error } = await supabase.from('obat').select()
  if (error) throw error
  return data
})

</script>

<style scoped>
@import url('~/assets/css/main.css');
</style>