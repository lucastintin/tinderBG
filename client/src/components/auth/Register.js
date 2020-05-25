import React, { Fragment, useState } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
        senha2: ''
    });

    const {email, senha, senha2 } = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value });
    
    const onSubmit = e => {
        e.preventDefault();
        if (senha !== senha2){
            console.log("Senhas são diferentes")
        } else {
            console.log(formData)
        }
    }

    return (
        <Fragment>
            <h1>Registro</h1>
            <form onSubmit={e => onSubmit(e)}>
                <input 
                    type='text' 
                    placeholder='Email' 
                    name='email' 
                    value={email} 
                    onChange= { e => onChange(e) }
                />
                <br/>
                <br/>
                <input
                    type='password' 
                    placeholder="Senha" 
                    name='senha' 
                    value={senha} 
                    onChange= { e => onChange(e) }
                />
                <br/>
                <br/>
                <input 
                    type='password'
                    placeholder="Confirme tua senha"
                    name='senha2' 
                    value={senha2} 
                    onChange= { e => onChange(e) }
                />
                <br/>
                <br/>
                <input type='submit' value='Registrar' />
            </form>            
        </Fragment>
    )
}

export default Register
