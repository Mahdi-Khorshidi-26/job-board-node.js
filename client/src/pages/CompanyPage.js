import { useParams } from "react-router";
import { useQuery } from "@apollo/client";
import JobList from "../components/JobList";
import { GET_COMPANY } from "../graphql/queries";
import { memo } from "react";

function CompanyPage() {
  const { companyId } = useParams();
  const { data, loading, error } = useQuery(GET_COMPANY, {
    variables: {
      companyId,
    },
    fetchPolicy: "cache-first",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 className="title">{data.company.name}</h1>
      <div className="box">{data.company.description}</div>
      <h2 className="title is-5">{data.company.name} JOBS</h2>
      <JobList jobs={data.company.jobs} />
    </div>
  );
}

export default memo(CompanyPage);