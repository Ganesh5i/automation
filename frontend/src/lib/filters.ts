/** Sentinel for "no filter" — Base UI Select does not support empty string values. */
export const ALL_FILTER_VALUE = "__all__";

export function filterValueToParam(value: string): string {
  return value === ALL_FILTER_VALUE ? "" : value;
}

export function paramToFilterValue(value: string | null | undefined): string {
  return value?.trim() ? value : ALL_FILTER_VALUE;
}

/** Kerala districts + common job locations used across India. */
export const LOCATION_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: "All Locations" },
  { value: "Thiruvananthapuram", label: "Thiruvananthapuram" },
  { value: "Kollam", label: "Kollam" },
  { value: "Pathanamthitta", label: "Pathanamthitta" },
  { value: "Alappuzha", label: "Alappuzha" },
  { value: "Kottayam", label: "Kottayam" },
  { value: "Idukki", label: "Idukki" },
  { value: "Ernakulam", label: "Ernakulam" },
  { value: "Thrissur", label: "Thrissur" },
  { value: "Palakkad", label: "Palakkad" },
  { value: "Malappuram", label: "Malappuram" },
  { value: "Kozhikode", label: "Kozhikode" },
  { value: "Wayanad", label: "Wayanad" },
  { value: "Kannur", label: "Kannur" },
  { value: "Kasaragod", label: "Kasaragod" },
  { value: "Bangalore", label: "Bangalore" },
  { value: "Chennai", label: "Chennai" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Pune", label: "Pune" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Delhi", label: "Delhi" },
  { value: "Remote", label: "Remote" },
] as const;

export const JOB_ROLE_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: "All Roles" },
  { value: "Software Engineer Intern", label: "Software Engineer Intern" },
  { value: "Associate Software Engineer", label: "Associate Software Engineer" },
  { value: "SDE-1", label: "SDE-1" },
  { value: "Senior Software Engineer", label: "Senior Software Engineer" },
  { value: "Frontend Developer", label: "Frontend Developer" },
  { value: "Backend Developer", label: "Backend Developer" },
  { value: "Full Stack Developer", label: "Full Stack Developer" },
  { value: "Systems Engineer", label: "Systems Engineer" },
  { value: "Data Analyst", label: "Data Analyst" },
  { value: "Business Analyst", label: "Business Analyst" },
  { value: "QA Engineer", label: "QA Engineer" },
  { value: "DevOps Engineer", label: "DevOps Engineer" },
  { value: "Product Manager", label: "Product Manager" },
  { value: "UI/UX Designer", label: "UI/UX Designer" },
  { value: "HR Executive", label: "HR Executive" },
  { value: "Marketing Executive", label: "Marketing Executive" },
  { value: "Sales Executive", label: "Sales Executive" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "Content Writer", label: "Content Writer" },
] as const;

export const JOB_TYPE_FILTER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: "All Types" },
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "REMOTE", label: "Remote" },
  { value: "CONTRACT", label: "Contract" },
] as const;
