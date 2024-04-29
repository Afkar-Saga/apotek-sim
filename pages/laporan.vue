<template>
  <div>
    <div class="title">Laporan</div>
    <div class="input-group">
      <label for="from">Dari Tanggal: </label>
      <div class="input">
        <input type="date" id="from" v-model="dateRange.from">
      </div>
      <label for="to">Sampai Tanggal: </label>
      <div class="input">
        <input type="date" id="to" v-model="dateRange.to">
      </div>
    </div>
    <div class="table">
      <table>
        <caption>Transaksi</caption>
        <thead>
          <tr>
            <th>#</th>
            <th>Tanggal Transaksi</th>
            <th>Total Bayar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending || filterStatus == 'pending'">
            <td colspan="3"><Loader class="loader" /></td>
          </tr>
          <tr v-else-if="!filteredTransaksi" v-for="(transaksi, index) in transaksis" :key="transaksi.id">
            <th>{{ index + 1 }}</th>
            <td>{{ transaksi.tgl_transaksi }}</td>
            <td>{{ transaksi.total_bayar }}</td>
          </tr>
          <tr v-else v-for="(transaksi, index) in filteredTransaksi" :key="index">
            <th>{{ index + 1 }}</th>
            <td>{{ transaksi.tgl_transaksi }}</td>
            <td>{{ transaksi.total_bayar }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="container">
      <Bar v-if="!(pending) && !(filterStatus == 'pending')" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, plugins, scales } from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, Title, Tooltip, Legend, BarElement, LinearScale)

definePageMeta({
  layout: 'main',
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const dateRange = ref({
  from: '',
  to: ''
})

const { data: transaksis, pending } = useAsyncData('transaksi', async () => {
  const { data, error } = await supabase.from('transaksi').select()
  if (error) throw error
  return data
})

const { data: filteredTransaksi, execute: filterTransaksi, status: filterStatus } = useAsyncData('filteredTransaksi', async () => {
  const { data, error } = await supabase.from('transaksi').select().gte('tgl_transaksi', dateRange.value.from).lte('tgl_transaksi', dateRange.value.to)
  if (error) throw error
  return data
}, { immediate: false })

function chartLabels(transaksi) {
  return [...new Set(transaksi.map(row => row.tgl_transaksi))]
}
function chartDatas(transaksi) {
  return Object.values(transaksi.reduce((acc, { tgl_transaksi, total_bayar }) => ({
    ...acc, [tgl_transaksi]: (acc[tgl_transaksi] || 0) + total_bayar
  }), {}))
}

const chartData = computed(() => {
  return {
    labels: filteredTransaksi.value ? chartLabels(filteredTransaksi.value) : chartLabels(transaksis.value),
    datasets: [{
      label: 'Omset',
      data: filteredTransaksi.value ? chartDatas(filteredTransaksi.value) : chartDatas(transaksis.value),
      backgroundColor: 'rgb(53, 162, 235)',
      maxBarThickness: 200
    }]
  }
})

const chartOptions = ref({
  responsive: true
})

watch(dateRange.value, () => {
  if (dateRange.value.from && dateRange.value.to) filterTransaksi()
})
</script>

<style scoped>
@import url('~/assets/css/main.css');
.input-group {
  align-items: center;
}
</style>