import { serverSupabaseServiceRole } from '#supabase/server'

export default eventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')

  const { data, error } = await supabase.auth.admin.deleteUser(id!)
  if (error) throw error

  return data
})