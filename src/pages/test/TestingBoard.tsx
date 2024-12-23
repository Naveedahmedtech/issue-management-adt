import Board from "../../components/Board"

function TestingBoard() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-blue-600 text-white p-4 text-center">
                <h1 className="text-2xl font-bold">Project Management</h1>
            </header>
            <main>
                <Board/>
            </main>
        </div>
    );
}

export default TestingBoard;
