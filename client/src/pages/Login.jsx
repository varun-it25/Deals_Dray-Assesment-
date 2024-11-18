import { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import Error from '../Components/Error';

const Login = () => {
    const [show, setShow] = useState(false);
    const [isError, setError] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [isValidInput, setInputValid] = useState(false);

    document.title = 'Login';
    const nav = useNavigate();

    useEffect(() => {
        setInputValid(username.trim().length > 0 && password.trim().length > 0);
    }, [username, password]);

    async function submit(e) {
        e.preventDefault();
        if (isValidInput) {
            if (show) setShow(false);
            if (isError) setError(false);
            setSubmitting(true);

            try {
                const res = await axios.post('https://employees-production-712d.up.railway.app/login', { username, password });
                cookies.save('user_token', res.data, { path: '/' });
                cookies.save('user_token', res.data, { path: '/employees' });
                cookies.save('user_token', res.data, { path: '/create-employee' });
                cookies.save('user_token', res.data, { path: '/update-employee/:id' });
                localStorage.setItem('user_name', username);
                setSubmitting(false);
                setUsername('');
                setPassword('');
                nav('/');
            } catch (err) {
                setError(err.response.data);
                setSubmitting(false);
            }
        }
    }

    function showPassword(e) {
        e.preventDefault();
        setShow((prevShow) => !prevShow);
    }

    return (
        <div className='w-screen h-screen bg-zinc-50 flex flex-col justify-center items-center'>
            <Error error={isError} />
            <form className='w-96 p-6 border-2 bg-white flex flex-col justify-center items-center rounded-lg' onSubmit={submit}>
                <p className='font-semibold text-2xl'>Login</p>
                <p className='w-full mb-1 ml-[4px] mt-1'>Username</p>
                <input
                    type='text'
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); if (isError) setError(false); }}
                    className={`border-2 ${isError ? 'border-red-400 outline-red-400' : ''} px-2 py-1 w-full rounded-md`}
                />
                <div className='w-full mb-1 mt-3 mx-[4px] flex justify-between items-center'>
                    <p>Password</p>
                    <p className='text-sm font-bold mr-2 cursor-pointer' onClick={showPassword}>{show ? 'Hide' : 'Show'}</p>
                </div>
                <input
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (isError) setError(false); }}
                    className={`border-2 ${isError ? 'border-red-400 outline-red-400' : ''} px-2 py-1 w-full rounded-md`}
                />
                {
                    !isValidInput && <button disabled className='rounded-md p-2 w-full bg-zinc-600 mt-4 text-white font-semibold cursor-not-allowed'>Login</button>
                }
                {
                    isSubmitting
                        ? <button disabled className='rounded-md p-2 w-full bg-zinc-600 mt-4 text-white font-semibold cursor-not-allowed'>Submitting...</button>
                        : isValidInput && <button className='rounded-md p-2 w-full bg-green-600 hover:bg-green-700 mt-4 text-white font-semibold'>Login</button>
                }
            </form>
        </div>
    );
};

export default Login;