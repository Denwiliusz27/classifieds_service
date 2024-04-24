function LoginRegister() {
    return (
        <div
            className="overflow-hidden bg-cover bg-no-repeat text-center h-screen"
            style={{backgroundImage: `url(https://www.dfdhouseplans.com/blog/wp-content/uploads/2022/11/Blueprint-1024x678.jpg)`}}>
            <div
                className="flex flex-col justify-center items-center bottom-0 left-0 right-0 top-0 h-screen w-full overflow-hidden bg-fixed"
                style={{backgroundColor: `rgba(255, 255, 255, 0.7)`}}>

                {/* Login elements*/}
                <div className="flex flex-col h-full items-center m-4 pt-8 w-2/3">
                    <h1 className="text-3xl font-bold">Zaloguj jako</h1>

                    <div className="flex flex-row my-10 space-x-10 ">
                        {/* Element with client*/}
                        <div
                            className="flex items-center bg-white rounded-2xl w-80 h-80 text-xl font-bold overflow-hidden shadow-2xl">
                            <div className="zooming_card">
                                <div className="zooming_card_img"
                                     style={{backgroundImage: `url(https://i0.wp.com/gamjobs.com/wp-content/uploads/2023/06/139328-using-girl-laptop-png-file-hd.png?resize=259%2C300&ssl=1)`}}>
                                </div>
                                <h1 className="zooming_card_txt">Klient</h1>
                            </div>
                        </div>

                        {/* Element with specialist*/}
                        <div
                            className="flex items-center bg-white rounded-2xl w-80 h-80 text-xl font-bold overflow-hidden shadow-2xl">
                            <div className="zooming_card">
                                <div className="zooming_card_img"
                                     style={{backgroundImage: `url(https://spower.com.sg/wp-content/uploads/2022/03/industrail-workers-and-engineers-transparent-33121-optimized.png)`}}>
                                </div>
                                <h1 className="zooming_card_txt">Specjalista</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center m-0 pt-8 w-2/3">
                    <h1 className="text-3xl font-bold">Nie masz jeszcze konta? Zarejestruj się!</h1>


                </div>
            </div>
        </div>

    )
}

export default LoginRegister;