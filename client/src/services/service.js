import http from "../http-common";

class DataService {
  getAllEntries(entryId) {
    return http.get(`/`);
  }

  createEntry(data) {
    return http.post("/", data);
  }

  editEntry(entryId, data) {
    return http.put(`/${entryId}`, data);
  }

  deleteEntry(entryId) {
    return http.delete(`/${entryId}`);
  }

  addComment(entryId, data) {
    return http.post(`/${entryId}`, data);
  }

  deleteComment(entryId, commentId) {
    return http.delete(`/${entryId}/${commentId}`);
  }
}

export default new DataService();
