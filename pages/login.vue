<template>
  <div class="login-container">
    <div class="decor"></div>
    <form @submit.prevent="login" class="main">
      <h1>Apotek XYZ</h1>
      <img src="~/assets/img/logo_apotek.png" alt="Logo Apotek">
      <div>{{ errorMessage }}</div>
      <div class="input">
        <input type="text" id="username" v-model="username" placeholder=" " required @input="checkUsername">
        <label>Username</label>
      </div>
      <div class="input">
        <input type="password" id="password" v-model="password" placeholder=" " required>
        <label>Password</label>
      </div>
      <Loader v-if="loading" />
      <input v-else type="submit" value="Login" class="submit">
    </form>
    <div class="decor"></div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const { data: users } = useAsyncData('users', async () => {
  const { data, error } = await supabase.from('users').select()
  if (error) throw error
  return data
})

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const checkUsername = () => {
  users.value.forEach(user => {
    if (user.username == username.value) document.getElementById('password').focus()
  })
}

async function login() {
  try {
    loading.value = true
    const { data, error } = await supabase.from('users').select('id, email').eq('username', username.value).maybeSingle()
    if (error) throw error
    if (data) {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: password.value
      })
      if (error) throw error
      else {
        const { error } = await supabase.from('log').insert({
          aktivitas: 'Login',
          id_user: data.id
        })
        if (error) throw error
        else navigateTo('/')
      }
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  document.getElementById('username').focus()
})
</script>

<style scoped>
@import url('~/assets/css/main.css');
.login-container {
  width: 1340px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
h1 {
  font-size: 80px;
  font-weight: lighter;
}
.main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 45px;
}
.decor {
  width: 240px;
  height: 100%;
  background-color: #090;
}
</style>