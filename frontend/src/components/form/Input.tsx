import {ChangeEvent} from "react";

function Input(
    {labelName, type, name, placeholder, onChange, value, error}: {
        labelName: string
        type: string
        name: string
        placeholder: string
        onChange: (event: ChangeEvent<HTMLInputElement>) => void
        value: any
        error?: string
    }
) {
    return (
        <div className="flex flex-col items-start mb-4 w-full">
            <label className="font-bold text-2xl mx-6 mb-3">{labelName}</label>
            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                value={value || ''}
                className={`w-full h-14 drop-shadow-2xl border-2 focus:border-4 rounded-2xl text-2xl px-6  ${error ? 'border-red-500' : 'border-amber-900 mb-7'}`}
            />
            {error && (
                <div className="italic text-red-500 drop-shadow-xl font-bold text-lg text-center w-full h-7">
                    <p>{error}</p>
                </div>
            )}
        </div>
    )
}

export default Input