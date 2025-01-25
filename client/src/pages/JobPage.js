import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatters";
import { useQuery } from "@apollo/client";
import { GET_JOB } from "../graphql/queries";
import { memo } from "react";
function JobPage() {
  const { jobId } = useParams();
  const { data, loading, error } = useQuery(GET_JOB, {
    variables: { jobId },
    fetchPolicy: "cache-first",
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <h1 className="title is-2">{data.job.title}</h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${data.job.company.id}`}>
          {data.job.company.name}
        </Link>
      </h2>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {formatDate(data.job.date, "long")}
        </div>
        <p className="block">{data.job.description}</p>
      </div>
    </div>
  );
}

export default memo(JobPage);
