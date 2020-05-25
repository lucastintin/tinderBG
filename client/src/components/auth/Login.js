import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <>
            <div>
                <h1>Login</h1>
                <form>
                    <input type='text' placeholder='Email' name='inp_email' />
                    <br/>
                    <br/>
                    <input type='password' placeholder="Senha" name='inp_senha' />
                    <br/>
                    <br/>
                    <input type='submit' value='Entrar' />
                </form>
            </div>
            <div>
                <Link to='/register'>
                    Ainda não tem cadastro? Registre-se
                </Link>
            </div>
        </>
    )
}

export default Login;