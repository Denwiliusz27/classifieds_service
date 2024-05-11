import {ChangeEvent} from "react";

type DefaultType = {
    id: string | number;
    name: string;
}

function Select<T extends DefaultType>(
    {labelName, name, placeholder, onChange, value, options, error}: {
        labelName: string
        name: string
        placeholder: string
        onChange: (event: ChangeEvent<HTMLSelectElement>) => void
        value: any
        options: Array<T>
        error?: string
    }
) {
    return (
        <div className="flex flex-col items-start mb-4 w-full">
            <label className="font-bold text-2xl mx-6 mb-3">{labelName}</label>

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full h-14 drop-shadow-2xl border-2 focus:border-4 rounded-2xl text-2xl px-6  ${error ? 'border-red-500' : 'border-amber-900 mb-7'}`}
            >
                <option value="" disabled={value !== 0}>{placeholder}</option>
                {options.map((option) => {
                    return (
                        <option
                            key={option.id}
                            value={option.id}
                        >
                            {option.name}
                        </option>
                    )
                })}
            </select>

            {error && (
                <div className="italic text-red-500 font-bold text-lg text-center w-full h-7">
                    <p>{error}</p>
                </div>
            )}
        </div>
    )
}

export default Select