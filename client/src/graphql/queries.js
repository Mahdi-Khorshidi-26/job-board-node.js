import { gql } from "@apollo/client";

const jobDetails = gql`
  fragment jobDetails on Job {
    id
    title
    companyId
    date
    description
    company {
      id
      name
      description
    }
  }
`;

const companyDetails = gql`
  fragment companyDetails on Company {
    id
    name
    description
    jobs {
      id
      title
      description
      date
    }
  }
`;

export const GET_JOB = gql`
  query get_job($jobId: ID!) {
    job(id: $jobId) {
      ...jobDetails
    }
  }
  ${jobDetails}
`;

export const CREATE_JOB = gql`
  mutation ($input: createJobInput!) {
    job: createJob(input: $input) {
      ...jobDetails
    }
  }
  ${jobDetails}
`;

export const GET_JOBS = gql`
  query ($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
        ...jobDetails
      }
      totalItemsCount
    }
  }
  ${jobDetails}
`;

export const GET_COMPANY = gql`
  query get_company($companyId: ID!) {
    company(id: $companyId) {
      ...companyDetails
    }
  }
  ${companyDetails}
`;
