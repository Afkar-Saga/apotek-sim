<template>
  <div>
    <div class="title"><NuxtLink to="/transaksi">Transaksi</NuxtLink> > Non Resep</div>
    <form @submit.prevent="bayar">
      <div class="input-group" v-for="(form, index) in formObat" :key="index">
        <div class="input">
          <select v-model="form.id" :class="{ selected: form.id }" @change="getHarga(form.id, index)" required>
            <option disabled value="0">Pilih Obat</option>
            <option v-for="(obat, index) in obats" :key="obat.id" :value="obat.id">{{ obat.nama_obat }}</option>
          </select>
        </div>
        <div class="input">
          <input type="number" v-model="form.jumlah_obat" placeholder=" " required>
          <label>Jumlah</label>
        </div>
      </div>
      <button type="button" class="submit add" @click="tambahObat">+ Tambah Obat</button>
      <div class="container">
        <div class="total" v-if="totalBayar">Total: Rp. {{ totalBayar }}</div>
      </div>
      <div class="container" v-if="status == 'error'">{{ error.message }}</div>
      <div class="container">
        <Loader v-if="status == 'pending'" />
        <input v-else type="submit" value="Bayar" class="submit">
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
const user = useSupabaseUser()

const formObat = ref([{
  id: 0,
  harga: 0,
  jumlah_obat: 0
}])
const totalBayar = computed(() => {
  return formObat.value.reduce((total, current) => {
    return total + (current.harga * current.jumlah_obat)
  }, 0)
})

const tambahObat = () => {
  formObat.value.push({
    id: 0,
    harga: 0,
    jumlah_obat: 0
  })
}

const { data: obats } = useAsyncData('obat', async () => {
  const { data, error } = await supabase.from('obat').select()
  if (error) throw error
  return data
})

async function getHarga(obatId, i) {
  const { data, error } = await supabase.from('obat').select('harga').eq('id', obatId).maybeSingle()
  if (error) throw error
  if (data) formObat.value[i].harga = data.harga
}

const { execute: bayar, error, status } = useAsyncData('transaksi', async () => {
  const { data, error } = await supabase.from('transaksi').insert({
    total_bayar: totalBayar.value,
    id_user: user.value.id
  }).select().maybeSingle()
  if (error) throw error
  if (data) {
    const transaksi = []
    formObat.value.forEach(obat => {
      transaksi.push({
        id_transaksi: data.id,
        id_obat: obat.id,
        jumlah_obat: obat.jumlah_obat
      })
    })
    const { error } = await supabase.from('transaksi_obat').upsert(transaksi, { onConflict: 'id_transaksi, id_obat' })
    if (error) throw error
    else {
      alert('Transaksi berhasil')
      navigateTo('/transaksi')
    }
  }
}, { immediate: false })

</script>

<style scoped>
@import url('~/assets/css/main.css');
.total {
  color: #090;
  font-size: 2.5em;
  font-weight: bold;
}
</style>