import Table from "../Table";




const Documents = ({columns, data}: {columns: any, data: any, setIsUploadModalOpen:any}) => {


    return (
        <div className="bg-background min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-text mb-4 sm:mb-0">Project Documents</h1>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center w-full sm:w-auto">
                    {/*<button className="px-4 py-2 bg-primary rounded-md w-full sm:w-auto" onClick={() => setIsUploadModalOpen(true)}>Add File</button>*/}
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search"
                            className="px-4 py-2 pl-10 border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
                        />
                        <span className="absolute left-2 top-2/4 transform -translate-y-2/4 text-textHover">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            <Table columns={columns} data={data} />
        </div>
    );
};

export default Documents;
