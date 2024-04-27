<template>
  <div>
    <div class="wrapper">
      <Navbar>
        <img src="~/assets/img/logo_admin.png" alt="Admin" v-if="tipe_user == 'Admin'">
        <img src="~/assets/img/logo_apoteker.png" alt="Apoteker" v-if="tipe_user == 'Apoteker'">
        <img src="~/assets/img/logo_kasir.png" alt="Kasir" v-if="tipe_user == 'Kasir'">
        <div class="username">{{ username }}</div>
        <NuxtLink to="/log" v-if="['Admin'].includes(tipe_user)" :class="{ active: route.name.split(['-'])[0].includes('log') }">Log Activity</NuxtLink>
        <NuxtLink to="/users" v-if="['Admin'].includes(tipe_user)" :class="{ active: route.name.split(['-'])[0].includes('users') }">Kelola User</NuxtLink>
        <NuxtLink to="/obat" v-if="['Admin', 'Apoteker'].includes(tipe_user)" :class="{ active: route.name.split(['-'])[0].includes('obat') }">Kelola Obat</NuxtLink>
        <NuxtLink to="/resep" v-if="['Admin', 'Apoteker'].includes(tipe_user)" :class="{ active: route.name.split(['-'])[0].includes('resep') }">Kelola Resep</NuxtLink>
        <NuxtLink to="/transaksi" v-if="['Admin', 'Kasir'].includes(tipe_user)" :class="{ active: route.name.split(['-'])[0].includes('transaksi') }">Transaksi</NuxtLink>
        <NuxtLink to="/laporan" v-if="['Admin'].includes(tipe_user)" :class="{ active: route.name.split(['-'])[0].includes('laporan') }">Laporan</NuxtLink>
      </Navbar>
      <div class="main">
        <main class="content">
          <div class="card">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { data: { username, tipe_user }, error } = await supabase.from('users').select('username, tipe_user').eq('id', user.value.id).maybeSingle()
if (error) throw error
</script>

<style scoped>
@import url('~/assets/css/main.css');
div:has(.wrapper) {
  overflow: hidden;
  height: 100vh;
}
.wrapper {
  display: flex;
  background-color: #f7fbf5;
  height: 100%;
}
.main {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
}
.content {
  padding: 3rem;
  max-width: 100vw;
  width: 100%;
  flex: 1;
}
.card {
  padding: 18px 32px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(37, 41, 34, 0.15);
}
.username {
  font-size: 24px;
}
a {
  width: 100%;
  height: 50px;
  color: white;
  font-size: 16px;
  text-align: center;
  line-height: 50px;
  text-decoration: none;
  transition: .3s;

  &:hover {
    background-color: #03600b;
  }
  &.active {
    color: #96ff96;
    font-weight: bold;
    border-left: 3px solid #96ff96;
  }
}
</style>