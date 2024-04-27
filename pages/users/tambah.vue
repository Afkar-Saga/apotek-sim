<template>
  <div>
    <div class="title"><NuxtLink to="/users">Users</NuxtLink> > Tambah</div>
    <form @submit.prevent="execute">
      <div class="input-group">
        <div class="input">
          <select v-model="form.tipeUser" :class="{ selected: form.tipeUser }" required>
            <option disabled value="">Pilih Tipe User</option>
            <option>Admin</option>
            <option>Apoteker</option>
            <option>Kasir</option>
          </select>
        </div>
        <div class="input">
          <input type="text" v-model="form.namaUser" placeholder=" " required>
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
  tipeUser: '',
  namaUser: '',
  alamat: '',
  telpon: '',
  username: '',
  email: '',
  password: '',
})

const { execute, error, status } = useAsyncData('user', async () => {
  const data = await $fetch('/api/user', {
    method: 'POST',
    body: {
      email: form.value.email,
      password: form.value.password,
      user_metadata: {
        tipe_user: form.value.tipeUser,
        username: form.value.username
      }
    }
  })
  if (data) insertUser(data.user.id)
}, { immediate: false })

async function insertUser(userId) {
  const { error } = await supabase.from('users').insert({
    id: userId,
    tipe_user: form.value.tipeUser,
    nama_user: form.value.namaUser,
    alamat: form.value.alamat,
    telpon: form.value.telpon,
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
  })
  if (error) throw error
  else {
    alert("Berhasil menambah user baru")
    navigateTo('/users')
  }
}
</script>

<style scoped>
@import url('~/assets/css/main.css');
</style>