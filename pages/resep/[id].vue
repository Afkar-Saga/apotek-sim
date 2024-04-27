<template>
  <div>
    <div class="title"><NuxtLink to="/resep">Resep</NuxtLink> > Edit/Delete</div>
    <div class="container">
      <Loader v-if="loadData" />
      <div class="detail">
        <div>No Resep: {{ form.no_resep }}</div>
        <div>Tanggal Resep: {{ form.tgl_resep }}</div>
        <div>Nama Dokter: {{ form.nama_dokter }}</div>
        <div>Nama Pasien: {{ form.nama_pasien }}</div>
        <div v-for="(obat, index) in formObat" :key="obat.id_obat">
          <div>{{ index + 1 }}. {{ obat.nama_obat }}: {{ obat.jumlah_obat }}</div>
        </div>
      </div>
    </div>
    <form @submit.prevent="updateResep">
      <div class="input-group">
        <div class="input">
          <input type="text" v-model="form.no_resep" placeholder=" " required>
          <label>No Resep</label>
        </div>
        <div class="input">
          <input type="date" v-model="form.tgl_resep" placeholder=" " required>
          <label>Tanggal Resep</label>
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
          <select v-model="form.id_obat" :class="{ selected: form.id_obat }" @change="updateNamaObat(form.id_obat, index)" required>
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
      <div class="container" v-if="updating == 'error'">{{ updateError.message }}</div>
      <div class="container" v-if="deleting == 'error'">{{ deleteError.message }}</div>
      <div class="container">
        <Loader v-if="updating == 'pending' || deleting == 'pending'" />
        <div v-else class="input-group">
          <input type="submit" value="Edit" class="submit edit">
          <button type="button" class="submit delete" @click="showDeleteConfirmation = true">Delete</button>
          <DeleteConfirmation v-if="showDeleteConfirmation" @cancel="showDeleteConfirmation = false" @delete="deleteResep" />
        </div>
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
  no_resep: '',
  tgl_resep: '',
  nama_dokter: '',
  nama_pasien: ''
})
const formObat = ref([{
  id_obat: 0,
  nama_obat: '',
  jumlah_obat: 0
}])
const showDeleteConfirmation = ref(false)

const tambahObat = () => {
  formObat.value.push({
    id_obat: 0,
    jumlah_obat: 0
  })
}

async function updateNamaObat(obatId, i) {
  const { data, error } = await supabase.from('obat').select('nama_obat').eq('id', obatId).maybeSingle()
  if (error) throw error
  if (data) formObat.value[i].nama_obat = data.nama_obat
}

const { data: resep, pending: loadData } = useAsyncData('resep', async () => {
  const { data, error } = await supabase.from('resep').select(`
    *,
    obat ( id, nama_obat ),
    resep_obat ( jumlah_obat )
  `).eq('id', id).maybeSingle()
  if (error) throw error
  form.value.no_resep = data.no_resep
  form.value.tgl_resep = data.tgl_resep
  form.value.nama_dokter = data.nama_dokter
  form.value.nama_pasien = data.nama_pasien
  formObat.value = data.obat.map((obat, index) => ({
    id_obat: obat.id,
    nama_obat: obat.nama_obat,
    ...data.resep_obat[index]
  }))
  return data
})

const { execute: updateResep, error: updateError, status: updating } = useAsyncData('editResep', async () => {
  const { data, error } = await supabase.from('resep').update(form.value).eq('id', id).select().maybeSingle()
  if (error) throw error
  if (data) {
    const resep = []
    formObat.value.forEach(obat => {
      resep.push({
        id_resep: data.id,
        id_obat: obat.id_obat,
        jumlah_obat: obat.jumlah_obat
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

const { execute: deleteResep, error: deleteError, status: deleting } = useAsyncData('deleteResep', async () => {
  const { error } = await supabase.from('resep').delete().eq('id', id)
  if (error) throw error
  else navigateTo('/resep')
}, { immediate: false })

</script>

<style scoped>
@import url('~/assets/css/main.css');
</style>