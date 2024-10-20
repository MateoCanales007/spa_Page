/* import React from 'react';
import { useForm } from 'react-hook-form';

const UserForm = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre:</label>
                <input
                    id="name"
                    {...register('name', { required: true })}
                    className="form-control"
                />
                {errors.name && <span className="text-danger">Este campo es obligatorio</span>}
            </div>

            <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo Electrónico:</label>
                <input
                    id="email"
                    type="email"
                    {...register('email', { required: true })}
                    className="form-control"
                />
                {errors.email && <span className="text-danger">Este campo es obligatorio</span>}
            </div>

            <button type="submit" className="btn btn-primary">Enviar</button>
        </form>
    );
};

export default LoginForm; */