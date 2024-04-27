import { serverSupabaseServiceRole } from '#supabase/server'

export default eventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const { data, error } = await supabase.auth.admin.updateUserById(id!, {
    email: body.email,
    password: body.password,
    user_metadata: {
      tipe_user: body.user_metadata.tipe_user,
      username: body.user_metadata.username
    },
    email_confirm: true,
  })
  if (error) throw error

  return data
})