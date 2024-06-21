import {Link} from "react-router-dom";
import React from "react";


function ZoomingImageDiv(
    {path, img, text, txt_size, state}: {
        path: string
        img: string
        text: string
        txt_size: string
        state?: number
    }
) {
    return (
        <>
            {state ?
                <Link
                    to={path} state={{specializationId: state}}
                    className={`flex items-center bg-white rounded-2xl w-full h-full text-xl font-bold overflow-hidden shadow-2xl`}
                >
                    <div className="flex relative items-center w-full h-full overflow-hidden justify-center group">
                        <div
                            className="w-full h-full opacity-60 absolute bg-cover bg-center transition-all duration-500 ease-in-out transform group-hover:scale-150"
                            style={{ backgroundImage: `url(${img})` }}
                        ></div>
                        <h1 className={`text-${txt_size} font-extrabold absolute transition-all drop-shadow-[2px_2px_var(--tw-shadow-color)] shadow-black  duration-500 ease-in-out transform text-amber-900 scale-110 group-hover:scale-90`}>
                            {text}
                        </h1>
                    </div>
                </Link>
                :
                <Link
                    to={path}
                    className={`flex items-center bg-white rounded-2xl w-full h-full text-xl font-bold overflow-hidden shadow-2xl`}
                >
                    <div className="flex relative items-center w-full h-full overflow-hidden justify-center group">
                        <div
                            className="w-full h-full opacity-60 absolute bg-cover bg-center transition-all duration-500 ease-in-out transform group-hover:scale-150"
                            style={{ backgroundImage: `url(${img})` }}
                        ></div>
                        <h1 className={`text-${txt_size} font-extrabold absolute transition-all drop-shadow-lg shadow-white duration-500 ease-in-out transform text-amber-900 scale-110 group-hover:scale-90`}>
                            {text}
                        </h1>
                    </div>
                </Link>

            }
        </>
    )
}

export default ZoomingImageDiv