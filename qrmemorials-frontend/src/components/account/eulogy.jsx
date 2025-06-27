import QuillEditorEulogy from '../QuillEditorEulogy';

function Eulogy({ eulogyData, handleEulogySubmit, handleChangeEulogy }) {

    return (
        <form onSubmit={handleEulogySubmit} >

            <div className="w-full   dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
                <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6 ">Eulogy
                </h4>
                <div className="mb-4">

                    <div>
                        <label className="text-base  text-title dark:text-white leading-none  block">Description*</label>
                              {eulogyData && (
                                <QuillEditorEulogy eulogyData={eulogyData} handleChangeEulogy={handleChangeEulogy} />
                            )}
                        
                    </div>
                </div>

                <div className="mt-5 sm:mt-8 md:mt-12">
                    <button className="btn btn-solid" data-text="Submit" type='submit'>
                        <span>Submit</span>
                    </button>
                </div>
            </div>
        </form>

    )
}

export default Eulogy