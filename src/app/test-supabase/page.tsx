import { supabase } from '../../utils/supabase'

export default async function TestSupabase() {
  const { data, error } = await supabase.from('your_table_name').select('*')

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <div>
      <h1>Supabase Connection Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
