import IssueActivity from "./IssueActivity";


const Activity = ({ projectId, issues, issueId }: any) => {


  return (
    <div>

        <IssueActivity
          projectId={projectId}
          issues={issues}
          issueId={issueId}
        />
    </div>
  );
};

export default Activity;
