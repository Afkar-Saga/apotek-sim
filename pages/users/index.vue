<template>
  <div>
    <div class="title">Users</div>
    <div class="table">
      <table>
        <caption>Users</caption>
        <thead>
          <tr>
            <th>#</th>
            <th>Tipe User</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Telpon</th>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td colspan="9"><Loader class="loader" /></td>
          </tr>
          <tr v-else v-for="(user, index) in users" :key="user.id">
            <th>{{ index + 1 }}</th>
            <td>{{ user.tipe_user }}</td>
            <td>{{ user.nama_user }}</td>
            <td>{{ user.alamat }}</td>
            <td>{{ user.telpon }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.password }}</td>
            <td>
              <div class="btn-icon" @click="navigateTo(`/users/${user.id}`)">
                <img src="~/assets/img/edit.png" alt="Edit">
              </div>
              <div class="btn-icon" @click="showDeleteConfirmation = true">
                <img src="~/assets/img/delete.png" alt="Delete">
              </div>
            </td>
            <DeleteConfirmation v-if="showDeleteConfirmation" @cancel="showDeleteConfirmation = false" @delete="deleteUser(user.id)" />
          </tr>
        </tbody>
      </table>
    </div>
    <div class="container">
      <NuxtLink to="/users/tambah"><button class="submit">Tambah User</button></NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'main',
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const showDeleteConfirmation = ref(false)

const { data: users, pending, refresh } = useAsyncData('users', async () => {
  const { data, error } = await supabase.from('users').select().order('tipe_user')
  if (error) throw error
  return data
})

async function deleteUser(userId) {
  const data = await $fetch(`api/user/${userId}`, {
    method: 'DELETE'
  })
  if (data) {
    showDeleteConfirmation.value = false
    refresh()
  }
}
</script>

<style scoped>
@import url('~/assets/css/main.css');
</style>