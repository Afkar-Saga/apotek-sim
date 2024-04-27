<template>
  <div>
    <div class="title">Resep</div>
    <div class="container">
      <Loader v-if="loadData" />
      <div class="detail" v-for="resep in reseps" :key="resep.id" @click="navigateTo(`resep/${resep.id}`)">
        <div>No Resep: {{ resep.no_resep }}</div>
        <div>Tanggal Resep: {{ resep.tgl_resep }}</div>
        <hr>
        <div>Nama Dokter: {{ resep.nama_dokter }}</div>
        <div>Nama Pasien: {{ resep.nama_pasien }}</div>
        <hr>
        <div v-for="(obat, index) in resep.obat" :key="obat.id">
          <div>{{ index + 1 }}. {{ obat.nama_obat }}: {{ resep.resep_obat[index].jumlah_obat }}</div>
        </div>
      </div>
    </div>
    <div class="container">
      <NuxtLink to="/resep/tambah"><button class="submit">Tambah Resep</button></NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'main',
  middleware: 'auth'
})

const supabase = useSupabaseClient()

const { data: reseps, pending: loadData, refresh } = useAsyncData('reseps', async () => {
  const { data, error } = await supabase.from('resep').select(`
    *,
    obat ( id, nama_obat ),
    resep_obat ( jumlah_obat )
  `).order('no_resep')
  if (error) throw error
  return data
})
</script>

<style scoped>
@import url('~/assets/css/main.css');
.container:has(.detail) {
  justify-content: start;
  flex-wrap: wrap;
  gap: 20px;
}
.detail {
  cursor: pointer;
  transition: .5s;

  &:hover {
    background-color: #cfc;
  }
}
</style>