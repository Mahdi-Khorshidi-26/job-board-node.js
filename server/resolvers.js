import { getCompanies, getCompany } from "./db/companies.js";
import {
  getJobs,
  getJob,
  getJobsByCompany,
  createJob,
  deleteJob,
  updateJob,
  getJobsCount,
} from "./db/jobs.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    jobs: (_root, { limit, offset }) => {
      const totalItemsCount = getJobsCount();
      const items = getJobs({ limit, offset });
      return { items, totalItemsCount };
    },
    companies: () => getCompanies(),
    job: async (_, { id }) => {
      const job = await getJob(id);
      if (!job) {
        customErrorHandler(`No job found with id: ${id}`, "NOT_FOUND");
      }
      return job;
    },
    company: async (_, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        customErrorHandler(`No company found with id: ${id}`, "NOT_FOUND");
      }
      return company;
    },
  },
  Job: {
    id: (job) => job.id,
    companyId: (job) => job.companyId,
    title: (job) => job.title,
    description: (job) => job.description,
    date: (job) => job.createdAt.slice(0, "yyyy-mm-dd".length),
    // company: (job) => getCompany(job.companyId),
    company: (job, _args, { companyLoader }) =>
      companyLoader.load(job.companyId),
  },
  Company: {
    id: (company) => company.id,
    name: (company) => company.name,
    description: (company) => company.description,
    jobs: (company) => getJobsByCompany(company.id),
  },
  Mutation: {
    createJob: async (_, { input: { title, description } }, { user }) => {
      if (!user) {
        customErrorHandler("Unauthorized", "UNAUTHORIZED");
      }
      const { companyId } = user;
      const createdJob = await createJob({
        title,
        description,
        companyId,
      });
      return createdJob;
    },
    deleteJob: async (_, { id }, { user }) => {
      if (!user) {
        customErrorHandler("Unauthorized", "UNAUTHORIZED");
      }
      const { companyId } = await user;
      const deletedJob = await deleteJob(id, companyId);
      if (!deletedJob) {
        customErrorHandler(`No job found with id: ${id}`, "NOT_FOUND");
      }
      return deletedJob;
    },
    updateJob: async (_, { input: { id, title, description } }, { user }) => {
      if (!user) {
        customErrorHandler("Unauthorized", "UNAUTHORIZED");
      }
      const companyId = await user.companyId;
      const updatedJob = await updateJob({ id, title, description, companyId });
      if (!updatedJob) {
        customErrorHandler(`No job found with id: ${id}`, "NOT_FOUND");
      }
      return updatedJob;
    },
  },
};

function customErrorHandler(errorMessage, extensionsCode) {
  throw new GraphQLError(errorMessage, {
    extensions: {
      code: extensionsCode,
    },
  });
}
