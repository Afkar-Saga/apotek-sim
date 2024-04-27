<template>
  <div>
    <div class="title">Obat</div>
    <div class="table">
      <table>
        <caption>Obat</caption>
        <thead>
          <tr>
            <th>#</th>
            <th>Kode Obat</th>
            <th>Nama Obat</th>
            <th>Expired Date</th>
            <th>Jumlah</th>
            <th>Harga</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td colspan="7"><Loader class="loader" /></td>
          </tr>
          <tr v-else v-for="(obat, index) in obats" :key="obat.id">
            <th>{{ index + 1 }}</th>
            <td>{{ obat.kode_obat }}</td>
            <td>{{ obat.nama_obat }}</td>
            <td>{{ obat.expired_date }}</td>
            <td>{{ obat.jumlah }}</td>
            <td>{{ obat.harga }}</td>
            <td>
              <div class="btn-icon" @click="navigateTo(`/obat/${obat.id}`)">
                <img src="~/assets/img/edit.png" alt="Edit">
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="container">
      <NuxtLink to="/obat/tambah"><button class="submit">Tambah Obat</button></NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'main',
  middleware: 'auth'
})

const supabase = useSupabaseClient()

const { data: obats, pending } = useAsyncData('obat', async () => {
  const { data, error } = await supabase.from('obat').select()
  if (error) throw error
  return data
})
</script>

<style scoped>
@import url('~/assets/css/main.css');
</style>