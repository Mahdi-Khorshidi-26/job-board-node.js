import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router";
import { CREATE_JOB, GET_JOB, GET_JOBS } from "../graphql/queries";
import { memo } from "react";

function CreateJobPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createJob, { error, loading }] = useMutation(CREATE_JOB);
  const handleSubmit = (event) => {
    event.preventDefault();
    createJob({
      variables: {
        input: { title, description },
      },

      update(cache, { data: { job } }) {
        console.log("createJob", job);

        if (!job) return; // Ensure the mutation returned a valid result

        try {
          // Read the existing jobs from the cache
          const existingData = cache.readQuery({
            query: GET_JOBS,
          });

          const updatedJobs = existingData
            ? [...existingData.jobs, job] // Add the new job to the existing list
            : [job]; // If no existing jobs, initialize with the new job

          // Write the updated list back to the cache
          cache.writeQuery({
            query: GET_JOBS,
            data: {
              jobs: updatedJobs,
            },
          });
          cache.writeQuery({
            query: GET_JOB,
            variables: { id: job.id },
            data: { job },
          });

          console.log("Cache updated successfully!");
        } catch (error) {
          console.error("Cache update error:", error);
        }
      },
    }).then(({ data: { job } }) => {
      console.log("data from then", job);
      // Optionally navigate after submission
      navigate(`/jobs/${job.id}`);
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <h1 className="title">New Job</h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                rows={10}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                className="button is-link"
                onClick={handleSubmit}
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default memo(CreateJobPage);
