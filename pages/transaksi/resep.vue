<template>
  <div>
    <div class="title"><NuxtLink to="/transaksi">Transaksi</NuxtLink> > Resep</div>
    <div class="input">
      <select v-model="resep" :class="{ selected: resep }" @change="execute">
        <option disabled value="">No Resep</option>
        <option v-for="resep in reseps" :value="resep.id">{{ resep.no_resep }}</option>
      </select>
    </div>
    <div class="container">
      <Loader v-if="fetchStatus == 'pending'" />
      <div v-if="fetchStatus == 'error'">{{ fetchError.message }}</div>
    </div>
    <div v-if="selectedResep">
      <div class="container">
        <div class="detail">
          <div>No Resep: {{ selectedResep.no_resep }}</div>
          <div>Tanggal Resep: {{ selectedResep.tgl_resep }}</div>
          <hr>
          <div>Nama Dokter: {{ selectedResep.nama_dokter }}</div>
          <div>Nama Pasien: {{ selectedResep.nama_pasien }}</div>
          <hr>
          <div v-for="(obat, index) in selectedResep.obat" :key="obat.id">
            <div>{{ index + 1 }}. {{ obat.nama_obat }} - Jumlah: {{ selectedResep.resep_obat[index].jumlah_obat }}</div>
            <div>Harga: Rp. {{ obat.harga }} / satuan</div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="total">Total: Rp. {{ totalBayar }}</div>
      </div>
      <div class="container" v-if="insertStatus == 'error'">{{ insertError.message }}</div>
      <div class="container">
        <Loader v-if="insertStatus == 'pending'" />
        <button v-else class="submit" @click="bayar">Bayar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'main',
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const resep = ref('')
const totalBayar = computed(() => {
  return selectedResep.value.obat.reduce((total, { harga, jumlah_obat }) => {
    return total + (harga * jumlah_obat)
  }, 0)
})

const { data: reseps } = useAsyncData('resep', async () => {
  const { data, error } = await supabase.from('resep').select()
  if (error) throw error
  return data
})

const { data: selectedResep, status: fetchStatus, error: fetchError, execute } = useAsyncData('selectResep', async() => {
  const { data, error } = await supabase.from('resep').select(`
    *,
    obat ( id, nama_obat, jumlah, harga ),
    resep_obat ( jumlah_obat )
  `).eq('id', resep.value).maybeSingle()
  if (error) throw error
  data.obat = data.obat.map((obat, index) => ({
    ...obat,
    ...data.resep_obat[index]
  }))
  return data
}, { immediate: false })

const { execute: bayar, status: insertStatus, error: insertError } = useAsyncData('transaksi', async () => {
  const { error } = await supabase.from('transaksi').insert({
    total_bayar: totalBayar.value,
    id_user: user.value.id,
    id_resep: selectedResep.value.id
  })
  if (error) throw error
  else {
    try {
      selectedResep.value.obat.forEach(async (obat) => {
        const newJumlah = obat.jumlah - obat.jumlah_obat
        const { error } = await supabase.from('obat').update({ jumlah: newJumlah }).eq('id', obat.id)
        if (error) throw error
      })
      alert('Berhasil melakukan transaksi')
      navigateTo('/transaksi')
    } catch (error) {
      alert('Jumlah obat tidak bisa dikurangi')
      console.error(error.message)
    }
  }
}, { immediate: false })
</script>

<style scoped>
@import url('~/assets/css/main.css');
</style>