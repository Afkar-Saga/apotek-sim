<template>
  <div>
    <div class="title">Log Activity</div>
    <div class="table">
      <table>
        <caption>Log</caption>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Waktu</th>
            <th>Aktivitas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td class="loader" colspan="4"><Loader /></td>
          </tr>
          <tr v-for="(log, index) in logs" :key="log.id">
            <th>{{ index + 1 }}</th>
            <td>{{ log.users.username }}</td>
            <td>{{ log.waktu.split('.')[0].replace('T', ' ') }}</td>
            <td>{{ log.aktivitas }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'main',
  middleware: 'auth'
})

const supabase = useSupabaseClient()

const { data: logs, pending } = useAsyncData('log', async () => {
  const { data, error } = await supabase.from('log').select(`
    *,
    users ( username )
  `)
  if (error) throw error
  return data
})
</script>

<style scoped>
@import url('~/assets/css/main.css');
</style>