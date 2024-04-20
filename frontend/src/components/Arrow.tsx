import React from "react";

function Arrow() {
    return(
        <div className="flex flex-col items-end">
            <div className="relative">
                <div className="bg-amber-900 rounded-md h-1 w-20"></div>
                <div
                    className="bg-amber-900 rounded-md h-1 w-6 absolute top-0 right-0 transform translate-x-1 translate-y-2 -rotate-45"></div>
                <div
                    className="bg-amber-900 rounded-md h-1 w-6 absolute bottom-0 right-0 transform translate-x-1 -translate-y-2 rotate-45"></div>
            </div>
        </div>
    )
}

export default Arrow;