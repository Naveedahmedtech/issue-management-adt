import Button from "../buttons/Button.tsx";
import TaskModal from "../modal/TaskModal.tsx";
import TaskCard from "./TaskCard.tsx";

const CardLayout = ({
                        handleFilterChange,
                        activeFilter,
                        handleViewTask,
                        isModalOpen,
                        selectedTask,
                        setIsModalOpen,
                        groupedTasks,
                        setIsEditMode,
                        isEditMode,
                        component,
                        refetch,
                        isLoading,
                        isArchived,
                        projectId,
                        setActiveTab, 
                        setIssueId,
                        refetchFiles
                    }: any) => {
    // Determine sections to show based on the active filter
    const sectionsToShow = activeFilter === "All" ? Object.keys(groupedTasks) : [activeFilter];

    // if (isLoading) return (
    //     <div className="flex justify-center items-center min-h-[200px]">
    //         <div className="text-textDark text-lg font-semibold">Loading issues...</div>
    //     </div>
    // );
    return (
        <div className="text-textDark">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-4 mb-4">
                {["All", "Active", "On Going", "Completed"].map((status) => (
                    <Button
                        key={status}
                        text={status}
                        onClick={() => handleFilterChange(status)}
                        preview={activeFilter === status ? "primary" : "secondary"}
                        fullWidth={false}
                        className={activeFilter === status ? "text-text" : "secondary"}
                    />
                ))}
            </div>

            {/* Sections */}
            {sectionsToShow.map((section) => (
                <div key={section} className="mb-8">
                    <h3 className="text-2xl font-bold  mb-4">{section}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedTasks[section]?.map((task: any) => (
                            <TaskCard key={task.id} task={task} onView={handleViewTask} />
                        ))}
                    </div>
                </div>
            ))}

            {/* Task Modal */}
            {isModalOpen && selectedTask && (
                <TaskModal
                    task={selectedTask}
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
                    onSave={() => {}}
                    onClose={() => {
                        setIsEditMode(false);
                        setIsModalOpen(false);
                    }}
                    component={component}
                    refetch={refetch}
                    isArchived={isArchived}
                    projectId={projectId}
                    setActiveTab={setActiveTab}
                    setIssueId={setIssueId}
                    refetchFiles={refetchFiles}
                />
            )}
        </div>
    );
};

export default CardLayout;
