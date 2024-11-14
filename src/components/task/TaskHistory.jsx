import { useDispatch, useSelector } from "react-redux";
import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import { useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import {
  fetchTaskHistories,
  fetchTaskHistoryById,
} from "../../redux/taskhistory/taskhistorySlice";
import API_ENDPOINTS from "../../constant/linkapi";
import getConnection from "../../hub/signalRConnection";

const TaskHistory = ({ openTaskHistory, setOpenTaskHistory, maCongViec }) => {
  const dispatch = useDispatch();
  //const [connection, setConnection] = useState(null);
  const connection=getConnection();
  const lichsucongviec = useSelector((state) => state.taskhistories.list);
  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchTaskHistories());
    };
    loadData();
  }, [dispatch, maCongViec]);
  // useEffect(() => {
  //   const newConnection = new HubConnectionBuilder()
  //     .withUrl(API_ENDPOINTS.HUB_URL, {
  //       transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
  //     })
  //     .withAutomaticReconnect([0, 2000, 10000, 30000])
  //     .configureLogging(LogLevel.Information)
  //     .build();
  //   newConnection.serverTimeoutInMilliseconds = 2 * 60 * 1000;

  //   setConnection(newConnection);
  // }, []);
  useEffect(() => {
    const connectSignalR = async () => {
      if(connection){
        if (connection.state === "Disconnected") {
          try {
            await connection.start();
            console.log("Connected!");
    
            connection.on("loadLichSuCongViec", async () => {
              await dispatch(fetchTaskHistories());
            });
          } catch (error) {
            console.error("Connection failed: ", error);
          }
        }else if(connection.state === "Connected"){
          try {
            console.log("Connected!");
    
            connection.on("loadLichSuCongViec", async () => {
              await dispatch(fetchTaskHistories());
            });
          } catch (error) {
            console.error("Connection failed: ", error);
          }
        }
      }
    };
    connectSignalR(); 
    return () => {
      if (connection) {
        connection.off("loadLichSuCongViec");
      }
    };
  }, [dispatch, connection]);
  const lichsu = lichsucongviec.filter(
    (item) => item.maCongViec === maCongViec
  );
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };
  const getItemClassName = (content) => {
    if (content.includes("hoàn thành")) {
      return "bg-green-100 border-green-400";
    } else if (content.includes("phân công")) {
      return "bg-gray-100 border-gray-400";
    }
    return "";
  };
  return (
    <>
       <ModalWrapper open={openTaskHistory} setOpen={setOpenTaskHistory}>
        <div className="bg-gray-50 py-6">
          <h2 className="text-lg font-semibold mb-4">Lịch Sử Công Việc</h2>
          {lichsu.length === 0 ? (
            <p>Không có lịch sử nào cho công việc này.</p>
          ) : (
            <div className="relative max-h-60 overflow-y-auto">
              <ul className="space-y-6">
                {lichsu.map((item) => (
                  <li key={item.maLichSuCongViec} className="relative flex items-center">
                    {/* Dòng nối giữa các mục */}
                    <div className="absolute left-2 top-0 bottom-0 border-l border-gray-300"></div>
                    {/* Thời gian và nội dung */}
                    <div className="pl-4">
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full ${getItemClassName(item.noiDung)}`}></span>
                        <span className="ml-2 text-sm">{formatDateTime(item.ngayCapNhat)}</span>
                      </div>
                      <p className={`mt-1 ${getItemClassName(item.noiDung)}`}>
                        {item.noiDung}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="sm:flex sm:flex-row-reverse gap-4 mt-4">
            <Button
              type="button"
              className="bg-blue-600 px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpenTaskHistory(false)}
              label="Hủy"
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
};
export default TaskHistory;
