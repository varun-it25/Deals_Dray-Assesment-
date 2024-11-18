import Logo from '../assets/404-emoji.png'
import { Link } from 'react-router-dom'

const Not_Found = () => {
  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
      <div className='flex flex-col flex-1 w-full justify-center items-center'>
        <img src={Logo} className='h-28'/>
        <p className='text-4xl font-bold mt-5'>404 Error</p>
        <p className='text-sm font-medium text-zinc-400 mt-3'>Sorry, it seems like the page you are looking does not exixt</p>
        <Link to='/'><button className='px-10 py-3 border-2 border-zinc-300 text-zinc-800 font-bold rounded-lg mt-8'>Bact to home</button></Link>
      </div>
    </div>
  )
}

export default Not_Found