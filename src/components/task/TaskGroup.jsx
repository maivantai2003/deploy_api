import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../Button";
import AddTask from "./AddTask";
import TaskListItem from "./TaskListItem";
import { HubConnectionBuilder,LogLevel, HttpTransportType } from '@microsoft/signalr';
import { useDispatch } from "react-redux";
import { checkPermission } from "../../redux/permissiondetail/permissionDetailSlice";
import API_ENDPOINTS from "../../constant/linkapi";
import getConnection from "../../hub/signalRConnection";

const TaskGroup = ({ phanduan, duAn }) => {
  const [open, setOpen] = useState(false);
  //const [connection, setConnection] = useState(null);
  const [taskRoot, setTaskRoot] = useState(false);
  const [permissionAction,setpermissionAction]=useState([])
  const maquyen=Number(localStorage.getItem("permissionId"))
  const connection=getConnection()
  const dispatch=useDispatch();
  const { id } = useParams();
  useEffect(()=>{
    const fetchData=async ()=>{
      const result=await dispatch(checkPermission({maQuyen:maquyen,tenChucNang:"Công Việc"})).unwrap()
      setpermissionAction(result)
    }
    fetchData();
  },[dispatch])
  // useEffect(()=>{
  //   const newConnection = new HubConnectionBuilder()
  //     .withUrl(API_ENDPOINTS.HUB_URL,{transport:HttpTransportType.WebSockets | HttpTransportType.LongPolling,}).withAutomaticReconnect([0, 2000, 10000, 30000])
  //     .configureLogging(LogLevel.Information)
  //     .build();
  //     newConnection.serverTimeoutInMilliseconds = 2 * 60 * 1000
  //   setConnection(newConnection);
  // },[])
  useEffect(() => {
    const connectSignalR = async () => {
      if(connection){
        if (connection.state === "Disconnected") {
          try {
            await connection.start();
            console.log("Connected!");
    
            connection.on("loadHanhDong", async () => {
              try {
                const result = await dispatch(checkPermission({ maQuyen: maquyen, tenChucNang: "Công Việc" })).unwrap();
                setpermissionAction(result);
              } catch (error) {
                console.error("Error when checking permission: ", error);
              }
            });
          } catch (error) {
            console.error("Connection failed: ", error);
          }
        }else if(connection.state === "Connected"){
          try {
            console.log("Connected!");
    
            connection.on("loadHanhDong", async () => {
              try {
                const result = await dispatch(checkPermission({ maQuyen: maquyen, tenChucNang: "Công Việc" })).unwrap();
                setpermissionAction(result);
              } catch (error) {
                console.error("Error when checking permission: ", error);
              }
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
        connection.off("loadHanhDong");
      }
    };
  }, [dispatch, connection, maquyen]);
  const groupedTasks = (phanduan.congViecs || []).reduce((acc, task) => {
    const parentId = task.maCongViecCha || 'root'; 
    if (!acc[parentId]) {
      acc[parentId] = [];
    }
    acc[parentId].push(task);
    return acc;
  }, {});

  const renderTasks = (tasks, duAn) => {
    return tasks.map((task) => (
      <div key={task.maCongViec}>
        <TaskListItem duAn={duAn} congviec={task} />
        {groupedTasks[task.maCongViec] && groupedTasks[task.maCongViec].length > 0 && (
          <div className="ml-6">
            {renderTasks(groupedTasks[task.maCongViec], duAn)}
          </div>
        )}
      </div>
    ));
  };
  return (
    <div className="w-full bg-transparent border-b-1">
      <div className="p-4 w-full flex items-center justify-between font-semibold bg-white text-gray-600 mb-2 mt-4 shadow-sm border-y text-sm">
        <span>{phanduan.tenPhan}</span>
        {permissionAction.includes("Thêm") &&
        <Button
          onClick={() => setOpen(true)}
          label="Tạo công việc"
          className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 px-3 text-xs"
        />}
      </div>
      
      <div className="bg-slate-50 shadow-md p-4 space-y-2">
        {groupedTasks['root'] ? renderTasks(groupedTasks['root'], duAn) : <p>Chưa có công việc nào.</p>}
      </div>
  
      <AddTask open={open} setOpen={setOpen} phanDuAn={phanduan.maPhanDuAn} duAn={duAn} congViecCha={taskRoot} />
    </div>
  );
};

export default TaskGroup;
