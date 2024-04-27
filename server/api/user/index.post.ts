import { serverSupabaseServiceRole } from '#supabase/server'

export default eventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  const body = await readBody(event)

  const { data, error } = await supabase.auth.admin.createUser({
    email: body.email,
    password: body.password,
    user_metadata: {
      tipe_user: body.user_metadata.tipe_user,
      username: body.user_metadata.username
    },
    email_confirm: true,
  })
  if (error) {
    if (error.status == 422) {
      throw createError({
        statusCode: error.status,
        statusMessage: 'User with this email already exist'
      })
    }
    else throw error
  }

  return data
})