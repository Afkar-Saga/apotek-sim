<template>
  <div class="sidenav">
    <div class="brand">
      <img src="~/assets/img/logo_apotek.png" alt="Logo Apotek">
      <span>Apotek XYZ</span>
    </div>
    <nav class="nav">
      <slot></slot>
      <Loader v-if="loading" />
      <button v-else @click="logout">Logout</button>
    </nav>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(false)

async function logout() {
  try {
    loading.value = true
    const { error } = await supabase.from('log').insert({
      aktivitas: 'Logout',
      id_user: user.value.id
    })
    if (error) throw error
    else {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      else navigateTo('/login')
    }
  } catch (error) {
    console.error(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.sidenav {
  height: 100%;
  background: linear-gradient(to right bottom, #090, #070);
  color: white;
  box-shadow: 2px 0 5px 5px rgba(0, 0, 0, 0.25);
  flex: 1 0 14%;
}
.brand {
  display: flex;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #777;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-size: 24px;

  img {
    width: 50px;
  }
  span {
    margin-left: 10px;
  }
}
.nav {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}
button {
  background: none;
  border: none;
  color: #aaa;
  font-size: 16px;
  cursor: pointer;
  transition: .3s;

  &:hover {
    color: red;
  }
}
</style>