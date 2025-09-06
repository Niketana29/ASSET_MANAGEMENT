import { toast } from "react-toastify";

export function apiErrorHandler(error) {

  if (!error.response) {

    toast.error("Network error. Please check your connection.");
    return;
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      toast.error(data?.message || "Bad request.");
      break;
    case 401:
      toast.error("Unauthorized. Please login again.");
      break;
    case 403:
      toast.error("You do not have permission to perform this action.");
      break;
    case 404:
      toast.error("Requested resource not found.");
      break;
    case 500:
      toast.error("Server error. Please try again later.");
      break;
    default:
      toast.error(data?.message || "Something went wrong.");
  }
}
