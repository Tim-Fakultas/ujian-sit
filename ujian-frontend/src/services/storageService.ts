import { supabase } from '../lib/supabase'

export const uploadFileKeSupabase = async (file: File, nim: string, jenisDokumen: string) => {
  // Ambil ekstensi file (pdf, png, dll)
  const fileExt = file.name.split('.').pop()
  
  // Format nama file: ktm.pdf, transkrip.pdf, dll
  const fileName = `${jenisDokumen.toLowerCase().replace(/\s/g, '_')}.${fileExt}`
  
  // Path di storage: "23051450225/ktm.pdf"
  const filePath = `${nim}/${fileName}`

  const { data, error } = await supabase.storage
    .from('dokumen-mahasiswa')
    .upload(filePath, file, {
      upsert: true // Ganti file lama jika user upload ulang
    })

  if (error) {
    throw error
  }

  // Ambil URL publiknya
  const { data: { publicUrl } } = supabase.storage
    .from('dokumen-mahasiswa')
    .getPublicUrl(filePath)

  return publicUrl
}

export const deleteFileDariSupabase = async (url: string) => {
  try {
    // Ekstrak path dari URL publik Supabase
    // Format: .../storage/v1/object/public/dokumen-mahasiswa/NIM/filename.ext
    const parts = url.split('dokumen-mahasiswa/')
    if (parts.length < 2) return

    const filePath = parts[1]

    const { error } = await supabase.storage
      .from('dokumen-mahasiswa')
      .remove([filePath])

    if (error) throw error
  } catch (error) {
    console.error('Error deleting file from Supabase:', error)
    // Jangan throw error di sini agar update database tetap berjalan meskipun delete file gagal
  }
}