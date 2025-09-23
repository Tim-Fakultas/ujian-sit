import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='bg-black text-white flex min-h-screen flex-col items-center justify-center gap-4'>
      <h2>Not Found!</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}