import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchTasks = async (search = '', page = 1) => {
    const response = await axiosInstance.get("CongViec" + `?search=${search}&page=${page}`);
    return response.data;
};

export const addTask = async (task) => {
    const response = await axiosInstance.post("CongViec", task);
    return response.data;
};
export const updateTask = async (id, task) => {
    const response = await axiosInstance.put("CongViec" + "/" + id, task);
    return response.data;
};
export const fetchByIdTask = async (id) => {
    const response = await axiosInstance.get("CongViec"+"/"+id);
    return response.data;
};
export const updateCompleteTask = async (id, task,mucDo) => {
    const response = await axiosInstance.put("CongViec" + "/UpdateCompleteTask/" + id+"?trangThai="+task+"&mucDo="+mucDo);
    return response.data;
};
export const updateTaskDay = async (id, thoiGianKetThuc) => {
    const response = await axiosInstance.post(`CongViec/UpdateTaskDay?id=${id}&thoiGianKetThuc=${thoiGianKetThuc}`);
    return response.data;
};


