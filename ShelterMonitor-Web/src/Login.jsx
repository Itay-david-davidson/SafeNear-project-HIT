import React, { useState } from 'react'  

function LoginForm(props) {

    //declares state and sets the initial state to null
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    //submit function
    const onSubmit = e => {
        e.preventDefault();
        setProcessing(true);
        signIn(username, password)
            .then(() => {
                setUsername(null);
                setPassword(null);
                setError(null);
                setProcessing(false);
                //push to dashboard
            }).catch(err => {
                setError(err.message);
                setProcessing(false);
            });
    };
    return (
        < form >
            <h1>Login</h1>
            //display error message if there is an error
            {error ? <h4>{error}</h4> : ''}
            <input type='text' name='username' required placeholder='Username'
                value={username} onChange={e => setUsername(e.currentTarget.value)} />
            <input type='password' name='password' required placeholder='Password'
                value={password} onChange={e => setPassword(e.currentTarget.value)} />
            <button type='submit'>{processing ? 'Checking Credentials...' : 'Login'}</button>
        </form >
    );
};


const signIn = async (username, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to sign in')
    }

    const data = await response.json()
    setUser(data)
}

export default LoginForm;