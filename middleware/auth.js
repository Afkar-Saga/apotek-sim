export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  if (user.value.user_metadata.tipe_user == 'Admin') return
  if (user.value.user_metadata.tipe_user == 'Apoteker') {
    if (['index', 'obat', 'resep'].includes(to.name.split('-')[0])) return
    else return navigateTo('/')
  }
  if (user.value.user_metadata.tipe_user == 'Kasir') {
    if (['index', 'transaksi'].includes(to.name.split('-')[0])) return
    else return navigateTo('/')
  }
})