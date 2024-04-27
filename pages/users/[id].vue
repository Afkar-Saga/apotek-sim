<template>
  <div>
    <div class="title"><NuxtLink to="/users">Users</NuxtLink> > Edit</div>
    <div class="container">
      <Loader v-if="loadUser" />
      <div class="detail" v-else>
        <div>Tipe User: {{ user.tipe_user }}</div>
        <div>Nama User: {{ user.nama_user }}</div>
        <div>Alamat: {{ user.alamat }}</div>
        <div>Telpon: {{ user.telpon }}</div>
        <div>Username: {{ user.username }}</div>
        <div>Email: {{ user.email }}</div>
        <div>Password: {{ user.password }}</div>
      </div>
    </div>
    <form @submit.prevent="updateUser">
      <div class="input-group">
        <div class="input">
          <select v-model="form.tipe_user" :class="{ selected: form.tipe_user }" required>
            <option disabled value="">Pilih Tipe User</option>
            <option>Admin</option>
            <option>Apoteker</option>
            <option>Kasir</option>
          </select>
        </div>
        <div class="input">
          <input type="text" v-model="form.nama_user" placeholder=" " required>
          <label>Nama</label>
        </div>
        <div class="input">
          <input type="text" v-model="form.alamat" placeholder=" " required>
          <label>Alamat</label>
        </div>
        <div class="input">
          <input type="tel" v-model="form.telpon" pattern="08[0-9]{10}" placeholder=" " required>
          <label>Telpon (e.g. 081283439986)</label>
        </div>
        <div class="input">
          <input type="text" v-model="form.username" placeholder=" " required>
          <label>Username</label>
        </div>
        <div class="input">
          <input type="text" v-model="form.email" placeholder=" " required>
          <label>Email</label>
        </div>
        <div class="input">
          <input type="text" v-model="form.password" placeholder=" " required>
          <label>Password</label>
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
  tipe_user: '',
  nama_user: '',
  alamat: '',
  telpon: '',
  username: '',
  email: '',
  password: '',
})

const { data: user, pending: loadUser } = useAsyncData('user', async () => {
  const { data, error } = await supabase.from('users').select().eq('id', id).maybeSingle()
  if (error) throw error
  form.value = data
  return data
})

const { status, error, execute: updateUser } = useAsyncData('insertUser', async () => {
  const data = await $fetch(`/api/user/${id}`, {
    method: 'PUT',
    body: {
      email: form.value.email,
      password: form.value.password,
      user_metadata: {
        tipe_user: form.value.tipeUser,
        username: form.value.username
      }
    }
  })
  if (data) updateUserTable()
}, { immediate: false })

async function updateUserTable() {
  const { error } = await supabase.from('users').update(form.value).eq('id', id)
  if (error) throw error
  else navigateTo('/users')
}
</script>

<style scoped>
@import url('~/assets/css/main.css');
</style>