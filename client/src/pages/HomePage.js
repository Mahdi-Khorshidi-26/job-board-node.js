import JobList from "../components/JobList";
import { useQuery } from "@apollo/client";
import { GET_JOBS } from "../graphql/queries";
import { memo, useState } from "react";
import PaginationBar from "../components/PaginationBar";

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const offsetValue = (currentPage - 1) * 10  ;
  const { data, loading, error } = useQuery(GET_JOBS, {
    variables: {
      limit: 10,
      offset: offsetValue,
    },
    fetchPolicy: "cache-first",
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const totalPages = Math.ceil(data.jobs.totalItemsCount / 10);
  return (
    <div>
      <h1 className="title">Job Board</h1>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          fontSize: "1.5rem",
        }}
      >
        <Button
          text={"previous page"}
          onclick={() =>
            setCurrentPage((prev) => (prev <= 1 ? prev : prev - 1))
          }
        />
        <span>
          - {currentPage} of {totalPages} -
        </span>
        <Button
          text={"next page"}
          // disabled={data.jobs.totalItemsCount / 10 < currentPage + 1}
          onclick={() =>
            setCurrentPage((prev) => {
              if (data.jobs.totalItemsCount / 10 < prev + 1) {
                return 1;
              }
              return prev + 1;
            })
          }
        />
      </div> */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <JobList jobs={data.jobs.items} />
    </div>
  );
}

export default memo(HomePage);
