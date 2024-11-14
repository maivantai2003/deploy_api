import React, { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { useDispatch } from "react-redux";
import {
  addAssignment,
  deleteAssignment,
} from "../../redux/assignment/assignmentSlice";
import { addTaskHistory } from "../../redux/taskhistory/taskhistorySlice";
import EmployeeSelectTransfer from "./EmployeeSelect";
import { da } from "@faker-js/faker";
import { addTaskTransfer } from "../../redux/tasktransfer/tasktranferSlice";
import { updateTaskDay } from "../../redux/task/taskSlice";
import Textbox from "../Textbox";
import { toast } from "react-toastify";

const AddTaskTransfer = ({
  openTransfer,
  setOpenTransfer,
  currentEmployee,
  maCongViec,
  tenCongViec,
  maPhongBan,
  thoiGianKetThuc,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [transferNote, setTransferNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [showEndDate, setShowEndDate] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [selectedCurrentEmployee, setSelectedCurrentEmployee] = useState("");
  //console.log(thoiGianKetThuc);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        if (currentEmployee) {
          setEmployees(currentEmployee);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
      } finally {
        setLoading(false);
      }
      if (thoiGianKetThuc) {
        const formattedDate = new Date(thoiGianKetThuc)
          .toISOString()
          .slice(0, 16);
        setEndDate(formattedDate);
      }
    };
    fetchEmployees();
  }, [currentEmployee, thoiGianKetThuc]);
  //console.log(employees)
  const submitHandler = async (data) => {
    if (transferNote.length === 0 || transferNote === null) {
      toast.warning("Vui lòng nhập lý do");
      return;
    }
    if (
      selectedCurrentEmployee.length === 0 ||
      selectedCurrentEmployee === null
    ) {
      toast.warning("Vui lòng chọn nhân viên");
      return;
    }
    if (data.thoiGianKetThuc < new Date()) {
      toast.warning("Vui lập nhập lớn hơn hoặc bằng ngày hiện tại");
      return;
    }
    const selectedDate = new Date(data.thoiGianKetThuc);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      toast.warning("Vui lòng chọn ngày lớn hơn hoặc bằng ngày hiện tại");
      return;
    }
    var arrNhanVien = selectedCurrentEmployee.split("-");
    console.log(arrNhanVien);
    try {
      // tùy chọn có cập nhật ngày hay không
      if (showEndDate) {
        const updateDateResult = await dispatch(
          updateTaskDay({
            id: maCongViec,
            thoiGianKetThuc: data.thoiGianKetThuc,
          })
        );
        if (updateDateResult.payload === 1) {
          await dispatch(
            addTaskHistory({
              maCongViec: maCongViec,
              ngayCapNhat: new Date().toISOString(),
              noiDung: `${new Date().toISOString()}: thời gian kết thúc công việc đã được cập nhật tới ngày ${new Date(
                endDate
              ).toISOString()}`,
            })
          );
        }
      }
      // chuyển giao trong trường hợp muốn xóa( không chuyển giao nhân viên khác vào)
      if (selectedEmployees.length === 0) {
        var result = await dispatch(
          deleteAssignment(Number(arrNhanVien[0]))
        );
        var temp=await dispatch(
          addTaskTransfer({
            lyDoChuyenGiao: transferNote,
            vaiTro: arrNhanVien[3],
            maNhanVienChuyenGiao: Number(arrNhanVien[1]),
            maPhanCong: Number(arrNhanVien[0]),
            tenCongViec: tenCongViec,
          })
        );
        console.log(temp)
        toast.success("Chuyển giao công việc thành công");
      } else {
        for (const employee of selectedEmployees) {
          try {
            var result = await dispatch(
              deleteAssignment(Number(arrNhanVien[0]))
            );
            if (result !== null) {
              await dispatch(
                addTaskTransfer({
                  lyDoChuyenGiao: transferNote,
                  vaiTro: employee.vaiTro,
                  maNhanVienChuyenGiao: Number(arrNhanVien[1]),
                  maNhanVienThucHien: Number(employee.maNhanVien),
                  maPhanCong: Number(arrNhanVien[0]),
                  tenCongViec: tenCongViec,
                })
              );
              await dispatch(
                addAssignment({
                  maCongViec: Number(maCongViec),
                  maNhanVien: Number(employee.maNhanVien),
                  vaiTro: employee.vaiTro,
                })
              );
              await dispatch(
                addTaskHistory({
                  maCongViec: maCongViec,
                  ngayCapNhat: new Date().toISOString(),
                  noiDung: `${new Date().toISOString()}: Công việc ${tenCongViec} được chuyển giao từ ${
                    arrNhanVien[2]
                  } sang ${employee.tenNhanVien}. Nội dung: ${transferNote}`,
                })
              );
            }
          } catch (e) {
            toast.error("Chuyển giao công việc không thành công");
            console.log(e);
          }
        }
        toast.success("Chuyển giao công việc thành công");
      }
      setOpenTransfer(false);
    } catch (e) {
      toast.error("Chuyển giao công việc không thành công");
      console.log(e);
    }
  };
  return (
    <ModalWrapper open={openTransfer} setOpen={setOpenTransfer}>
      <div className="max-h-screen overflow-y-auto">
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            CHUYỂN ĐỔI CÔNG VIỆC
          </Dialog.Title>

          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nhân viên hiện tại
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedCurrentEmployee}
                onChange={(e) => setSelectedCurrentEmployee(e.target.value)}
              >
                <option value="">Chọn nhân viên hiện tại</option>
                {loading ? (
                  <option value="">Đang tải nhân viên...</option>
                ) : employees.length > 0 ? (
                  employees.filter(item => item.trangThai === true).map((item) => (
                    <option
                      key={item.maNhanVien}
                      value={
                        item.maPhanCong +
                        "-" +
                        item.maNhanVien +
                        "-" +
                        item.nhanVien.tenNhanVien+
                        "-"+item.vaiTro
                      }
                    >
                      {item.maNhanVien}-{item.nhanVien.tenNhanVien}-
                      {item.vaiTro}
                    </option>
                  ))
                ) : (
                  <option value="">Không có nhân viên nào</option>
                )}
              </select>
            </div>

            <EmployeeSelectTransfer
              maPhongBan={maPhongBan}
              selectedEmployees={selectedEmployees}
              setSelectedEmployees={setSelectedEmployees}
              employees={employees}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nội dung chuyển đổi
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-2 border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="4"
                value={transferNote}
                onChange={(e) => setTransferNote(e.target.value)}
                placeholder="Nhập nội dung chuyển đổi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày kết thúc
              </label>
              <input type="text" className="w-full rounded" value={endDate} />
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={showEndDate}
                  onChange={() => setShowEndDate(!showEndDate)}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Cập nhật thời gian kết thúc
                </span>
              </label>
            </div>
            {showEndDate && (
              <div>
                <Textbox
                  placeholder="Ngày kết thúc"
                  type="datetime-local"
                  name="date"
                  label="Ngày kết thúc"
                  className="w-full rounded"
                  register={register("thoiGianKetThuc", {
                    required: "Ngày là bắt buộc!",
                  })}
                  error={
                    errors.thoiGianKetThuc ? errors.thoiGianKetThuc.message : ""
                  }
                />
              </div>
            )}
            <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
              <Button
                label="Chuyển"
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
              />
              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpenTransfer(false)}
                label="Hủy"
              />
            </div>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default AddTaskTransfer;
